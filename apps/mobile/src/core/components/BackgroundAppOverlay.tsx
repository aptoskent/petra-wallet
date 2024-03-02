// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import { useAppState } from '@petra/core/hooks/useAppState';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Image, View } from 'react-native';
import { petraLogo } from 'shared/assets/images';

const defaultAutolockTimer = 5;

/**
 * Overlay that will be shown on top of the app
 * when the app is in the background, for privacy reasons.
 * Also takes care of auto locking the app if it stays in the background
 * for too long.
 */
export default function BackgroundAppOverlay() {
  const { lockAccounts } = useInitializedAccounts();
  const { autolockTimer = defaultAutolockTimer } = useAppState();
  const autolockTimerMs = autolockTimer * 60 * 1000;
  const lastActiveTimestamp = useRef<number>();
  const [isBackground, setIsBackground] = useState<boolean>(
    AppState.currentState !== 'active',
  );
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (value) => {
      if (value !== 'active') {
        lastActiveTimestamp.current = lastActiveTimestamp.current ?? Date.now();
      } else if (lastActiveTimestamp.current !== undefined) {
        const currTimestamp = Date.now();
        const elapsedTime = currTimestamp - lastActiveTimestamp.current;
        if (elapsedTime > autolockTimerMs) {
          await lockAccounts();
        }
        lastActiveTimestamp.current = undefined;
      }
      setIsBackground(value !== 'active');
    });
    return () => {
      subscription.remove();
    };
  }, [autolockTimerMs, lockAccounts]);

  return isBackground ? (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: customColors.navy['900'],
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
      }}
    >
      <Image source={petraLogo} />
    </View>
  ) : null;
}
