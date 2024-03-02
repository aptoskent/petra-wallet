// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { i18nmock } from 'strings';
import { PADDING } from 'shared/constants';

interface DataItem {
  description: string;
  id: number;
  safety: string;
  safetyTextColor: string;
}

const CIRCLE_SIZE = 40;

function MnemonicPhraseHowToInstructionRow({
  description,
  id,
  safety,
  safetyTextColor,
}: DataItem) {
  return (
    <View style={styles.row} key={id}>
      <View style={styles.numberContainer}>
        <View style={styles.circle}>
          <Text>{id}</Text>
        </View>
      </View>
      <View style={styles.safetyContainer}>
        <View style={styles.safetyRow}>
          <Text style={styles.safetyLevel}>
            {i18nmock(
              'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.safetyLevel',
            )}
            :
          </Text>
          <Text style={[styles.safetyText, { color: safetyTextColor }]}>
            {safety}
          </Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
}

export default MnemonicPhraseHowToInstructionRow;

const styles = StyleSheet.create({
  buttonStyleOverride: {
    marginHorizontal: 16,
  },
  circle: {
    alignItems: 'center',
    borderColor: customColors.navy['100'],
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    padding: 4,
    width: CIRCLE_SIZE,
  },
  description: { color: customColors.navy['900'], fontSize: 16 },
  descriptionContainer: { marginTop: 4 },
  header: { padding: 10 },
  numberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', marginBottom: 24 },
  safetyContainer: { marginLeft: 8, maxWidth: '80%' },
  safetyLevel: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
  },
  safetyRow: { flexDirection: 'row' },
  safetyText: {
    fontFamily: 'WorkSans-SemiBold',
    marginLeft: 4,
  },
  title: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-Bold',
    fontSize: 20,
    paddingBottom: PADDING.container,
    textAlign: 'center',
  },
  view: {
    flex: 0,
    maxHeight: 0.5 * Dimensions.get('window').height,
    paddingTop: 16,
    width: '100%',
  },
});
