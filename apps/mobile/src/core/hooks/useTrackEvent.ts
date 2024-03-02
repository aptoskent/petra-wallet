// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-console */

import { useCallback } from 'react';
import { useAnalytics } from '@segment/analytics-react-native';

import { defaultNetworkName } from '@petra/core/types';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import {
  CombinedEventParams,
  AnalyticsEventTypeValues,
} from '@petra/core/utils/analytics/events';
import filterAnalyticsEvent from '@petra/core/utils/analytics';

const getIsDevelopment = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export interface AnalyticsEventParams {
  eventType: AnalyticsEventTypeValues;
  params?: CombinedEventParams;
}

const WHITE_LIST_PARAMS: (keyof CombinedEventParams)[] = [
  'dAppDomain',
  'dAppImageURI',
  'dAppName',
  'hasMinimumToStake',
  'isAddAccount',
  'selectStakePoolMode',
  'stakingScreen',
  'stakingTerm',
  'transactionDurationShown',
  'txnHash',
  'unknownStakingEvent',
  'url',
  'validatorSelectionRank',
  'validatorTotalOptions',
];

/**
 * @summary Segment analytics hook that communicates with analytics-node
 */
export default function useTrackEvent() {
  const { activeAccountAddress } = useAccounts();
  const { activeNetworkName } = useNetworks();
  const isDevelopment = getIsDevelopment();

  const { track } = useAnalytics();

  const trackEvent = useCallback(
    async ({ eventType, params }: AnalyticsEventParams) => {
      if (isDevelopment || !track) {
        return;
      }
      const { action, category, label } = eventType;

      try {
        const sanitizedProperties = params
          ? filterAnalyticsEvent(params)
          : undefined;

        const eventProperties = {
          ...sanitizedProperties,
          action,
          address: params?.address?.toString() ?? activeAccountAddress,
          category,
          name: label,
          network: activeNetworkName || defaultNetworkName,
        };

        if (params) {
          // We filter out params that have potentially sensitive information
          // But sometimes we want to keep some of the params

          WHITE_LIST_PARAMS.forEach((key) => {
            if (params && params[key]) {
              eventProperties[key] = params[key];
            }
          });
        }

        void track(label, eventProperties);
      } catch (err) {
        console.error(err);
      }
    },
    [activeAccountAddress, activeNetworkName, isDevelopment, track],
  );

  return {
    trackEvent,
  };
}
