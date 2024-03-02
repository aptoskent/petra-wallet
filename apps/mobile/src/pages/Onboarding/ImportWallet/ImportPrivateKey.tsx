// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useNavigation } from '@react-navigation/native';
import { AptosAccount } from 'aptos';
import { PetraPillButton } from 'core/components';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import PetraSecureTextInput from 'core/components/PetraSecureTextInput';
import { useKeychain } from 'core/hooks/useKeychain';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import {
  ImportStackScreenProps,
  RootAuthenticatedStackScreenProps,
} from 'navigation/types';
import OnboardingInstruction from 'pages/Onboarding/Shared/OnboardingInstruction';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { i18nmock } from 'strings';

type ImportPrivateKeyProps =
  | ImportStackScreenProps<'ImportPrivateKey'>
  | RootAuthenticatedStackScreenProps<'AddAccountPrivateKey'>;

function ImportPrivateKey({ route }: ImportPrivateKeyProps) {
  const styles = useStyles();
  const [privateKey, setPrivateKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const { unlockedPassword } = useKeychain();
  const { showDangerToast } = usePetraToastContext();

  const onImportPress = async () => {
    setIsLoading(true);
    try {
      // verify if the private key is correct before navigating away
      // by putting the encodedKey inside Aptos Account
      const nonHexKey = privateKey.startsWith('0x')
        ? privateKey.substring(2)
        : privateKey;
      const encodedKey = Uint8Array.from(Buffer.from(nonHexKey, 'hex'));
      // eslint-disable-next-line no-new
      new AptosAccount(encodedKey);

      // there is no unlockedPassword
      if (route.params?.isAddAccount) {
        navigation.navigate('ImportWalletChooseAccountName', {
          confirmedPassword: '',
          fromRoute: 'ImportWalletPasswordCreation',
          isAddAccount: true,
          mnemonic: undefined,
          privateKey,
        });
      } else if (unlockedPassword !== undefined) {
        navigation.navigate('ImportWalletChooseAccountName', {
          confirmedPassword: unlockedPassword,
          fromRoute: 'ImportWalletPasswordCreation',
          isAddAccount: false,
          mnemonic: undefined,
          privateKey,
        });
      } else {
        navigation.navigate('ImportWalletPasswordCreation', {
          mnemonic: undefined,
          privateKey,
        });
      }
    } catch (e) {
      showDangerToast({
        hideOnPress: true,
        text: i18nmock('onboarding:importWallet.importPrivateKey.toast'),
        toastPosition: 'bottomWithButton',
      });
    }
    setIsLoading(false);
  };

  return (
    <BottomSafeAreaView
      style={styles.container}
      {...testProps('ImportPrivateKey-screen')}
    >
      <PetraKeyboardAvoidingView>
        <View style={styles.body}>
          <ScrollView>
            <OnboardingInstruction
              title={i18nmock('onboarding:importWallet.addPrivateKey.title')}
              subtext={i18nmock(
                'onboarding:importWallet.addPrivateKey.subtext',
              )}
            />
            <PetraSecureTextInput
              selectTextOnFocus
              onChangeText={(text: string) => setPrivateKey(text)}
              value={privateKey}
              placeholder={i18nmock(
                'onboarding:importWallet.addPrivateKey.privateKeyInputPlaceholder',
              )}
              onSubmitEditing={onImportPress}
              containerStyle={styles.inputContainer}
              style={styles.input}
              testId="private-key"
            />
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <PetraPillButton
            text={i18nmock('general:next')}
            onPress={onImportPress}
            accessibilityLabel={i18nmock(
              'onboarding:importWallet.importPrivateKey.addButtonAccessibility',
            )}
            disabled={privateKey.length === 0}
            isLoading={isLoading}
          />
        </View>
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

export default ImportPrivateKey;

const useStyles = makeStyles((theme) => ({
  body: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  container: {
    backgroundColor: theme.background.secondary,
  },
  footer: {
    padding: 16,
  },
  input: {
    backgroundColor: theme.background.tertiary,
    borderColor: customColors.navy['100'],
  },
  inputContainer: {
    marginTop: 24,
  },
}));
