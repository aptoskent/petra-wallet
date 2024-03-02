// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { StackActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDeeplink } from 'core/providers/DeeplinkProvider';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import { useScanner } from 'core/utils/scanner';
import { QrDataProps } from 'core/utils/scannerHelper';
import { RootAuthenticatedStackParamList } from 'navigation/types';
import { DappCategory } from 'pages/Explore/data/DappListSource';
import { useEffect } from 'react';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { deeplinkEvents } from '@petra/core/utils/analytics/events';
import DeeplinkRedirectRendfieldHandler from './DeeplinkRedirectRenfieldHandler';

// handles navigation for explore route
function DeeplinkRedirectExploreHandler() {
  const { deeplink, setDeeplink } = useDeeplink();
  const { trackEvent } = useTrackEvent();
  const navigation =
    useNavigation<StackNavigationProp<RootAuthenticatedStackParamList>>();
  useEffect(() => {
    void trackEvent({
      eventType: deeplinkEvents.REDIRECT_EXPLORE,
      params: { url: deeplink?.explore?.link },
    });
    navigation.navigate('AssetsRoot', {
      params: { activeTab: DappCategory.nfts, ...deeplink?.explore },
      screen: 'Explore',
    });
    setDeeplink(undefined);
  }, [deeplink?.explore, navigation, setDeeplink, trackEvent]);
  return null;
}

// handles navigation for receive route
function DeeplinkRedirectReceiveHandler() {
  const { useRedirectWithQRData } = useScanner();
  const { deeplink, setDeeplink } = useDeeplink();
  const { trackEvent } = useTrackEvent();
  const decodedQrCode = deeplink?.receive as QrDataProps;
  const redirectNameAndParams = useRedirectWithQRData(decodedQrCode);
  const navigation =
    useNavigation<StackNavigationProp<RootAuthenticatedStackParamList>>();
  const routes = navigation.getState()?.routes;
  const route = routes[0];
  const prevRoute = routes[routes.length - 2];
  useEffect(() => {
    if (redirectNameAndParams[0]) {
      if (prevRoute?.name === route.name || prevRoute?.name === 'SendFlow1') {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
      }
      void trackEvent({
        eventType: deeplinkEvents.REDIRECT_SEND,
      });
      navigation.navigate(...redirectNameAndParams);
      if (deeplink?.receive) {
        setDeeplink(undefined);
      }
    }
  }, [
    deeplink?.receive,
    deeplink?.error,
    navigation,
    navigation.replace,
    redirectNameAndParams,
    setDeeplink,
    route,
    prevRoute?.name,
    trackEvent,
  ]);

  return null;
}

// The DeeplinkRedirectHandler function will determine where to navigate the user or to throw a
// danger toast if there is an error
function DeeplinkRedirectHandler() {
  const { deeplink, setDeeplink } = useDeeplink();
  const { showDangerToast } = usePetraToastContext();
  useEffect(() => {
    if (deeplink?.error) {
      showDangerToast({
        hideOnPress: true,
        text: deeplink?.error,
        toastPosition: 'bottomWithButton',
      });
      setDeeplink(undefined);
    }
  }, [deeplink?.error, setDeeplink, showDangerToast]);
  if (deeplink?.receive) {
    return DeeplinkRedirectReceiveHandler();
  }
  if (deeplink?.explore) {
    return DeeplinkRedirectExploreHandler();
  }
  if (deeplink?.renfield) {
    return DeeplinkRedirectRendfieldHandler();
  }
  return null;
}

export default DeeplinkRedirectHandler;
