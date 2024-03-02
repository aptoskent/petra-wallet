// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, ViewStyle } from 'react-native';
import makeStyles from 'core/utils/makeStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from 'shared/constants';

interface PetraHeaderProps {
  containerStyle?: ViewStyle;
  /**
   * Should be used when the header is rendered on top of a scrollable view, e.g. a list.
   *
   * Navigation options should be set to `headerTransparent: true` to avoid the header.
   */
  headerTransparent?: boolean;
  headingSectionCenterStyle?: ViewStyle;
  headingSectionLeftStyle?: ViewStyle;
  headingSectionRightStyle?: ViewStyle;
  renderCenter?: JSX.Element;
  renderLeft?: JSX.Element;
  renderRight?: JSX.Element;
}

export default function Header({
  containerStyle,
  headerTransparent = false,
  headingSectionCenterStyle,
  headingSectionLeftStyle,
  headingSectionRightStyle,
  renderCenter,
  renderLeft,
  renderRight,
}: PetraHeaderProps): JSX.Element {
  const styles = useStyles();

  const header = (
    <View style={[styles.container, containerStyle]}>
      {renderLeft ? (
        <View style={[styles.headingSectionLeft, headingSectionLeftStyle]}>
          {renderLeft}
        </View>
      ) : (
        <View />
      )}
      {renderCenter ? (
        <View style={[styles.headingSectionCenter, headingSectionCenterStyle]}>
          {renderCenter}
        </View>
      ) : (
        <View />
      )}
      {renderRight ? (
        <View style={[styles.headingSectionRight, headingSectionRightStyle]}>
          {renderRight}
        </View>
      ) : (
        <View />
      )}
    </View>
  );

  return headerTransparent ? (
    <SafeAreaView edges={['top']}>{header}</SafeAreaView>
  ) : (
    header
  );
}

const useStyles = makeStyles(() => ({
  container: {
    flexDirection: 'row',
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
    width: '100%',
  },
  headingSectionCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  headingSectionLeft: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  headingSectionRight: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
}));
