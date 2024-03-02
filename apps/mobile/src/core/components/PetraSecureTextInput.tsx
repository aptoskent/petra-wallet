// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useFocusEffect } from '@react-navigation/native';
import { PetraTextInput } from 'core/components/index';
import { PetraTextInputProps } from 'core/components/PetraTextInput';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import EyeIcon from 'shared/assets/svgs/eye_icon.svg';
import EyeOffIcon from 'shared/assets/svgs/eye_off_icon_16.svg';

export default function PetraSecureTextInput({
  ...props
}: PetraTextInputProps) {
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const toggleIsSecure = () => setIsSecure((prevValue) => !prevValue);

  useFocusEffect(
    useCallback(() => {
      // Make sure input is secured when navigating back from another view
      setIsSecure(true);
    }, []),
  );

  const { inputTheme } = props;
  const iconColor = inputTheme === 'dark' ? 'white' : customColors.navy['500'];

  const rightIcon = (
    <TouchableOpacity onPress={toggleIsSecure}>
      {isSecure ? (
        <EyeIcon color={iconColor} />
      ) : (
        <EyeOffIcon color={iconColor} />
      )}
    </TouchableOpacity>
  );

  return (
    <PetraTextInput
      rightIcon={rightIcon}
      secureTextEntry={isSecure}
      {...props}
    />
  );
}
