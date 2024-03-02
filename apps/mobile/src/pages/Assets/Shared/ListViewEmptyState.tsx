// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { customColors } from '@petra/core/colors';

interface ListViewEmptyStateProps {
  bottomButton?: JSX.Element;
  headingText: string;
  subText: string;
  svgComponent: JSX.Element;
}

export default function ListViewEmptyState({
  bottomButton,
  headingText,
  subText,
  svgComponent,
}: ListViewEmptyStateProps): JSX.Element {
  return (
    <View style={styles.noCoinsContainer}>
      <View style={styles.upperNullStateContainer}>{svgComponent}</View>
      <View style={styles.lowerNullStateContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>{headingText}</Text>
          <Text style={styles.subtext}>{subText}</Text>
        </View>
        {bottomButton !== undefined ? (
          <View style={styles.buttonContainer}>{bottomButton}</View>
        ) : null}
      </View>
    </View>
  );
}

const separationPadding = 12;
const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 42,
    width: '100%',
  },
  heading: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-Bold',
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'center',
  },
  lowerNullStateContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: separationPadding,
    width: '100%',
  },
  noCoinsContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subtext: {
    color: customColors.navy['500'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: '70%',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  upperNullStateContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: separationPadding,
  },
});
