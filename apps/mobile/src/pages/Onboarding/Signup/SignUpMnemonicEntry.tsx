// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { customColors } from '@petra/core/colors';
import { PetraPillButton, PhraseList } from 'core/components';
import { i18nmock } from 'strings';
import { SignupStackScreenProps } from 'navigation/types';
import OnboardingInstruction from 'pages/Onboarding/Shared/OnboardingInstruction';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import { testProps } from 'e2e/config/testProps';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import { getKeepRecoveryPhraseSafeModal } from 'core/components/PetraAlertModalContent';

interface OrderedPhraseProps {
  numberDisplay: string;
  phrase: string;
  removeSelectedPhrase: (str: string) => void;
}

function OrderedPhrase({
  numberDisplay,
  phrase,
  removeSelectedPhrase,
}: OrderedPhraseProps) {
  const styles = useStyles();
  return (
    <TouchableOpacity onPress={() => removeSelectedPhrase(phrase)}>
      <View style={styles.orderedPhraseItem}>
        <Text style={styles.phraseNumberText}>{`${numberDisplay}.`}</Text>
        <Text style={styles.phraseText}>{phrase}</Text>
      </View>
    </TouchableOpacity>
  );
}

type SignUpMnemonicEntryProps = SignupStackScreenProps<'SignUpMnemonicEntry'>;

export default function SignUpMnemonicEntry({
  navigation,
  route,
}: SignUpMnemonicEntryProps) {
  const styles = useStyles();
  const [enteredWrongPhrase, setEnteredWrongPhrase] = useState<boolean>(false);
  const [currentSelectedPhrases, setCurrentSelectedPhrases] = useState<
    string[]
  >([]);
  const mnemonicPhrase = route.params.mnemonic;
  const { showDangerToast } = usePetraToastContext();
  const { dismissAlertModal, showAlertModal } = useAlertModalContext();

  const cachedShuffledMnemonic = React.useMemo(() => {
    const shuffledMnemonic: string[] = mnemonicPhrase.split(' ');
    // sort alphabetically - slightly easier for a user to find when trying to order
    return shuffledMnemonic.sort((a, b) => a.localeCompare(b));
  }, [mnemonicPhrase]);

  const handleConfirmSavedRecoveryPhrase = async () => {
    dismissAlertModal();
    navigation.navigate('SignUpChooseAccountName', {
      confirmedPassword: route.params?.confirmedPassword,
      fromRoute: 'SignUpMnemonicEntry',
      isAddAccount: route.params?.isAddAccount ?? false,
      mnemonic: mnemonicPhrase,
      privateKey: undefined,
    });
  };

  const onContinuePress = async () => {
    if (currentSelectedPhrases.join(' ') === mnemonicPhrase) {
      showAlertModal(
        getKeepRecoveryPhraseSafeModal(
          handleConfirmSavedRecoveryPhrase,
          dismissAlertModal,
        ),
      );
    } else {
      // reset the phrases and start over
      setEnteredWrongPhrase(true);
      showDangerToast({
        hideOnPress: true,
        text: i18nmock('onboarding:enterRecoveryPhrase.incorrectToast'),
        toastPosition: 'bottomWithButton',
      });
    }
  };

  const handleUpdateSelected = (newPhrase: string) => {
    // @TODO DOES NOT WORK IF THERE ARE DUPLICATE WORDS
    setCurrentSelectedPhrases([...currentSelectedPhrases, newPhrase]);
  };

  const clearAllPhrases = () => {
    setCurrentSelectedPhrases([]);
    setEnteredWrongPhrase(false);
  };

  const removeSelectedPhrase = (phrase: string) => {
    // @TODO DOES NOT WORK IF THERE ARE DUPLICATE WORDS
    setCurrentSelectedPhrases(
      currentSelectedPhrases.filter((p: string) => p !== phrase),
    );
    setEnteredWrongPhrase(false);
  };

  return (
    <View style={styles.container} {...testProps('SignUpMnemonicEntry-screen')}>
      <View style={styles.onboardingInstruction}>
        <OnboardingInstruction
          title={i18nmock('onboarding:enterRecoveryPhrase.title')}
          subtext={i18nmock('onboarding:enterRecoveryPhrase.subtext')}
          boldText={i18nmock('onboarding:enterRecoveryPhrase.boldText')}
        />
      </View>
      <View style={styles.midContainer}>
        <TouchableOpacity
          disabled={currentSelectedPhrases.length < 1}
          style={styles.clearAllContainer}
          onPress={clearAllPhrases}
        >
          <Typography
            color={currentSelectedPhrases.length < 1 ? 'navy.100' : 'navy.900'}
            weight="600"
            variant="small"
          >
            {i18nmock('onboarding:enterRecoveryPhrase.clearAll')}
          </Typography>
        </TouchableOpacity>
        <View
          style={[
            styles.orderedPhraseContainer,
            enteredWrongPhrase
              ? { borderColor: customColors.error, borderWidth: 2 }
              : {},
          ]}
        >
          {currentSelectedPhrases.map((phrase: string, idx: number) => (
            <OrderedPhrase
              // eslint-disable-next-line react/no-array-index-key
              key={`${idx}-${phrase}`}
              phrase={phrase}
              numberDisplay={`${idx + 1}`}
              removeSelectedPhrase={removeSelectedPhrase}
            />
          ))}
        </View>
        <PhraseList
          mnemonic={cachedShuffledMnemonic.join(' ')}
          showNumber={false}
          handleUpdateSelected={handleUpdateSelected}
          selectedPhrases={currentSelectedPhrases}
        />
      </View>
      <View style={styles.buttonContainer}>
        <PetraPillButton
          accessibilityLabel={i18nmock('onboarding:accessibility.screen1')}
          disabled={currentSelectedPhrases.length !== 12}
          onPress={onContinuePress}
          testId="next"
          text={i18nmock('general:next')}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.background.secondary,
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    minHeight: 90,
    width: '100%',
  },
  clearAllContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  midContainer: {
    flex: 1,
    width: '100%',
  },
  onboardingInstruction: {
    minHeight: 24,
  },
  orderedPhraseContainer: {
    backgroundColor: customColors.navy['50'],
    borderRadius: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 48,
    padding: 4,
    width: '100%',
  },
  orderedPhraseItem: {
    alignItems: 'center',
    alignSelf: 'baseline',
    backgroundColor: theme.background.secondary,
    borderColor: customColors.navy['100'],
    borderRadius: Math.floor(24),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    minHeight: 28,
    paddingLeft: 12,
    paddingRight: 20,
    paddingVertical: 4,
  },
  phraseListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  phraseNumberText: {
    color: customColors.navy['600'],
    marginRight: 10,
  },
  phraseText: {
    color: customColors.navy['800'],
  },
}));
