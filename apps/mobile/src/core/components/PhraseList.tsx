// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react/no-array-index-key */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { customColors } from '@petra/core/colors';
import { HIT_SLOPS } from 'shared';
import { BlurView } from '@react-native-community/blur';
import { testProps } from 'e2e/config/testProps';

const MIN_HEIGHT = 48;
interface MnemonicPhraseDisplayProps {
  handleUpdateSelected?: (phrase: string) => void;
  numberDisplay: string;
  phrase: string;
  selectedPhrases?: string[];
  showBlur?: boolean;
  showNumber?: boolean;
}

function MnemonicPhraseDisplay({
  handleUpdateSelected,
  numberDisplay,
  phrase,
  selectedPhrases,
  showBlur,
  showNumber,
}: MnemonicPhraseDisplayProps) {
  const isSelected =
    selectedPhrases !== undefined &&
    selectedPhrases.some((selectedPhrase) => selectedPhrase === phrase);

  const renderTextDisplay = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {showNumber && (
        <Text style={styles.phraseNumberText}>{`${numberDisplay}.`}</Text>
      )}
      <>
        <Text
          style={isSelected ? styles.phraseTextSelected : styles.phraseText}
        >
          {phrase}
        </Text>
        {showBlur ? (
          <BlurView
            style={[styles.blurView, { borderRadius: 4 }]}
            blurType="xlight"
            blurAmount={6}
            blurRadius={10}
            reducedTransparencyFallbackColor={customColors.white}
          />
        ) : null}
      </>
    </View>
  );

  return (
    <View
      style={[
        styles.mnemonicPhraseContainer,
        showNumber ? null : { justifyContent: 'center' },
        isSelected ? styles.mnemonicPhraseContainerSelected : null,
      ]}
    >
      {handleUpdateSelected === undefined ? (
        <View>{renderTextDisplay()}</View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            handleUpdateSelected(phrase);
          }}
          style={styles.textContainer}
          disabled={isSelected}
          hitSlop={HIT_SLOPS.midSlop}
          {...testProps(`mnemonic-${phrase}`)}
        >
          {renderTextDisplay()}
        </TouchableOpacity>
      )}
    </View>
  );
}

interface PhraseListProps {
  handleUpdateSelected?: (phrase: string) => void;
  mnemonic: string;
  selectedPhrases?: string[];
  showBlur?: boolean;
  showNumber?: boolean;
}

function PhraseList({
  handleUpdateSelected,
  mnemonic,
  selectedPhrases,
  showBlur,
  showNumber,
}: PhraseListProps) {
  return (
    <View style={styles.container} {...testProps('phrase-list')}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View
          style={styles.mnemonicColumn}
          {...testProps('phrase-list-column-1')}
        >
          {mnemonic?.split(' ').map((phrase: string, idx: number) => {
            if (idx < 6) {
              return (
                <MnemonicPhraseDisplay
                  key={`${phrase}-${idx}`}
                  phrase={phrase}
                  numberDisplay={`${idx + 1}`}
                  showNumber={showNumber}
                  showBlur={showBlur}
                  handleUpdateSelected={handleUpdateSelected}
                  selectedPhrases={selectedPhrases}
                />
              );
            }
            return null;
          })}
        </View>
        <View
          style={styles.mnemonicColumn}
          {...testProps('phrase-list-column-2')}
        >
          {mnemonic?.split(' ').map((phrase: string, idx: number) => {
            if (idx > 5) {
              return (
                <MnemonicPhraseDisplay
                  key={`${phrase}-${idx}`}
                  phrase={phrase}
                  numberDisplay={`${idx + 1}`}
                  showNumber={showNumber}
                  showBlur={showBlur}
                  handleUpdateSelected={handleUpdateSelected}
                  selectedPhrases={selectedPhrases}
                />
              );
            }
            return null;
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default PhraseList;

const styles = StyleSheet.create({
  blurView: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    flex: 1,
    height: '100%',
    paddingVertical: 10,
    width: '100%',
  },
  mnemonicColumn: {
    flex: 1,
    paddingRight: 10,
  },
  mnemonicPhraseContainer: {
    alignItems: 'center',
    backgroundColor: customColors.white,
    borderColor: customColors.navy['200'],
    borderRadius: Math.floor(MIN_HEIGHT),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    marginVertical: 6,
    minHeight: MIN_HEIGHT,
    paddingHorizontal: 18,
  },
  mnemonicPhraseContainerSelected: {
    backgroundColor: customColors.navy['50'],
    borderColor: customColors.navy['100'],
    borderWidth: 1,
  },
  phraseNumberText: {
    color: customColors.navy['600'],
    marginRight: 10,
  },
  phraseText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
  },
  phraseTextSelected: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
  },
  scrollView: {
    flexDirection: 'row',
    minHeight: 100,
    width: '100%',
  },
  textContainer: {
    flex: 1,
  },
});
