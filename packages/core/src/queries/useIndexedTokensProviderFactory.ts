// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type {
  TokenDataFieldsFragment,
  CollectionDataFieldsFragment,
} from '@petra/indexer-client';
import { TokenData, CollectionData, TokenStandard } from '../types/token';
import { useNetworks } from '../hooks/useNetworks';
import { fixBadAptosUri } from '../utils/token';
import { parseCollectionData } from './useIndexedTokens';

type ExtendedTokenData = TokenData & {
  amount: number;
  collectionData: CollectionData;
  lastTxnVersion: bigint;
  propertyVersion: number;
  tokenProperties: { [key: string]: string };
};

/**
 * Parse token data from the result of an indexer query
 * @param data token data
 * @param lastTxnVersion last transaction version associated with a change in ownership
 */
function parseTokenData(
  data: TokenDataFieldsFragment,
  lastTxnVersion: bigint,
  collectionData: CollectionDataFieldsFragment | null | undefined,
  amount: number,
  propertyVersion: number,
  tokenProperties: { [key: string]: string },
  tokenStandard: TokenStandard,
  isSoulbound: boolean,
): ExtendedTokenData {
  const fixedUri = fixBadAptosUri(data.token_uri);
  return {
    amount,
    collection: data.current_collection?.collection_name ?? '',
    collectionData: parseCollectionData(collectionData),
    creator: data.current_collection?.creator_address ?? '',
    description: data.description,
    idHash: data.token_data_id,
    isSoulbound,
    lastTxnVersion,
    metadataUri: fixedUri,
    name: data.token_name,
    propertyVersion,
    tokenProperties,
    tokenStandard,
  };
}

/**
 * Check if specified token is duplicated, by comparing it to the
 * key of the last token fetched from the indexer. Since the query results are sorted,
 * this is the only check needed to know if an element should be discarded
 * this must match the logic in the operations.graphql
 * @param curr tokem to be compared
 * @param last token token from the previous query result
 */
function isTokenDuplicated(curr: ExtendedTokenData, last: ExtendedTokenData) {
  if (curr.lastTxnVersion !== last.lastTxnVersion) {
    return curr.lastTxnVersion > last.lastTxnVersion;
  }
  return curr.idHash > last.idHash;
}

interface IndexedTokensProviderState {
  buffer: ExtendedTokenData[];
  isDone: boolean;
  lastToken?: ExtendedTokenData;
  offset: number;
}

/**
 * Factory for building a token provider that fetches data from the indexer.
 */
export default function useIndexedTokensProviderFactory() {
  const { indexerClient } = useNetworks();

  return (ownerAddress: string, queryStep: number) => {
    const state: IndexedTokensProviderState = {
      buffer: [],
      isDone: false,
      offset: 0,
    };

    async function fetchMore() {
      const result = (await indexerClient?.getAccountCurrentTokens({
        address: ownerAddress,
        limit: queryStep,
        offset: state.offset,
      })) ?? { current_token_ownerships_v2: [] };

      for (const tokenOwnership of result.current_token_ownerships_v2) {
        const currentCollectionData =
          tokenOwnership.current_token_data?.current_collection;
        const v1Properties = tokenOwnership.token_properties_mutated_v1 ?? {};
        const v2tokenProperties =
          tokenOwnership.current_token_data?.token_properties ?? {};
        const tokenProperties = { ...v1Properties, ...v2tokenProperties };
        const tokenStandard =
          tokenOwnership.token_standard === 'v2' ? 'v2' : 'v1';
        const {
          amount,
          current_token_data: tokenData,
          is_soulbound_v2: isSoulbound,
          last_transaction_version: lastTxnVersion,
          property_version_v1: propertyVersion,
        } = tokenOwnership;
        if (tokenData) {
          const newToken = parseTokenData(
            tokenData,
            lastTxnVersion,
            currentCollectionData,
            amount,
            propertyVersion,
            tokenProperties,
            tokenStandard,
            isSoulbound ?? false,
          );
          if (
            !state.lastToken ||
            !isTokenDuplicated(newToken, state.lastToken)
          ) {
            state.buffer.push(newToken);
          }
        }
      }

      state.offset += result.current_token_ownerships_v2.length;
      state.lastToken = state.buffer[state.buffer.length - 1];
      state.isDone = result.current_token_ownerships_v2.length < queryStep;
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
