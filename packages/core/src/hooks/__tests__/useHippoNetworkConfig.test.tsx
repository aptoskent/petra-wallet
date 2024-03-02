// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { renderHook } from '@testing-library/react';

import useHippoNetworkConfig from '../useHippoNetworkConfig';

jest.mock('@manahippo/hippo-sdk', () => ({
  CONFIGS: {
    mainnet: {
      name: 'mainnet',
    },
  },
}));

jest.mock('../useNetworks', () => ({
  useNetworks: () => ({ activeNetworkName: 'Mainnet' }),
}));

test('should return network config from hippo', async () => {
  const { result } = renderHook(() => useHippoNetworkConfig());
  expect(result.current?.name).toBe('mainnet');
});
