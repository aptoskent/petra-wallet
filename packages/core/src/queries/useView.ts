// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { useNetworks } from '../hooks/useNetworks';
import {
  ViewFunction,
  ViewFunctionArgs,
  ViewFunctionValue,
} from '../types/view';

export const getUseFetchViewQueryKey = 'getView';

const defaultQueryOptions = {
  staleTime: 3000,
};

export type FetchView = <F extends ViewFunction>(
  args: ViewFunctionArgs<F>,
  func: F,
) => Promise<ViewFunctionValue<F> | undefined>;

/**
 * Function for manually fetching account resources.
 * Leverages react-query caching mechanisms and shares data with `useAccountResources` query
 */
export function useFetchView(): FetchView {
  const { activeNetworkName, aptosClient } = useNetworks();
  const queryClient = useQueryClient();

  return <F extends ViewFunction>(args: ViewFunctionArgs<F>, func: F) =>
    queryClient.fetchQuery<ViewFunctionValue<F>>(
      [getUseFetchViewQueryKey, JSON.stringify(args), func, activeNetworkName],
      async () =>
        aptosClient.view({
          arguments: args,
          function: func,
          type_arguments: [],
        }) as any as Promise<ViewFunctionValue<F>>,
      defaultQueryOptions,
    );
}

/**
 * Query for retrieving an account resource
 * @param address account address
 * @param options query options
 */
export function useView<F extends ViewFunction>(
  args: ViewFunctionArgs<F>,
  func: F,
  options?: UseQueryOptions<ViewFunctionValue<F> | undefined>,
) {
  const { activeNetworkName, aptosClient } = useNetworks();

  return useQuery<ViewFunctionValue<F> | undefined>(
    [getUseFetchViewQueryKey, JSON.stringify(args), func, activeNetworkName],
    async () =>
      aptosClient.view({
        arguments: args,
        function: func,
        type_arguments: [],
      }) as any as Promise<ViewFunctionValue<F> | undefined>,
    {
      ...defaultQueryOptions,
      ...options,
    },
  );
}
