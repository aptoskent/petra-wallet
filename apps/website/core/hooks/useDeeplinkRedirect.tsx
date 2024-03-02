// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getOS, OS } from '@petra/core/src/utils/os';
import { PETRA_GOOGLE_PLAY_STORE, PETRA_APPLE_APP_STORE } from '../constants';

export default function useDeeplinkRedirect() {
  const router = useRouter();

  useEffect(() => {
    const os = getOS();

    switch (os) {
      case OS.IOS:
        router.push(PETRA_APPLE_APP_STORE);
        break;
      case OS.ANDROID:
        router.push(PETRA_GOOGLE_PLAY_STORE);
        break;
      default:
        router.push('/');
    }
  }, [router]);
}
