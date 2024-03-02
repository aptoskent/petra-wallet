// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/**
 * NOTE: keeping this file around as it's being used by Eric's PR sequence
 */

import { UseQueryOptions, useQuery } from 'react-query';
import {
  TokenDataFieldsFragment,
  CollectionDataFieldsFragment,
  CurrentTokenPendingClaimsFragment,
} from '@petra/indexer-client';
import {
  ExtendedTokenData,
  TokenClaim,
  TokenActivity,
  CollectionData,
} from '../types/token';

import useRestApi from '../hooks/useRestApi';
import { useNetworks } from '../hooks/useNetworks';
import { useAppState } from '../hooks/useAppState';
import { useActiveAccount } from '../hooks/useAccounts';
import { fixBadAptosUri } from '../utils/token';
import { parseTokenActivity } from './useIndexedTokenActivitiesProviderFactory';

export const getTokenQueryKey = (activeNetworkName: string, idHash: string) => [
  activeNetworkName,
  'indexedTokens',
  idHash,
];

export const getTokenActivityQueryKey = (
  activeNetworkName: string,
  idHash: string,
) => [...getTokenQueryKey(activeNetworkName, idHash), 'activity'];

export const getAllTokensPendingOfferClaimQueryKey = (
  activeNetworkName: string,
  address: string,
) => [activeNetworkName, address, 'tokensPendingOfferClaim'];

export const getHiddenTokensPendingOfferClaimQueryKey = (
  activeNetworkName: string,
  address: string,
) => [activeNetworkName, address, 'hiddenTokensPendingOfferClaim'];

export const getTokenPendingOfferClaimQueryKey = (
  activeNetworkName: string,
  tokenDataIdHash: string,
) => [activeNetworkName, tokenDataIdHash, 'pendingOfferClaimForToken'];

export const parseCollectionData = (
  collection: CollectionDataFieldsFragment | null | undefined,
): CollectionData => ({
  collectionDataIdHash: collection?.collection_id,
  collectionName: collection?.collection_name,
  creatorAddress: collection?.creator_address,
  description: collection?.description,
  idHash: collection?.collection_id,
  metadataUri: collection?.uri,
  name: collection?.collection_name,
  supply: collection?.max_supply,
});

interface ParseTokenDataProps {
  amount?: number;
  collectionData?: CollectionDataFieldsFragment;
  lastTxnVersion: bigint;
  propertyVersion?: number;
  tokenData?: TokenDataFieldsFragment | null;
  tokenProperties: { [key: string]: string };
}

function parseTokenData({
  amount,
  collectionData,
  lastTxnVersion,
  propertyVersion,
  tokenData,
  tokenProperties,
}: ParseTokenDataProps): ExtendedTokenData {
  const fixedUri = fixBadAptosUri(tokenData?.token_uri ?? '');
  return {
    amount,
    collection: tokenData?.current_collection?.collection_name ?? '',
    collectionData: parseCollectionData(collectionData),
    collectionDataIdHash: tokenData?.current_collection?.collection_id ?? '',
    creator: tokenData?.current_collection?.creator_address ?? '',
    description: tokenData?.description ?? '',
    idHash: tokenData?.token_data_id ?? '',
    isSoulbound: false,
    lastTxnVersion,
    metadataUri: fixedUri,
    name: tokenData?.token_name ?? '',
    propertyVersion,
    tokenProperties,
    tokenStandard: 'v2',
  };
}

export function useParseTokenClaim() {
  const { getNameFromAddress } = useRestApi();
  return async (tokenClaim: CurrentTokenPendingClaimsFragment) => ({
    amount: tokenClaim.amount,
    collectionData: parseCollectionData(
      tokenClaim.current_token_data_v2?.current_collection,
    ),
    fromAddress: tokenClaim.from_address,
    fromAddressName: await getNameFromAddress(tokenClaim.from_address),
    lastTransactionTimestamp: tokenClaim.last_transaction_timestamp,
    lastTransactionVersion: tokenClaim.last_transaction_version,
    toAddress: tokenClaim.to_address,
    toAddressName: await getNameFromAddress(tokenClaim.to_address),
    tokenData: parseTokenData({
      amount: tokenClaim.amount,
      lastTxnVersion: tokenClaim.last_transaction_version,
      propertyVersion: tokenClaim.property_version,
      tokenData: tokenClaim.current_token_data_v2,
      tokenProperties: tokenClaim.current_token_data_v2?.token_properties,
    }),
  });
}

const filterPendingTokenOfferClaim = ({
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

export const useTokenPendingClaims = (
  address: string,
  options?: UseQueryOptions<TokenClaim[]>,
  showHiddenOffers?: boolean,
) => {
  const { indexerClient } = useNetworks();
  const { hiddenTokens } = useAppState();
  const { activeNetworkName } = useNetworks();
  const { activeAccountAddress } = useActiveAccount();
  const queryKey = showHiddenOffers
    ? getHiddenTokensPendingOfferClaimQueryKey(
        activeNetworkName,
        activeAccountAddress,
      )
    : getAllTokensPendingOfferClaimQueryKey(
        activeNetworkName,
        activeAccountAddress,
      );
  const parseTokenClaim = useParseTokenClaim();

  return useQuery<TokenClaim[]>(
    queryKey,
    async (): Promise<TokenClaim[]> => {
      try {
        const result = (await indexerClient?.getTokenPendingClaims({
          address,
          limit: 20,
          offset: 0,
        })) ?? { current_token_pending_claims: [] };
        const currentTokenPendingClaims = result.current_token_pending_claims;

        const promises: Promise<TokenClaim>[] = [];

        currentTokenPendingClaims.forEach(
          (tokenClaim: CurrentTokenPendingClaimsFragment) => {
            promises.push(parseTokenClaim(tokenClaim));
          },
        );

        return await Promise.all(promises).then((tokenClaims: TokenClaim[]) =>
          tokenClaims.filter((pendingToken) =>
            showHiddenOffers
              ? !filterPendingTokenOfferClaim({
                  activeAccountAddress,
                  hiddenTokens,
                  pendingToken,
                })
              : filterPendingTokenOfferClaim({
                  activeAccountAddress,
                  hiddenTokens,
                  pendingToken,
                }),
          ),
        );
      } catch (e) {
        throw Error(
          `error querying pending offers and claimns for address ${address}`,
        );
      }
    },
    {
      ...options,
      enabled: indexerClient !== undefined && options?.enabled,
    },
  );
};

export const usePendingClaimsForToken = (
  idHash: string,
  options?: UseQueryOptions<TokenClaim[]>,
) => {
  const { indexerClient } = useNetworks();
  const { activeNetworkName } = useNetworks();
  const { hiddenTokens } = useAppState();
  const { activeAccountAddress } = useActiveAccount();
  const parseTokenClaim = useParseTokenClaim();

  return useQuery<TokenClaim[]>(
    getTokenPendingOfferClaimQueryKey(activeNetworkName, idHash),
    async (): Promise<TokenClaim[]> => {
      try {
        const result = (await indexerClient?.getPendingClaimsForToken({
          limit: 20,
          offset: 0,
          token_data_id_hash: idHash,
        })) ?? { current_token_pending_claims: [] };
        const currentTokenPendingClaims = result.current_token_pending_claims;
        const promises: Promise<TokenClaim>[] = [];

        currentTokenPendingClaims.forEach(
          (tokenClaim: CurrentTokenPendingClaimsFragment) => {
            promises.push(parseTokenClaim(tokenClaim));
          },
        );

        return await Promise.all(promises).then((tokenClaims: TokenClaim[]) =>
          tokenClaims.filter((pendingToken) =>
            filterPendingTokenOfferClaim({
              activeAccountAddress,
              hiddenTokens,
              pendingToken,
            }),
          ),
        );
      } catch (e) {
        throw Error(`error querying pending claimns for token ${idHash}`);
      }
    },
    {
      ...options,
      enabled: indexerClient !== undefined && options?.enabled,
    },
  );
};

export const useTokenActivities = (
  idHash: string,
  options?: UseQueryOptions<TokenActivity[]>,
) => {
  const { activeNetworkName } = useNetworks();
  const { indexerClient } = useNetworks();

  return useQuery<TokenActivity[]>(
    getTokenActivityQueryKey(activeNetworkName, idHash),
    async () => {
      try {
        const result = (await indexerClient?.getTokenActivities({
          idHash,
        })) ?? { token_activities: [] };
        const tokenActivities = result.token_activities;

        return tokenActivities.map(parseTokenActivity);
      } catch (e) {
        throw Error(`error querying token activities for token ${idHash}`);
      }
    },
    {
      ...options,
      enabled: indexerClient !== undefined && options?.enabled,
    },
  );
};
