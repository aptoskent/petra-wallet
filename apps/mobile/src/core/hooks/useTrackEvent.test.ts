// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { renderHook } from '@testing-library/react-native';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import useTrackEvent from './useTrackEvent';

const ADDRESS =
  '0xfb385da49059a1a0617f085eddeeb67ef2b0f4d0ca0b3e324f36af35650351fa';

const mockTrack = jest.fn();

jest.mock('@segment/analytics-react-native', () => ({
  useAnalytics: () => ({ track: mockTrack }),
}));

jest.mock('@petra/core/hooks/useAccounts', () => ({
  useAccounts: () => ({ activeAccountAddress: '' }),
}));

jest.mock('@petra/core/hooks/useNetworks', () => ({
  useNetworks: () => ({ activeNetworkName: '' }),
}));

describe('useTrackEvents', () => {
  it('should redact values that are addresses', () => {
    const { result } = renderHook(() => useTrackEvent());

    result.current.trackEvent({
      eventType: stakingEvents.ADVANCED_MODE_TOGGLED,
      params: {
        // we collect address, now that address is no longer nested in properties
        // this test needs to be updated to be a different address like key
        fromAddress: ADDRESS,
      },
    });

    const lastCallArgs = mockTrack.mock.calls[mockTrack.mock.calls.length - 1];
    expect(lastCallArgs[0]).toBe(stakingEvents.ADVANCED_MODE_TOGGLED.label);
    expect(lastCallArgs[1].fromAddress).toBe('[redacted]');
  });

  it('it should not redact whitelisted keys', () => {
    const { result } = renderHook(() => useTrackEvent());

    result.current.trackEvent({
      eventType: stakingEvents.ADVANCED_MODE_TOGGLED,
      params: {
        txnHash: ADDRESS,
      },
    });

    const lastCallArgs = mockTrack.mock.calls[mockTrack.mock.calls.length - 1];
    expect(lastCallArgs[0]).toBe(stakingEvents.ADVANCED_MODE_TOGGLED.label);
    expect(lastCallArgs[1].txnHash).toBe(ADDRESS);
  });
});
