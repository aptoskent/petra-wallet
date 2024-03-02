// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { zxcvbn } from '@zxcvbn-ts/core';
import { PetraPillButton } from 'core/components';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import PetraSecureTextInput from 'core/components/PetraSecureTextInput';
import Typography from 'core/components/Typography';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React, { useRef, useState } from 'react';
import {
  ReturnKeyTypeOptions,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { i18nmock } from 'strings';
import { testProps } from 'e2e/config/testProps';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import OnboardingInstruction from './OnboardingInstruction';

const getPasswordHintFromScore = (score: number) => {
  const passwordHintBase = `${i18nmock('onboarding:passwordHint.strength')}`;
  switch (score) {
    case -1:
      // A single space guarantees a consistent height
      return ' ';
    case 0:
    case 1:
      return `${passwordHintBase}${i18nmock('onboarding:passwordHint.weak')}`;
    case 2:
      return `${passwordHintBase}${i18nmock('onboarding:passwordHint.fair')}`;
    case 3:
      return `${passwordHintBase}${i18nmock('onboarding:passwordHint.good')}`;
    default:
      return `${passwordHintBase}${i18nmock('onboarding:passwordHint.strong')}`;
  }
};

const getColorFromScore = (score: number) => {
  switch (score) {
    case -1:
      return undefined;
    case 0:
    case 1:
      return customColors.error;
    case 2:
      return customColors.orange['600'];
    case 3:
      return customColors.green['500'];
    default:
      return customColors.green['800'];
  }
};

export interface PasswordEntryProps {
  accessibilityText: string;
  buttonText: string;
  onDone: (password: string) => void;
  returnKeyType?: ReturnKeyTypeOptions;
}

export default function PasswordEntry({
  accessibilityText,
  buttonText,
  onDone,
  returnKeyType,
}: PasswordEntryProps) {
  const styles = useStyles();
  const password = useRef<string>('');
  const confirmPassword = useRef<string>('');
  const [passwordScore, setPasswordScore] = useState<number>(-1);
  const [isPasswordConfirmed, setIsPasswordConfirmed] =
    useState<boolean>(false);

  const confirmPasswordInputRef = useRef<TextInput>(null);

  const onContinue = () => {
    if (isPasswordValid) {
      onDone(password.current);
    }
  };

  const onPasswordChange = (value: string) => {
    password.current = value;
    const newScore = value.length > 0 ? zxcvbn(value).score : -1;
    setPasswordScore(newScore);
    setIsPasswordConfirmed(confirmPassword.current === password.current);
  };

  const onConfirmPasswordChange = (value: string) => {
    confirmPassword.current = value;
    setIsPasswordConfirmed(confirmPassword.current === password.current);
  };

  const statusColor = getColorFromScore(passwordScore);
  const passwordHint = getPasswordHintFromScore(passwordScore);
  const isPasswordStrongEnough = passwordScore >= 3;
  const isPasswordValid = isPasswordStrongEnough && isPasswordConfirmed;

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView>
        <View style={styles.body} {...testProps('PasswordEntry-screen')}>
          <ScrollView>
            <OnboardingInstruction
              title={i18nmock('onboarding:createPassword.title')}
              subtext={i18nmock('onboarding:createPassword.subtext')}
            />
            <PetraSecureTextInput
              onChangeText={onPasswordChange}
              placeholder={i18nmock(
                'onboarding:createPassword.placeholder.enterPassword',
              )}
              containerStyle={styles.inputContainer}
              style={[
                styles.input,
                statusColor !== undefined && {
                  borderColor: statusColor,
                },
              ]}
              focusedBorderColor={statusColor}
              nextInputRef={confirmPasswordInputRef}
              returnKeyType="next"
              testId="enter-password"
            />
            <Typography
              variant="small"
              color={statusColor}
              style={styles.strengthText}
            >
              {isPasswordStrongEnough && (
                <>
                  <MaterialCommunityIcons name="check-circle" />
                  &nbsp;
                </>
              )}
              {passwordHint}
            </Typography>
            <PetraSecureTextInput
              inputRef={confirmPasswordInputRef}
              onChangeText={onConfirmPasswordChange}
              onSubmitEditing={onContinue}
              placeholder={i18nmock(
                'onboarding:createPassword.placeholder.confirmPassword',
              )}
              style={[
                styles.input,
                isPasswordValid && {
                  borderColor: statusColor,
                },
              ]}
              focusedBorderColor={isPasswordValid ? statusColor : undefined}
              returnKeyType={returnKeyType}
              testId="confirm-password"
            />
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <PetraPillButton
            text={buttonText}
            onPress={onContinue}
            accessibilityLabel={accessibilityText}
            disabled={!isPasswordValid}
            testId="continue"
          />
        </View>
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  container: {
    backgroundColor: theme.background.secondary,
  },
  footer: {
    flexShrink: 0,
    padding: PADDING.container,
  },
  input: {
    backgroundColor: customColors.white,
    borderColor: customColors.navy['100'],
  },
  inputContainer: {
    marginTop: 24,
  },
  strengthText: {
    fontSize: 12,
    lineHeight: 24,
  },
}));
