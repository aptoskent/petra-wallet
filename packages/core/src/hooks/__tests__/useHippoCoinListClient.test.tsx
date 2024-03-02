// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { renderHook } from '@testing-library/react';
import { CoinListClient } from '@manahippo/coin-list';
import useCoinListClient from '../useHippoCoinListClient';

jest.mock('../useHippoNetworkConfig', () => () => ({ name: 'mainnet' }));

test('should return coin list client', async () => {
  const { result } = renderHook(() => useCoinListClient());
  expect(result.current).toBeInstanceOf(CoinListClient);
  expect(result.current.network).toBe('mainnet');
});
