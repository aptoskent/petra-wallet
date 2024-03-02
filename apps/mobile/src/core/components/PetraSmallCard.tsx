// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CARD_GUTTER_PADDING } from 'pages/Assets/shared';
import { customColors } from '@petra/core/colors';
import { ChevronRightIconSVG } from 'shared/assets/svgs';
import { DROP_SHADOW } from 'shared';

interface PetraSmallCardProps {
  handleOnTopBarPress: () => void;
  headingText: string;
  leftIcon: JSX.Element;
  subText: string | null;
}

export default function PetraSmallCard({
  handleOnTopBarPress,
  headingText,
  leftIcon,
  subText,
}: PetraSmallCardProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.container, DROP_SHADOW.default]}
      onPress={handleOnTopBarPress}
    >
      <View style={styles.headingBlock}>
        {leftIcon}
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>{headingText}</Text>
          {subText === null ? null : (
            <Text style={styles.subText}>{subText}</Text>
          )}
        </View>
      </View>
      <View style={styles.headingBlock}>
        <ChevronRightIconSVG color={customColors.navy['300']} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: customColors.white,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 76,
    paddingHorizontal: CARD_GUTTER_PADDING,
    width: '100%',
    zIndex: 10,
  },
  headingBlock: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingBlockText: {
    color: customColors.navy['400'],
    fontSize: 14,
  },
  headingText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
  subText: {
    color: customColors.navy['500'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    lineHeight: 18,
  },
  textContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
});
