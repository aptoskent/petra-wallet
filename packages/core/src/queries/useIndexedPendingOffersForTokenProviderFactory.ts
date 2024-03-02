// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useNetworks } from '../hooks/useNetworks';
import { TokenClaim } from '../types/token';
import { useAppState } from '../hooks/useAppState';
import { useActiveAccount } from '../hooks/useAccounts';
import { useParseTokenClaim } from './useIndexedTokens';

/**
 * Check if specified pending token is duplicated, by comparing it to the
 * key of the last pending token fetched from the indexer. Since the query results are sorted,
 * this is the only check needed to know if an element should be discarded
 * the order is last_transaction_timestamp and last_transaction_version
 * @param curr tokem to be compared
 * @param last token token from the previous query result
 */
function isPendingTokenDuplicated(curr: TokenClaim, last: TokenClaim) {
  if (curr.lastTransactionTimestamp !== last.lastTransactionTimestamp) {
    return curr.lastTransactionTimestamp > last.lastTransactionTimestamp;
  }

  return curr.lastTransactionVersion > last.lastTransactionVersion;
}

function isPendingTokenOfferVisible({
  activeAccountAddress,
  hiddenTokens,
  pendingToken,
}: {
  activeAccountAddress: string;
  hiddenTokens?: { [key: string]: { [key: string]: boolean } };
  pendingToken: TokenClaim;
}) {
  if (!hiddenTokens) return true;

  const { lastTransactionVersion } = pendingToken;
  const { idHash } = pendingToken.tokenData;
  const tokenKey = `${idHash}_${lastTransactionVersion}`;

  return !hiddenTokens?.[activeAccountAddress]?.[tokenKey];
}

interface IndexedTokensPendingClaimProviderState {
  buffer: TokenClaim[];
  isDone: boolean;
  lastTokenPendingClaim?: TokenClaim;
  offset: number;
}

/**
 * Factory for building a token provider that fetches data from the indexer.
 */
export default function useIndexedPendingOffersForTokenProviderFactory() {
  const { indexerClient } = useNetworks();
  const { hiddenTokens } = useAppState();
  const { activeAccountAddress } = useActiveAccount();
  const parseTokenClaim = useParseTokenClaim();

  return (idHash: string, queryStep: number) => {
    const state: IndexedTokensPendingClaimProviderState = {
      buffer: [],
      isDone: false,
      offset: 0,
    };

    async function fetchMore() {
      const result = (await indexerClient?.getPendingClaimsForToken({
        limit: queryStep,
        offset: state.offset,
        token_data_id_hash: idHash,
      })) ?? { current_token_pending_claims: [] };

      const promises = [];

      for (const tokenPendingClaim of result.current_token_pending_claims) {
        if (tokenPendingClaim) {
          promises.push(parseTokenClaim(tokenPendingClaim));
        }
      }

      await Promise.all(promises).then((promiseResults) => {
        for (let i = 0; i < promiseResults.length; i += 1) {
          const newTokenClaim = promiseResults[i];
          if (
            (!state.lastTokenPendingClaim ||
              !isPendingTokenDuplicated(
                newTokenClaim,
                state.lastTokenPendingClaim,
              )) &&
            isPendingTokenOfferVisible({
              activeAccountAddress,
              hiddenTokens,
              pendingToken: newTokenClaim,
            })
          ) {
            state.buffer.push(newTokenClaim);
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
