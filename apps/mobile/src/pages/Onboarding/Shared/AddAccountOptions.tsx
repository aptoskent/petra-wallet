// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { customColors } from '@petra/core/colors';
import { i18nmock } from 'strings';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { PlusIconSVG, KeyIconSVG } from 'shared/assets/svgs';
import MnemonicIconSVG from 'shared/assets/svgs/mnemonic_icon';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import { testProps } from 'e2e/config/testProps';

export default function AddAccountOptions() {
  const styles = useStyles();
  const navigation = useNavigation();

  const handleSignUpNavigation = async () => {
    navigation.navigate('SignUpMnemonicDisplay', {
      confirmedPassword: '',
      isAddAccount: true,
    });
  };

  return (
    <View style={styles.container} {...testProps('AddAccountOptions-screen')}>
      <PetraPillButton
        buttonDesign={PillButtonDesign.clearWithDarkText}
        containerStyleOverride={styles.pillOverride}
        onPress={handleSignUpNavigation}
        text={i18nmock('onboarding:appLaunch.createWallet.text')}
        leftIcon={() => (
          <PlusIconSVG encircled={false} color={customColors.navy['900']} />
        )}
        testId="create-new-account"
      />
      <PetraPillButton
        buttonDesign={PillButtonDesign.clearWithDarkText}
        containerStyleOverride={styles.pillOverride}
        onPress={() =>
          navigation.navigate('AddAccountPrivateKey', { isAddAccount: true })
        }
        text={i18nmock('onboarding:importWallet.importPrivateKey.title')}
        leftIcon={() => <KeyIconSVG color={customColors.navy['900']} />}
        testId="import-private-key"
      />
      <PetraPillButton
        buttonDesign={PillButtonDesign.clearWithDarkText}
        containerStyleOverride={styles.pillOverride}
        onPress={() =>
          navigation.navigate('AddAccountImportMnemonic', {
            isAddAccount: true,
          })
        }
        text={i18nmock('onboarding:importWallet.importMnemonic.label')}
        leftIcon={() => <MnemonicIconSVG color={customColors.navy['900']} />}
        testId="import-phrase"
      />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    display: 'flex',
    flex: 1,
    paddingHorizontal: PADDING.container,
  },
  pillOverride: {
    marginVertical: 8,
    width: '100%',
  },
}));
