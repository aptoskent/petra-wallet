// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View } from 'react-native';
import { customColors } from '@petra/core/colors';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import { ImportStackScreenProps } from 'navigation/types';
import KeyIconSVG from 'shared/assets/svgs/key_icon';
import MnemonicIconSVG from 'shared/assets/svgs/mnemonic_icon';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import {
  TALL_BUTTON_OVERRIDE_STYLE,
  TALL_BUTTON_TEXT_OVERRIDE_STYLE,
} from 'core/components/PetraPillButton';
import OnboardingInstruction from '../Shared/OnboardingInstruction';

type ImportWalletOptionsProps = ImportStackScreenProps<'ImportOptions'>;

function ImportWalletOptions({ navigation }: ImportWalletOptionsProps) {
  const styles = useStyles();
  const navigateToPrivateKey = () => {
    navigation.navigate('ImportPrivateKey', { isAddAccount: false });
  };

  const navigateToMnemonic = () => {
    navigation.navigate('ImportMnemonic', { isAddAccount: false });
  };

  return (
    <View style={styles.container} {...testProps('ImportWalletOptions-screen')}>
      <View style={styles.onboardingInstruction}>
        <OnboardingInstruction
          title={i18nmock('onboarding:importWallet.importOptions.title')}
          subtext=""
        />
      </View>
      <View style={styles.buttonContainer}>
        <PetraPillButton
          accessibilityLabel={i18nmock(
            'onboarding:importWallet.importPrivateKey.title',
          )}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          buttonStyleOverride={TALL_BUTTON_OVERRIDE_STYLE}
          buttonTextStyleOverride={TALL_BUTTON_TEXT_OVERRIDE_STYLE}
          containerStyleOverride={styles.buttonOverrideTop}
          leftIcon={() => <KeyIconSVG color={customColors.navy['900']} />}
          onPress={navigateToPrivateKey}
          testId="import-private-key"
          text={i18nmock('onboarding:importWallet.importPrivateKey.title')}
        />
        <PetraPillButton
          accessibilityLabel={i18nmock(
            'onboarding:importWallet.importMnemonic.label',
          )}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          buttonStyleOverride={TALL_BUTTON_OVERRIDE_STYLE}
          buttonTextStyleOverride={TALL_BUTTON_TEXT_OVERRIDE_STYLE}
          containerStyleOverride={styles.buttonOverride}
          leftIcon={() => <MnemonicIconSVG color={customColors.navy['900']} />}
          onPress={navigateToMnemonic}
          testId="import-mnemonic"
          text={i18nmock('onboarding:importWallet.importMnemonic.label')}
        />
      </View>
    </View>
  );
}

export default ImportWalletOptions;

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonOverride: {
    marginVertical: 12,
  },
  buttonOverrideTop: {
    marginBottom: 12,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    padding: 20,
    width: '100%',
  },
  onboardingInstruction: { minHeight: 24 },
}));
