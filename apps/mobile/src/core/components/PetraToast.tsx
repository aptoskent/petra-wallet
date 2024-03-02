// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react/no-array-index-key */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { customColors } from '@petra/core/colors';
import { TOAST_POSITION, ToastPosition } from 'core/providers/ToastProvider';

export interface PetraToastProps {
  /*
    The duration of the toast.
  */
  duration?: number;
  /*
    The duration of the easing in of the toast.
  */
  easeInDuration?: number;
  /*
    The duration of the easing out of the toast.
  */
  easeOutDuration?: number;
  /*
    Should hide toast that appears by pressing on the toast.
  */
  hideOnPress?: boolean;
  /*
    The icon of the toast.
  */
  icon?: JSX.Element;
  /*
    Callback for toast's hide animation end
  */
  onHidden?: () => void;
  /*
    Callback for toast's hide animation start
  */
  onHide?: () => void;
  /*
    Callback for when pressing the toast
  */
  onPress?: () => void;
  /*
    Callback for toast's appear animation start
  */
  onShow?: () => void;
  /*
    Callback for toast's appear animation end
  */
  onShown?: () => void;
  /*
    The text inside the toast.
  */
  text: string;
  /*
    The text color of the toast.
  */
  textColor?: string;
  /*
    The position of toast showing on screen
  */
  toastPosition: ToastPosition;
}

const TOAST_MAX_WIDTH = 0.95;

export default function PetraToast({
  duration = 3000,
  easeInDuration = 800,
  easeOutDuration = 800,
  hideOnPress = false,
  icon,
  onHidden,
  onHide,
  onPress,
  onShow,
  onShown,
  text,
  textColor = customColors.white,
  toastPosition,
}: PetraToastProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const [hideTimeout, setHideTimeout] =
    useState<ReturnType<typeof setTimeout>>();
  const [keyboardScreenY, setKeyboardScreenY] = useState(
    Dimensions.get('window').height,
  );
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
  const [display, setDisplay] = React.useState<'none' | 'flex'>('flex');
  const offset = TOAST_POSITION[toastPosition];

  // eg total duration = 3000ms
  // so to calculate actual duration, we need to subtract out ease in/out duration
  // 3000ms - 800ms ease in - 800ms ease out = 1400ms
  // that the toast will appear after ease in and before ease out
  const actualDuration = duration - easeInDuration - easeOutDuration;

  const onKeyboardDidChangeFrame = ({ endCoordinates }: any) => {
    setKeyboardScreenY(endCoordinates.screenY);
  };

  const hideToast = useCallback(() => {
    clearTimeout(hideTimeout);
    if (!isAnimating) {
      onHide?.();

      Animated.timing(opacity, {
        duration: easeOutDuration,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setDisplay('none');
          setIsAnimating(false);
          onHidden?.();
        }
      });
    }
  }, [easeOutDuration, hideTimeout, isAnimating, onHidden, onHide, opacity]);

  useEffect(() => {
    const keyboardListener = Keyboard.addListener(
      'keyboardDidChangeFrame',
      onKeyboardDidChangeFrame,
    );

    onShow?.();

    Animated.timing(opacity, {
      duration: easeInDuration,
      easing: Easing.out(Easing.ease),
      toValue: 1,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsAnimating(!finished);
        onShown?.();
        if (actualDuration > 0) {
          const timeout = setTimeout(hideToast, actualDuration);
          setHideTimeout(timeout);
        }
      }
    });

    return () => {
      keyboardListener?.remove();
    };
  }, [actualDuration, easeInDuration, hideToast, onShow, onShown, opacity]);

  const handleOnPress = () => {
    onPress?.();
    if (hideOnPress) {
      hideToast();
    }
  };

  const keyboardHeight = Math.max(
    Dimensions.get('window').height - keyboardScreenY,
    0,
  );
  const position = offset
    ? {
        [offset < 0 ? 'bottom' : 'top']:
          offset < 0 ? keyboardHeight - offset : offset,
      }
    : {
        bottom: keyboardHeight,
        top: 0,
      };

  if (!text) return null;

  return (
    <View style={[styles.defaultStyle, position, { display }]}>
      <Pressable onPress={handleOnPress}>
        <Animated.View
          style={[
            styles.animatedStyle,
            {
              opacity,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastContent}>
            {icon ? <View style={styles.icon}>{icon}</View> : null}
            <Text style={[styles.text, textColor ? { color: textColor } : {}]}>
              {text}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedStyle: {
    backgroundColor: customColors.navy['900'],
    borderRadius: 5,
    elevation: 10,
    marginHorizontal: Math.floor(
      Dimensions.get('window').width * ((1 - TOAST_MAX_WIDTH) / 2),
    ),
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 4,
    width: '100%',
  },
  defaultStyle: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    justifyContent: 'center',
    left: 0,
    marginBottom: 4,
    position: 'absolute',
    right: 0,
    zIndex: 999,
  },
  icon: {
    minWidth: 32,
  },
  text: {
    color: customColors.white,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  textContainer: {
    flexWrap: 'wrap',
  },
  toastContent: {
    flexDirection: 'row',
    padding: 2,
    paddingVertical: 4,
  },
});
