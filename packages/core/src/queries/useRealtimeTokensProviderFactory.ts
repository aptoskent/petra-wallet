// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { tokenStoreStructTag } from '../constants';
import useRestApi from '../hooks/useRestApi';
import { useFetchAccountResource } from './useAccountResources';
import { fixBadAptosUri, getTokenDataId } from '../utils/token';
import useEventProviderFactory, {
  EventProvider,
} from './useEventProviderFactory';

interface RealtimeTokenProviderState {
  balances: Record<string, number>;
  buffer: string[];
  currTxnVersion: number;
  depositEventProvider: EventProvider;
  isDone: boolean;
  withdrawEventProvider: EventProvider;
}

/**
 * Factory for building a token provider that fetches data from
 * the fullnode REST API.
 */
export default function useRealtimeTokenProviderFactory() {
  const { getTokenData } = useRestApi();
  const fetchResource = useFetchAccountResource();
  const eventProviderFactory = useEventProviderFactory();

  return async (ownerAddress: string) => {
    const tokenStoreResource = await fetchResource(
      ownerAddress,
      tokenStoreStructTag,
    );
    if (tokenStoreResource === undefined) {
      return {
        fetch: () => Promise.resolve([]),
      };
    }

    // Define and initialize state of provider
    const tokenStore = tokenStoreResource.data;
    const state: RealtimeTokenProviderState = {
      balances: {},
      buffer: [],
      currTxnVersion: Infinity,
      depositEventProvider: eventProviderFactory(tokenStore.deposit_events),
      isDone: false,
      withdrawEventProvider: eventProviderFactory(tokenStore.withdraw_events),
    };

    /**
     * Fetch more own tokens by fetching withdraw and deposit events associated to
     * the account token store. By processing both event types in parallel, we can infer
     * the presence of a specific token in the token store (although the amount itself cannot be
     * inferred if not by processing all events).
     * We process token store events in reverse order, and if at any point
     * the balance of a token is positive, the token has to be in the token store and
     * any further processing of events associated to it can be skipped.
     */
    async function fetchMore() {
      const [withdrawEventsStartVersion] = await Promise.all([
        state.withdrawEventProvider.fetchMore(),
        state.depositEventProvider.fetchMore(),
      ]);

      // Process all withdrawals
      const withdrawEvents = state.withdrawEventProvider.extract(
        withdrawEventsStartVersion,
      );
      for (const { data } of withdrawEvents) {
        const tokenDataId = getTokenDataId(data.id.token_data_id);
        const amount = Number(data.amount);
        if (!(tokenDataId in state.balances)) {
          state.balances[tokenDataId] = 0;
        }

        const alreadyConfirmed = state.balances[tokenDataId] > 0;
        if (!alreadyConfirmed) {
          state.balances[tokenDataId] -= amount;
        }
      }

      // Process deposit events older than the already processed withdraw events
      const depositEvents = state.depositEventProvider.extract(
        withdrawEventsStartVersion + 1,
      );
      for (const { data } of depositEvents) {
        const tokenDataId = getTokenDataId(data.id.token_data_id);
        const amount = Number(data.amount);
        if (!(tokenDataId in state.balances)) {
          state.balances[tokenDataId] = 0;
        }

        const alreadyConfirmed = state.balances[tokenDataId] > 0;
        if (!alreadyConfirmed) {
          state.balances[tokenDataId] += amount;
          if (state.balances[tokenDataId] > 0) {
            state.buffer.push(tokenDataId);
          }
        }
      }

      state.isDone = state.depositEventProvider.isDone();
    }

    async function fetch(amount: number) {
      while (!state.isDone && state.buffer.length < amount) {
        // eslint-disable-next-line no-await-in-loop
        await fetchMore();
      }

      const tokenDataIds = state.buffer.splice(0, amount);
      return Promise.all(
        tokenDataIds.map(async (tokenDataId) => {
          const [creator, collection, name] = tokenDataId.split('::');
          const tokenData = await getTokenData(creator, collection, name);
          tokenData.metadataUri = fixBadAptosUri(tokenData.metadataUri);
          return tokenData;
        }),
      );
    }

    return { fetch };
  };
}
