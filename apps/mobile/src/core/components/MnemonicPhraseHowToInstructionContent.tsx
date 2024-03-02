// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { i18nmock } from 'strings';
import MnemonicPhraseHowToInstructionRow from './MnemonicPhraseHowToInstructionRow';

export interface DataItem {
  description: string;
  id: number;
  safety: string;
  safetyTextColor: string;
}

const DATA: DataItem[] = [
  {
    description: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.writeItDown',
    ),
    id: 1,
    safety: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.strong',
    ),
    safetyTextColor: customColors.green['700'],
  },
  {
    description: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.typeDirectly',
    ),
    id: 2,
    safety: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.strong',
    ),
    safetyTextColor: customColors.green['700'],
  },
  {
    description: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.takeScreenshot',
    ),
    id: 3,
    safety: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.medium',
    ),
    safetyTextColor: customColors.orange['600'],
  },
  {
    description: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.copyPhrase',
    ),
    id: 4,
    safety: i18nmock(
      'onboarding:recoveryPhrase.recoveryPhraseInstructionModal.weak',
    ),
    safetyTextColor: customColors.error,
  },
];

const styles = StyleSheet.create({
  view: {
    flex: 0,
    maxHeight: Math.round(0.5 * Dimensions.get('window').height),
    paddingVertical: 16,
    width: '100%',
  },
});

const MnemonicPhraseHowToInstructionContent = (
  <View style={styles.view}>
    <ScrollView>
      {DATA.map((item) => MnemonicPhraseHowToInstructionRow(item))}
    </ScrollView>
  </View>
);

export default MnemonicPhraseHowToInstructionContent;
