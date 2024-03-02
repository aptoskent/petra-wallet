// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AptosName } from '../utils/names';
import { useAddressFromName } from './useNameAddress';

jest.mock('../hooks/useRestApi', () => () => ({
  getAddressFromName: async (name: AptosName) => `0x${name.noSuffix()}`,
}));

describe('useAddressFromName', () => {
  it('caches results correctly', async () => {
    const client = new QueryClient();
    const { rerender, result } = renderHook(
      ({ name }) => useAddressFromName(name),
      {
        initialProps: { name: new AptosName('kent.apt') },
        wrapper: (props) => <QueryClientProvider {...props} client={client} />,
      },
    );
    await waitFor(() => result.current.isLoading);
    await waitFor(() => !result.current.isLoading);
    expect(result.current.isSuccess);
    expect(result.current.data).toBe('0xkent');

    rerender({ name: new AptosName('gabi.apt') });
    await waitFor(() => result.current.isLoading);
    await waitFor(() => !result.current.isLoading);
    expect(result.current.isSuccess);
    expect(result.current.data).toBe('0xgabi');
  });
});
