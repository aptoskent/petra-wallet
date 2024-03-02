// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { CoinInfoData } from '@petra/core/types';
import { useNavigation } from '@react-navigation/native';
import Typography from 'core/components/Typography';
import numbro from 'numbro';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// Represents the maximum u64 value
const maxCoinAmount = BigInt('18446744073709551615');

const amountPattern = /^([1-9][0-9]*)?(?:\.([0-9]*))?$/;

interface SplitNumber {
  fractional?: string;
  integral?: string;
}

function formatSplitNumber({ fractional, integral }: SplitNumber) {
  const formattedIntegral = numbro(integral ?? '0').format('0,0');
  const formattedFractional = fractional !== undefined ? `.${fractional}` : '';
  return `${formattedIntegral}${formattedFractional}`;
}

export function useIsKeyboardShown() {
  const isKeyboardShown = useRef<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        isKeyboardShown.current = true;
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        isKeyboardShown.current = false;
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return useCallback(() => isKeyboardShown.current, []);
}

interface CoinAmountInputProps {
  coinInfo: CoinInfoData;
  color: string;
  onChange: (amount: bigint) => void;
  onSubmit: () => void;
}

export default function CoinAmountInput({
  coinInfo,
  color,
  onChange,
  onSubmit,
}: CoinAmountInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [rawAmount, setRawAmount] = useState<string>('');
  const [parsedAmount, setParsedAmount] = useState<SplitNumber>();
  const isKeyboardShown = useIsKeyboardShown();

  const navigation = useNavigation();

  /**
   * Validate text and parse coin amount.
   * `rawAmount` is fed back into the input, so we can prevent
   * the text from changing by not updating its value.
   * @param text raw amount
   */
  const onChangeText = (text: string) => {
    const match = text.match(amountPattern);
    if (match === null) {
      return;
    }

    const integral = match[1];
    const fractional = match[2];
    if (fractional !== undefined && fractional.length > coinInfo.decimals) {
      return;
    }

    const strIntegral = integral ?? '';
    const strFractional = (fractional ?? '').padEnd(coinInfo.decimals, '0');
    const amount = BigInt(`${strIntegral}${strFractional}`);

    if (amount <= maxCoinAmount) {
      setRawAmount(text);
      setParsedAmount({ fractional, integral });
      onChange(amount);
    }
  };

  // Just in case autofocus does not work as intended
  const onInputPress = () => {
    if (!isKeyboardShown()) {
      if (inputRef.current?.isFocused()) {
        inputRef.current?.blur();
      }
      inputRef.current?.focus();
    }
  };

  // The `autoFocus` property only focuses on mounting.
  // Listening to the `focus` event allows the keyboard to show when navigating back.
  // Note: doesn't work on Android, so as a fallback we still set the `autoFocus` property
  useEffect(() => {
    const onFocus = () => {
      inputRef.current?.focus();
    };

    const onBlur = () => {
      inputRef.current?.blur();
    };

    navigation.addListener('focus', onFocus);
    navigation.addListener('blur', onBlur);
    return () => {
      navigation.removeListener('focus', onFocus);
      navigation.removeListener('blur', onBlur);
    };
  }, [navigation]);

  const formattedAmount = `${
    parsedAmount ? formatSplitNumber(parsedAmount) : '0'
  } ${coinInfo.symbol}`;

  return (
    <TouchableWithoutFeedback onPress={onInputPress}>
      <View>
        <TextInput
          ref={inputRef}
          caretHidden
          // Note: focusing the input when a navigation `focus` event is triggered
          // doesn't work on Android, so keeping the `autoFocus` property for Android only
          autoFocus
          keyboardType="decimal-pad"
          onChangeText={onChangeText}
          blurOnSubmit={false}
          onSubmitEditing={onSubmit}
          style={{
            // Need to be somewhat visible to allow triggering the keyboard on Android
            color: 'white',
            height: 1,
            padding: 0,
            width: 1,
          }}
          // Feeding value back to enable text change prevention
          value={rawAmount}
        />
        <Typography
          variant="display"
          color={color}
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ fontSize: 64, lineHeight: 64 }}
        >
          {formattedAmount}
        </Typography>
      </View>
    </TouchableWithoutFeedback>
  );
}
