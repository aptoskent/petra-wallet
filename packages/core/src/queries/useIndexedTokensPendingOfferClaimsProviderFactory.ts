// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { CurrentTokenPendingClaimsFragment } from '@petra/indexer-client';
import { useAppState } from '../hooks/useAppState';
import { useActiveAccount } from '../hooks/useAccounts';
import { useNetworks } from '../hooks/useNetworks';
import { TokenClaim } from '../types/token';
import { useParseTokenClaim } from './useIndexedTokens';

interface IndexedTokensPendingClaimProviderState {
  buffer: TokenClaim[];
  isDone: boolean;
  lastTokenPendingClaim?: TokenClaim;
  offset: number;
}

/**
 * Check if specified pending token is duplicated, by comparing it to the
 * last_transaction_timestamp and last_transaction_version of the last pending token
 * fetched from the indexer. Since the query results are sorted,
 * this is the only check needed to know if an element should be discarded
 * @param curr token to be compared
 * @param last token token from the previous query result
 */
function isPendingTokenDuplicated(curr: TokenClaim, last: TokenClaim) {
  if (curr.lastTransactionTimestamp !== last.lastTransactionTimestamp) {
    return curr.lastTransactionTimestamp > last.lastTransactionTimestamp;
  }

  return curr.lastTransactionVersion > last.lastTransactionVersion;
}

const isPendingTokenOfferVisible = ({
  activeAccountAddress,
  hiddenTokens,
  pendingToken,
}: {
  activeAccountAddress: string;
  hiddenTokens?: { [key: string]: { [key: string]: boolean } };
  pendingToken: TokenClaim;
}) => {
  if (!hiddenTokens) return true;

  const { lastTransactionVersion } = pendingToken;
  const { idHash } = pendingToken.tokenData;
  const tokenKey = `${idHash}_${lastTransactionVersion}`;

  return !hiddenTokens?.[activeAccountAddress]?.[tokenKey];
};

/**
 * Factory for building a token provider that fetches data from the indexer.
 */
export default function useIndexedTokensPendingOfferClaimsProviderFactory(
  showHiddenOffers?: boolean,
) {
  const { indexerClient } = useNetworks();
  const { hiddenTokens } = useAppState();
  const { activeAccountAddress } = useActiveAccount();
  const parseTokenClaim = useParseTokenClaim();

  return (ownerAddress: string, queryStep: number) => {
    const state: IndexedTokensPendingClaimProviderState = {
      buffer: [],
      isDone: false,
      offset: 0,
    };

    async function fetchMore() {
      const result:
        | { current_token_pending_claims: CurrentTokenPendingClaimsFragment[] }
        | undefined = (await indexerClient?.getTokenPendingClaims({
        address: ownerAddress,
        limit: queryStep,
        offset: state.offset,
      })) ?? { current_token_pending_claims: [] };

      const promises = [];
      for (const tokenPendingClaim of result.current_token_pending_claims) {
        promises.push(parseTokenClaim(tokenPendingClaim));
      }

      const fetchedTokenClaims = await Promise.all(promises);

      fetchedTokenClaims.forEach((tokenClaim: TokenClaim) => {
        if (
          !state.lastTokenPendingClaim ||
          !isPendingTokenDuplicated(tokenClaim, state.lastTokenPendingClaim)
        ) {
          const isVisible = isPendingTokenOfferVisible({
            activeAccountAddress,
            hiddenTokens,
            pendingToken: tokenClaim,
          });
          if (
            (showHiddenOffers && !isVisible) ||
            (!showHiddenOffers && isVisible)
          ) {
            state.buffer.push(tokenClaim);
          }
        }
      });

      state.offset += result.current_token_pending_claims.length;
      state.lastTokenPendingClaim = state.buffer[state.buffer.length - 1];
      state.isDone = result.current_token_pending_claims.length < queryStep;
    }

    async function fetch(amount: number) {
      while (!state.isDone && state.buffer.length < amount) {
        // eslint-disable-next-line no-await-in-loop
        await fetchMore();
      }

      return state.buffer.splice(0, amount);
    }

    return { fetch };
  };
}
