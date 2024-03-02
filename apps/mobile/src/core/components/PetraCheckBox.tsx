// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { customColors } from '@petra/core/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HIT_SLOPS } from 'shared';
import { i18nmock } from 'strings';

interface OpenURLButtonProps {
  linkUrlText: string;
  style?: TextStyle;
  url: string;
}

export function OpenURLButton({ linkUrlText, style, url }: OpenURLButtonProps) {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`${i18nmock('general:unableToOpenLink')}${url}`);
    }
  }, [url]);

  return (
    <TouchableOpacity onPress={handlePress} hitSlop={HIT_SLOPS.smallSlop}>
      <Text style={[styles.checkBoxText, styles.urlText, style]}>
        {linkUrlText}
      </Text>
    </TouchableOpacity>
  );
}

interface PetraCheckBoxProps {
  checked: boolean;
  handleToggleCheck?: () => void;
  linkText?: string;
  text?: string;
  url?: string;
}

function PetraCheckBox({
  checked,
  handleToggleCheck,
  linkText,
  text,
  url,
}: PetraCheckBoxProps) {
  return (
    <>
      <TouchableOpacity onPress={handleToggleCheck} hitSlop={HIT_SLOPS.midSlop}>
        {checked ? (
          <MaterialCommunityIcons
            name="checkbox-marked"
            color={customColors.salmon['500']}
            size={24}
          />
        ) : (
          <View style={styles.checkNotAgreed} />
        )}
      </TouchableOpacity>
      {(text || linkText) && (
        <View style={styles.textLinkContainer}>
          {text && <Text style={styles.checkBoxText}>{text}</Text>}
          {linkText && url && (
            <OpenURLButton url={url} linkUrlText={linkText} />
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  checkBoxText: {
    color: customColors.navy['900'],
    fontSize: 16,
  },
  checkNotAgreed: {
    borderColor: customColors.navy['200'],
    borderRadius: 6,
    borderWidth: 3,
    height: 24,
    width: 24,
  },
  textLinkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  urlText: {
    color: customColors.navy['600'],
    fontWeight: 'bold',
  },
});

export default PetraCheckBox;
