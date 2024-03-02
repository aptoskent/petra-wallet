// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { isAddressValid } from '@petra/core/utils/address';
import { HexString } from 'aptos';
import constate from 'constate';
import {
  getRecieveParams,
  getUrlParamsFromPath,
  isQrCodeValid,
  QrDataProps,
} from 'core/utils/scannerHelper';
import { getPathname, getPath } from 'core/utils/deeplinkHelper';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { i18nmock } from 'strings';
import nacl from 'tweetnacl';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { deeplinkEvents } from '@petra/core/utils/analytics/events';

export type Deeplink = {
  error?: string;
  explore?: { link?: string };
  receive?: QrDataProps;
  renfield?: { privateKey: string };
};

export const [DeeplinkProvider, useDeeplink] = constate(() => {
  const [deeplink, setDeeplink] = useState<Deeplink | undefined>(undefined);
  const { trackEvent } = useTrackEvent();

  useEffect(() => {
    const parseDeeplink = (pathRaw: string | null) => {
      if (!pathRaw) {
        return undefined;
      }
      const path = getPath(pathRaw);
      const { params, url } = getUrlParamsFromPath(path);
      const pathname = getPathname(url.pathname);
      switch (pathname) {
        case '/receive': {
          if (!isQrCodeValid(url.href)) {
            void trackEvent({
              eventType: deeplinkEvents.ERROR_READ_QR_CODE,
            });
            return { error: i18nmock('general:scanner.invalidQRCode') };
          }
          const receiveParams = getRecieveParams(params);
          if (!isAddressValid(receiveParams.address)) {
            void trackEvent({
              eventType: deeplinkEvents.ERROR_READ_ADDRESS,
            });
            return { error: i18nmock('general:scanner.invalidQRCodeAddress') };
          }
          return { receive: receiveParams };
        }
        case '/explore': {
          return { explore: { link: params.get('link') } };
        }
        case '/renfield': {
          try {
            const payloadString = params.get('payload');
            const nonceString = params.get('nonce');
            const renfeldPublicKeyString = params.get('public_key');

            const petraSecretKey = new HexString(
              '0x0d8ddd803353e25ccc05cde878f8c4c0e58485dfdab07ef7351f21f176699fca',
            ).toUint8Array();
            if (payloadString && nonceString && renfeldPublicKeyString) {
              const renfieldPublicKey = new HexString(
                renfeldPublicKeyString,
              ).toUint8Array();
              const payload = new HexString(payloadString).toUint8Array();
              const nonce = new HexString(nonceString).toUint8Array();
              const message = nacl.box.open(
                payload,
                nonce,
                renfieldPublicKey,
                petraSecretKey,
              );
              if (message) {
                const decoder = new TextDecoder();
                const { privateKey, ttl } = JSON.parse(decoder.decode(message));
                const now = new Date();
                const ttlDate = new Date(ttl);
                if (privateKey && ttl && ttlDate.getTime() > now.getTime()) {
                  return {
                    renfield: { privateKey },
                  };
                }
              }
            }
          } catch (e) {
            // Fail silently, if a deeplink fails to open, that is ok
            // eslint-disable-next-line no-console
            console.warn(e);
            void trackEvent({
              eventType: deeplinkEvents.ERROR_REDIRECT_RENFIELD,
            });
          }
          return undefined;
        }
        default:
          return undefined;
      }
    };

    Linking.getInitialURL().then((url) => {
      const newDeeplink = parseDeeplink(url);
      setDeeplink(newDeeplink);
    });
    Linking.addEventListener('url', (url) => {
      const newDeeplink = parseDeeplink(url.url);
      setDeeplink(newDeeplink);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    deeplink,
    setDeeplink,
  };
});
