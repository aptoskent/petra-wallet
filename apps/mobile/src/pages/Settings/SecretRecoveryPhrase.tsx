// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from '@react-native-community/blur';
import Clipboard from '@react-native-clipboard/clipboard';
import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import AlertOctagonIconSVG from 'shared/assets/svgs/alert_octagon_icon';
import { CheckIconSVG } from 'shared/assets/svgs';
import { LocalAccount } from '@petra/core/types';
import { CopyIcon16SVG } from 'shared/assets/svgs/copy_icon';
import makeStyles from 'core/utils/makeStyles';

function CopyIcon() {
  return <CopyIcon16SVG color={customColors.navy['600']} />;
}

function CheckIcon() {
  return <CheckIconSVG color={customColors.white} />;
}

interface CopyButtonProps {
  activeAccount: LocalAccount;
}

function CopyButton({ activeAccount }: CopyButtonProps) {
  const styles = useStyles();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (activeAccount.mnemonic) {
      Clipboard.setString(activeAccount.mnemonic);
      setIsCopied(true);
    }
  };

  const buttonDesign = isCopied
    ? PillButtonDesign.success
    : PillButtonDesign.clearWithDarkText;
  return (
    <View style={styles.copyButtonContainer}>
      <PetraPillButton
        buttonDesign={buttonDesign}
        onPress={handleCopy}
        text={i18nmock('settings:manageAccount.privateKey.copy')}
        buttonStyleOverride={styles.buttonStyleOverride}
        containerStyleOverride={{ width: '100%' }}
        leftIcon={!isCopied ? CopyIcon : undefined}
        rightIcon={isCopied ? CheckIcon : undefined}
      />
    </View>
  );
}

interface RecoveryPhraseWordProps {
  index: number;
  word: string;
}

function RecoveryPhraseWord({ index, word }: RecoveryPhraseWordProps) {
  const styles = useStyles();
  return (
    <View style={styles.recoveryPhraseWordContainer} key={index}>
      <View style={styles.recoveryPhraseWordBody}>
        <Text style={styles.mnemonicPhraseNumber}>{`${index}.`}</Text>
        <Text style={styles.mnemonicPhraseWord}>{word}</Text>
      </View>
    </View>
  );
}

function BlurOverlay() {
  const styles = useStyles();
  const [showPhrase, setShowPhrase] = useState<boolean>(true);

  const handlePress = () => setShowPhrase(false);

  if (!showPhrase) return null;

  return (
    <BlurView
      style={styles.blurView}
      blurType="light"
      blurAmount={10}
      reducedTransparencyFallbackColor={customColors.white}
    >
      <TouchableOpacity onPress={handlePress} style={styles.blurViewBody}>
        <MaterialCommunityIcons
          color={customColors.navy[900]}
          name="eye-off"
          size={64}
        />
        <Text style={styles.tapRevealPhraseText}>
          {i18nmock('onboarding:recoveryPhrase.reveal.tapToReveal')}
        </Text>
      </TouchableOpacity>
    </BlurView>
  );
}

interface TapRevealPhraseProps {
  activeAccount: LocalAccount;
}

function TapRevealPhrase({ activeAccount }: TapRevealPhraseProps) {
  const styles = useStyles();
  return (
    <View style={styles.tapRevealPhraseContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.descriptionContainer}>
          {i18nmock('settings:manageAccount.secretRecoveryPhrase.description')}
        </Text>
        <View style={styles.secretPhraseContainer}>
          <BlurOverlay />
          <View style={styles.secretPhraseColumn}>
            {activeAccount.mnemonic
              ?.split(' ')
              .slice(0, 6)
              .map((word, index) => (
                <RecoveryPhraseWord word={word} index={index + 1} />
              ))}
          </View>
          <View style={styles.secretPhraseColumn}>
            {activeAccount.mnemonic
              ?.split(' ')
              .slice(6, 12)
              .map((word, index) => (
                <RecoveryPhraseWord word={word} index={index + 7} />
              ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function CautionBanner() {
  const styles = useStyles();
  return (
    <View style={styles.cautionContainer}>
      <View style={styles.cautionTitleContainer}>
        <AlertOctagonIconSVG color={customColors.error} />
        <Text style={styles.cautionTitle}>
          {i18nmock(
            'settings:manageAccount.secretRecoveryPhrase.caution.title',
          )}
        </Text>
      </View>
      <Text style={styles.cautionBody}>
        {i18nmock('settings:manageAccount.secretRecoveryPhrase.caution.body')}
      </Text>
    </View>
  );
}

export default function SecretRecoveryPhrase() {
  const styles = useStyles();
  const { activeAccount } = useActiveAccount();

  if (activeAccount.type !== 'local') {
    return null;
  }
  return (
    <ScrollView style={styles.container}>
      <TapRevealPhrase activeAccount={activeAccount} />
      <CopyButton activeAccount={activeAccount} />
      <CautionBanner />
    </ScrollView>
  );
}

const recoveryPhraseWordHeightDefault = 48;

const useStyles = makeStyles((theme) => ({
  blurView: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  blurViewBody: {
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  buttonStyleOverride: {
    alignSelf: 'stretch',
    borderColor: customColors.navy['200'],
    borderWidth: 2,
  },
  cautionBody: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
  },
  cautionContainer: {
    backgroundColor: customColors.salmon['50'],
    borderRadius: 8,
    padding: 16,
  },
  cautionTitle: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-SemiBold',
    marginLeft: 8,
  },
  cautionTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 18,
    paddingVertical: 24,
    width: '100%',
  },
  copyButtonContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  descriptionContainer: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    marginBottom: 20,
  },
  mnemonicPhraseNumber: {
    color: customColors.navy['600'],
    marginRight: 12,
  },
  mnemonicPhraseWord: {
    color: theme.typography.primary,
    marginRight: 12,
  },
  recoveryPhraseWordBody: {
    backgroundColor: theme.background.secondary,
    borderColor: customColors.navy['100'],
    borderRadius: Math.round(recoveryPhraseWordHeightDefault / 2),
    borderWidth: 1,
    color: customColors.navy['800'],
    flex: 1,
    flexDirection: 'row',
    height: recoveryPhraseWordHeightDefault,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  recoveryPhraseWordContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  rowContainer: {
    borderBottomWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  secretPhraseColumn: {
    flex: 1,
    marginRight: 8,
  },
  secretPhraseContainer: {
    flexDirection: 'row',
  },
  tapRevealPhraseContainer: {
    marginBottom: 4,
    width: '100%',
  },
  tapRevealPhraseText: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    marginTop: 8,
  },
}));
