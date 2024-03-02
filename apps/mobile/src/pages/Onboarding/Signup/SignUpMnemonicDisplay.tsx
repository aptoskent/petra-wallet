// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { PetraPillButton, PhraseList, PillButtonDesign } from 'core/components';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import { useKeychain } from 'core/hooks/useKeychain';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import { generateMnemonic } from 'core/utils';
import { handleOnCopyPress } from 'core/utils/helpers';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import EyeOffIconSVG from 'shared/assets/svgs/eye_off_icon_48';
import { SignupStackScreenProps } from 'navigation/types';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { i18nmock } from 'strings';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import { mnemonicPhraseHowToInstructionModal } from 'core/components/PetraAlertModalContent';
import { CopyIcon16SVG } from 'shared/assets/svgs/copy_icon';
import OnboardingInstruction from '../Shared/OnboardingInstruction';

type SignUpMnemonicDisplayProps =
  SignupStackScreenProps<'SignUpMnemonicDisplay'>;

function SignUpMnemonicDisplay({
  navigation,
  route,
}: SignUpMnemonicDisplayProps) {
  const styles = useStyles();
  const [canSeeMnemonic, setCanSeeMnemonic] = useState<boolean>(false);
  const { showAlertModal } = useAlertModalContext();
  const { showSuccessToast } = usePetraToastContext();
  const { unlockedPassword } = useKeychain();

  const onContinuePress = (mnemonic: string) => {
    // hide the Mnemonic when navigating away so a customer doesn't accidentally
    // navigate back to Mnemonic when someone is looking
    setCanSeeMnemonic(false);
    navigation.navigate('SignUpMnemonicEntry', {
      confirmedPassword: unlockedPassword ?? route.params.confirmedPassword,
      isAddAccount: route.params?.isAddAccount ?? false,
      mnemonic,
    });
  };

  const handleRevealPress = () => {
    setCanSeeMnemonic(true);
  };

  const newMnemonic: string = useMemo(() => generateMnemonic(), []);
  return (
    <BottomSafeAreaView
      style={styles.container}
      {...testProps('SignUpMnemonicDisplay-screen')}
    >
      <View style={styles.body}>
        <OnboardingInstruction
          title={i18nmock('onboarding:recoveryPhrase.title')}
          subtext={i18nmock('onboarding:recoveryPhrase.subtext')}
          underlineText={i18nmock('onboarding:recoveryPhrase.underlineText')}
          onPressUnderlineText={() =>
            showAlertModal(mnemonicPhraseHowToInstructionModal)
          }
        />
        <View style={styles.bodyContainer}>
          <PhraseList
            mnemonic={newMnemonic}
            showNumber
            showBlur={!canSeeMnemonic}
          />
          {!canSeeMnemonic ? (
            <Pressable
              style={styles.blurView}
              onPress={handleRevealPress}
              {...testProps('reveal-mnemonic')}
            >
              <>
                <View style={styles.opaqueLayer} />
                <View style={styles.revealContainer}>
                  <EyeOffIconSVG color={customColors.navy['900']} />
                  <Text style={styles.tapToReveal}>
                    {i18nmock('onboarding:recoveryPhrase.reveal.tapToReveal')}
                  </Text>
                  <Text style={styles.subtext}>
                    {i18nmock('onboarding:recoveryPhrase.reveal.subtext')}
                  </Text>
                </View>
              </>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={styles.footer}>
        <PetraPillButton
          onPress={handleOnCopyPress({
            duration: 60,
            message: newMnemonic,
            showSuccessToast,
            successToastMessage: i18nmock(
              'onboarding:recoveryPhrase.reveal.toast',
            ),
          })}
          leftIcon={() => <CopyIcon16SVG color={customColors.navy['900']} />}
          text={i18nmock('onboarding:recoveryPhrase.reveal.copyToClipboard')}
          buttonDesign={PillButtonDesign.clearWithDarkText}
        />
        <PetraPillButton
          accessibilityLabel={i18nmock(
            'onboarding:recoveryPhrase.reveal.accessibility',
          )}
          disabled={!canSeeMnemonic}
          onPress={() => onContinuePress(newMnemonic)}
          testId="reveal"
          text={i18nmock('onboarding:recoveryPhrase.reveal.text')}
        />
      </View>
    </BottomSafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  blurView: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  body: {
    flex: 5,
    paddingHorizontal: 20,
    width: '100%',
  },
  bodyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    display: 'flex',
    flex: 1,
  },
  footer: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    gap: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  mnemonicColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  opaqueLayer: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    borderRadius: 8,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    marginTop: 12,
    opacity: 0.8,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  phraseNumberText: {
    color: customColors.navy['600'],
    marginRight: 10,
  },
  phraseText: {
    color: customColors.navy['800'],
  },
  pressable: {
    width: '100%',
  },
  revealContainer: {
    alignItems: 'center',
    borderRadius: 8,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    marginTop: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: 999,
  },
  subtext: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  tapToReveal: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    marginTop: 12,
  },
}));

export default SignUpMnemonicDisplay;
