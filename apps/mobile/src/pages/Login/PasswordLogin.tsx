// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import { PetraPillButton } from 'core/components';
import { getResetPasswordContent } from 'core/components/PetraAlertModalContent';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import PetraSecureTextInput from 'core/components/PetraSecureTextInput';
import Typography from 'core/components/Typography';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import makeStyles from 'core/utils/makeStyles';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { HIT_SLOPS } from 'shared';
import { petraLogo } from 'shared/assets/images';
import { i18nmock } from 'strings';

export default function PasswordLogin() {
  const styles = useStyles();
  const { dismissAlertModal, showAlertModal } = useAlertModalContext();
  const { clearAccounts } = useInitializedAccounts();
  const [password, setPassword] = React.useState<string>('');

  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const { unlockAccounts } = useInitializedAccounts();

  const onUnlockPress = async () => {
    setIsUnlocking(true);
    try {
      await unlockAccounts(password);
    } catch (error: any) {
      Alert.alert(i18nmock('onboarding:passwordEntry.loginError'));
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleClearAccounts = async () => {
    await clearAccounts();
    dismissAlertModal();
  };

  const handleOnResetPasswordPress = () => {
    showAlertModal(getResetPasswordContent(handleClearAccounts));
  };

  return (
    <SafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView>
        <View style={styles.body}>
          {/* Wrapper required as animated unit, prevents animation glitches */}
          <View style={styles.content}>
            <Image source={petraLogo} />
            <Typography variant="display" style={styles.headingText}>
              {i18nmock('general:welcomeBack')}
            </Typography>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.passwordAndResetContainer}>
            <Typography variant="small" color="white">
              {i18nmock('general:password')}
            </Typography>
            <TouchableOpacity
              hitSlop={HIT_SLOPS.midSlop}
              onPress={handleOnResetPasswordPress}
            >
              <Typography variant="small" color="navy.400" underline>
                {i18nmock('general:resetPassword')}
              </Typography>
            </TouchableOpacity>
          </View>
          <PetraSecureTextInput
            onChangeText={(e) => setPassword(e)}
            inputTheme="dark"
            placeholder={i18nmock(
              'onboarding:createPassword.placeholder.enterPassword',
            )}
            onSubmitEditing={onUnlockPress}
            style={styles.passwordInput}
            value={password}
          />
          <PetraPillButton
            text={i18nmock('general:unlock')}
            accessibilityLabel={i18nmock('general:unlock')}
            accessibilityHint={i18nmock('general:unlockHint')}
            onPress={onUnlockPress}
            isLoading={isUnlocking}
            disabled={isUnlocking}
            containerStyleOverride={{ marginTop: 16 }}
            testId="unlock"
          />
        </View>
      </PetraKeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.background.primary,
    flexGrow: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexShrink: 0,
    padding: 16,
  },
  headingText: {
    color: theme.typography.secondary,
    fontSize: 34,
    lineHeight: 34,
    marginVertical: 24,
  },
  passwordAndResetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    backgroundColor: customColors.navy['700'],
  },
}));
