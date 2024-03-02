// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-console */

import constate from 'constate';
import { useCallback, useEffect, useMemo } from 'react';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { useLocation } from 'react-router-dom';

import { defaultNetworkName } from '@petra/core/types';
import { getOS } from '@petra/core/utils/os';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { getBrowser } from '@petra/core/utils/browser';
import {
  CombinedEventParams,
  AnalyticsEventTypeValues,
} from '@petra/core/utils/analytics/events';
import filterAnalyticsEvent from '@petra/core/utils/analytics';
import { noInitializedAccountRoutePathDict } from '../routes';
import packageJson from '../../../package.json';

const getIsDevelopment = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const getWriteKey = () => process.env.REACT_APP_SEGMENT_WRITE_KEY;
const { version: $extensionVersion } = packageJson;

interface AnalyticsGeneralEventParams {
  eventType: AnalyticsEventTypeValues;
  page: string;
  params?: CombinedEventParams;
  screen: string;
  value?: bigint;
}

type AnalyticsPageEventParams = Omit<
  AnalyticsGeneralEventParams,
  'screen' | 'eventType'
>;

type AnalyticsScreenEventParams = Omit<
  AnalyticsGeneralEventParams,
  'page' | 'eventType'
>;

type AnalyticsEventParams = Omit<
  AnalyticsGeneralEventParams,
  'page' | 'screen'
>;

const isNotInitializedAccountRoute = (path: any) => {
  if (noInitializedAccountRoutePathDict[path]) {
    return true;
  }
  return false;
};

/**
 * @summary Segment analytics hook that communicates with analytics-node
 */
export const [AnalyticsProvider, useAnalytics] = constate(() => {
  const { activeAccountAddress } = useAccounts();
  const { activeNetworkName } = useNetworks();
  const { pathname } = useLocation();
  const isDevelopment = getIsDevelopment();
  const writeKey = getWriteKey();
  const analytics = useMemo(
    () =>
      writeKey
        ? AnalyticsBrowser.load({
            writeKey,
          })
        : undefined,
    [writeKey],
  );

  const shouldTrack = useCallback(
    () =>
      Boolean(activeAccountAddress || isNotInitializedAccountRoute(pathname)),
    [activeAccountAddress, pathname],
  );

  /**
   * @summary Analytics event track page
   * @see https://segment.com/docs/connections/spec/screen/
   * @param page page route that user is going to
   *
   * @example
   * ```ts
   * trackPage({
   *   page: Routes.settings.path,
   * });
   * ```
   */
  const trackPage = useCallback(
    async ({ page }: AnalyticsPageEventParams) => {
      if (isDevelopment || !analytics) {
        return;
      }

      const eventEnv = isDevelopment ? 'dev_event' : 'event';

      try {
        const analyticsUser = await analytics.user();
        if (shouldTrack()) {
          await analytics.page(page, {
            address: activeAccountAddress,
            properties: {
              $browser: getBrowser({ os: getOS() })?.toString(),
              $extensionVersion,
              $os: getOS()?.toString(),
              eventEnv,
              network: activeNetworkName,
              walletId: analyticsUser.anonymousId()?.toString(),
            },
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [
      isDevelopment,
      analytics,
      shouldTrack,
      activeAccountAddress,
      activeNetworkName,
    ],
  );

  /**
   * @summary Analytics event track screen - (different than page,
   *          pages are designated with routes while screens
   *          can be non-route based)
   * @see https://segment.com/docs/connections/spec/screen/
   * @param {String} screen
   *
   * @example
   * ```ts
   * trackScreen({
   *   screen: 'Transfer drawer',
   * });
   * ```
   */
  const trackScreen = useCallback(
    async ({ screen }: AnalyticsScreenEventParams) => {
      if (isDevelopment || !analytics) {
        return;
      }

      const eventEnv = isDevelopment ? 'dev_event' : 'event';

      try {
        const user = await analytics.user();
        if (shouldTrack()) {
          await analytics.screen(screen, screen, {
            address: activeAccountAddress,
            properties: {
              $browser: getBrowser({ os: getOS() })?.toString(),
              $extensionVersion,
              $os: getOS()?.toString(),
              eventEnv,
              network: activeNetworkName,
              walletId: user.anonymousId()?.toString(),
            },
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [
      isDevelopment,
      analytics,
      shouldTrack,
      activeAccountAddress,
      activeNetworkName,
    ],
  );

  /**
   * @summary Analytics event track event
   * @see https://segment.com/docs/connections/spec/track/
   * @param eventType one of the event types in analyticsEvent
   * @param params optional additional params for an event
   * @param value optional value param for an event
   *
   * @example
   * ```ts
   * trackEvent({
   *   eventType: collectiblesEvents.CREATE_NFT,
   *   params: {
   *     network: NodeNetworkUrl,
   *     ...data,
   *   },
   * });
   * ```
   */
  const trackEvent = useCallback(
    async ({ eventType, params, value }: AnalyticsEventParams) => {
      if (isDevelopment || !analytics) {
        return;
      }

      const { action, category, label } = eventType;

      const eventEnv = isDevelopment ? 'dev_event' : 'event';

      try {
        const analyticsUser = await analytics.user();
        const sanitizedProperties = params
          ? filterAnalyticsEvent(params)
          : undefined;
        if (shouldTrack()) {
          const eventProperties = {
            address: params?.address?.toString() ?? activeAccountAddress,
            category,
            name: label,
            properties: {
              ...sanitizedProperties,
              $browser: getBrowser({ os: getOS() })?.toString() || 'chrome',
              $extensionVersion,
              $os: getOS()?.toString(),
              action,
              eventEnv,
              network: activeNetworkName || defaultNetworkName,
              value: value ? value.toString() : undefined,
              walletId: analyticsUser.anonymousId()?.toString(),
            },
            type: 'track',
          };
          await analytics.track(label, eventProperties);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [
      isDevelopment,
      analytics,
      shouldTrack,
      activeAccountAddress,
      activeNetworkName,
    ],
  );

  useEffect(() => {
    // Users at '/' usually just get redirected to '/wallet'
    if (pathname !== '/') {
      trackPage({ page: pathname });
    }
  }, [pathname, trackPage]);

  return {
    trackEvent,
    trackPage,
    trackScreen,
  };
});
