// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CARD_GUTTER_PADDING } from 'pages/Assets/shared';
import { customColors } from '@petra/core/colors';
import { ChevronRightIconSVG } from 'shared/assets/svgs';
import { DROP_SHADOW } from 'shared';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';

interface GenericBlockProps {
  children?: React.ReactNode;
  handleOnTopBarPress: () => void;
  headingText: string;
  renderUpperRight?: () => React.ReactNode;
}

export default function GenericBlock({
  handleOnTopBarPress,
  headingText,
  renderUpperRight,
  ...props
}: GenericBlockProps): JSX.Element {
  const styles = useStyles();
  const renderTopBarContent = () => (
    <TouchableOpacity onPress={handleOnTopBarPress}>
      <View style={styles.topPressableBar}>
        <View style={styles.headingBlock}>
          <Text style={styles.headingText}>{headingText}</Text>
          <ChevronRightIconSVG color={customColors.navy['300']} />
        </View>

        {renderUpperRight && (
          <View style={styles.headingBlock}>{renderUpperRight()}</View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, DROP_SHADOW.default]}>
      {renderTopBarContent()}
      {props.children}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.tertiary,
    borderRadius: 12,
    elevation: 3, // android only
    flex: 1,
    marginHorizontal: PADDING.container,
    marginVertical: 8,
    minHeight: 80,
    paddingHorizontal: CARD_GUTTER_PADDING,
    paddingVertical: 24,
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
    color: theme.typography.primary,
    fontFamily: 'WorkSans-Bold',
    fontSize: 24,
    lineHeight: 36,
  },
  topPressableBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
