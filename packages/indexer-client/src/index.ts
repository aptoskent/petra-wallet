// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/sdk';

export default function makeClient(endpoint: string) {
  const graphqlClient = new GraphQLClient(endpoint);
  return getSdk(graphqlClient);
}

export type {
  CoinActivityFieldsFragment,
  CollectionDataFieldsFragment,
  CurrentTokenPendingClaimsFragment,
  TokenActivitiesFragment,
  TokenDataFieldsFragment,
} from './generated/operations';
