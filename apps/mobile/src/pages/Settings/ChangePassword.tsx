// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import { zxcvbn } from '@zxcvbn-ts/core';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import PetraSecureTextInput from 'core/components/PetraSecureTextInput';
import { PetraTextInputProps } from 'core/components/PetraTextInput';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React, { useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AlertTriangleIconSVG from 'shared/assets/svgs/alert_triangle_icon';
import CheckCircleIconSVG from 'shared/assets/svgs/check_circle_icon';
import { i18nmock } from 'strings';

const redirectToSecurityPrivacyTimeout = 2000;

interface SaveButtonProps {
  isLoading: boolean;
  onPress: () => void;
}

function SaveButton({ isLoading, onPress }: SaveButtonProps) {
  return (
    <PetraPillButton
      isLoading={isLoading}
      onPress={onPress}
      text={i18nmock('settings:manageAccount.accountName.save')}
      buttonDesign={PillButtonDesign.default}
    />
  );
}

function InfoText() {
  const styles = useStyles();
  return (
    <Text style={styles.infoText}>
      {i18nmock('settings:changePassword.infoText')}
    </Text>
  );
}

function PasswordHint() {
  const styles = useStyles();
  const { watch } = useFormContext<FormValues>();
  const newPassword = watch('newPassword');
  const result = zxcvbn(newPassword);
  const passwordScore = result.score;

  const passwordStyleFromStrength = () => {
    switch (passwordScore) {
      case 0:
      case 1:
        return { color: customColors.error };
      case 2:
        return { color: customColors.orange['600'] };
      case 3:
        return { color: customColors.green['500'] };
      case 4:
      default:
        return { color: customColors.green['500'] };
    }
  };

  // @TODO: unify with other password hint utilities

  const getPasswordHint = () => {
    if (newPassword.length === 0) {
      // A single space guarantees a consistent height
      return ' ';
    }
    const passwordHintBase = `  ${i18nmock(
      'onboarding:passwordHint.strength',
    )}`;
    if (passwordScore === 0 || passwordScore === 1) {
      return `${passwordHintBase}${i18nmock('onboarding:passwordHint.weak')}`;
    }
    if (passwordScore === 2) {
      return `${passwordHintBase}${i18nmock('onboarding:passwordHint.fair')}`;
    }
    if (passwordScore === 3) {
      return `${passwordHintBase}${i18nmock('onboarding:passwordHint.good')}`;
    }
    return `${passwordHintBase}${i18nmock('onboarding:passwordHint.strong')}`;
  };

  return (
    <Typography style={[styles.strengthText, passwordStyleFromStrength()]}>
      {passwordScore >= 3 && (
        <MaterialCommunityIcons
          name="check-circle"
          color={
            passwordScore === 3
              ? customColors.green['500']
              : customColors.green['800']
          }
          size={12}
        />
      )}
      {getPasswordHint()}
    </Typography>
  );
}

interface PasswordInputProps extends PetraTextInputProps {
  clearErrors: () => void;
  error?: ChangePasswordError;
  fieldName: 'oldPassword' | 'newPassword' | 'confirmedNewPassword';
}

function PasswordInput({
  clearErrors,
  error,
  fieldName,
  ...otherProps
}: PasswordInputProps) {
  const { setValue } = useFormContext<FormValues>();

  const errorStyles =
    error?.field === fieldName
      ? {
          borderColor: customColors.error,
          borderWidth: 2,
          color: customColors.error,
        }
      : undefined;

  return (
    <PetraSecureTextInput
      onChangeText={(e) => {
        setValue(fieldName, e);
        clearErrors();
      }}
      style={errorStyles}
      {...otherProps}
    />
  );
}

interface PasswordInputErrorProps {
  error?: ChangePasswordError;
  fieldName: keyof FormValues;
}

function PasswordInputError({ error, fieldName }: PasswordInputErrorProps) {
  const errorMessage = error?.field === fieldName ? error.message : ' ';
  return (
    <Typography color={customColors.error} style={{ fontSize: 12 }}>
      {errorMessage}
    </Typography>
  );
}

function SuccessMessage() {
  const styles = useStyles();
  const { watch } = useFormContext();

  const hasChangedPassword = watch('hasChangedPassword');

  if (!hasChangedPassword) return null;

  return (
    <View
      style={[
        styles.messageContainer,
        {
          backgroundColor: customColors.green['100'],
        },
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.iconContainer}>
          <CheckCircleIconSVG color={customColors.green['700']} />
        </View>
        <Text style={[styles.successLabel]}>
          {i18nmock('settings:changePassword.passwordUpdated.text')}
        </Text>
      </View>
      <Text style={styles.successSubtext}>
        {i18nmock('settings:changePassword.passwordUpdated.subtext')}
      </Text>
    </View>
  );
}

function ErrorMessage({ error }: { error?: ChangePasswordError }) {
  const styles = useStyles();
  if (error === undefined) {
    return null;
  }

  return (
    <View
      style={[
        styles.messageContainer,
        {
          backgroundColor: customColors.orange['100'],
        },
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.iconContainer}>
          <AlertTriangleIconSVG color={customColors.orange['500']} />
        </View>
        <Text style={[styles.errorLabel]}>{error.message}</Text>
      </View>
      <Text style={styles.errorSubtext}>{error.subtext}</Text>
    </View>
  );
}

interface FormValues {
  confirmedNewPassword: string;
  hasChangedPassword: boolean;
  isLoading: boolean;
  newPassword: string;
  oldPassword: string;
  showConfirmedNewPassword: boolean;
  showNewPassword: boolean;
  showOldPassword: boolean;
}

interface ChangePasswordError {
  field: 'oldPassword' | 'newPassword' | 'confirmedNewPassword';
  message: string;
  subtext: string;
}

export default function ChangePassword({
  navigation,
}: RootAuthenticatedStackScreenProps<'ChangePassword'>) {
  const styles = useStyles();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<FormValues>({
    defaultValues: {
      confirmedNewPassword: '',
      hasChangedPassword: false,
      isLoading: false,
      newPassword: '',
      oldPassword: '',
      showConfirmedNewPassword: false,
      showNewPassword: false,
      showOldPassword: false,
    },
    reValidateMode: 'onSubmit',
  });
  const { getValues, setValue } = form;
  const [error, setError] = useState<ChangePasswordError>();

  const { changePassword } = useInitializedAccounts();

  const clearErrors = () => {
    setError(undefined);
    form.clearErrors();
  };

  const handleSubmit = async () => {
    const oldPassword = getValues('oldPassword');
    const newPassword = getValues('newPassword');
    const confirmedNewPassword = getValues('confirmedNewPassword');

    clearErrors();

    if (newPassword !== confirmedNewPassword) {
      setError({
        field: 'confirmedNewPassword',
        message: i18nmock(
          'settings:changePassword.confirmedNewPasswordNotMatch.text',
        ),
        subtext: i18nmock(
          'settings:changePassword.confirmedNewPasswordNotMatch.subtext',
        ),
      });

      return;
    }

    if (newPassword.length < 9) {
      setError({
        field: 'newPassword',
        message: i18nmock('settings:changePassword.newPasswordNotStrong.text'),
        subtext: i18nmock(
          'settings:changePassword.newPasswordNotStrong.subtext',
        ),
      });

      return;
    }

    try {
      setIsLoading(true);
      await changePassword(oldPassword, newPassword);
      setIsLoading(false);
      // show success banner
      setValue('hasChangedPassword', true);
      setValue('isLoading', false);
      // redirect to Security & Privacy after 2s
      setTimeout(() => {
        navigation.navigate('SecurityPrivacy');
      }, redirectToSecurityPrivacyTimeout);
    } catch (errorCatch: any) {
      if (errorCatch.message === 'Incorrect current password') {
        setError({
          field: 'oldPassword',
          message: i18nmock(
            'settings:changePassword.incorrectCurrentPassword.text',
          ),
          subtext: i18nmock(
            'settings:changePassword.incorrectCurrentPassword.subtext',
          ),
        });
      }
      setIsLoading(false);
    }
  };

  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmNewPasswordInputRef = useRef<TextInput>(null);

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView>
        <ScrollView style={styles.body}>
          <FormProvider {...form}>
            <PasswordInput
              fieldName="oldPassword"
              placeholder={i18nmock(
                'settings:changePassword.currentPasswordPlaceholder',
              )}
              clearErrors={clearErrors}
              error={error}
              returnKeyType="next"
              nextInputRef={newPasswordInputRef}
            />
            <PasswordInputError error={error} fieldName="oldPassword" />
            <PasswordInput
              inputRef={newPasswordInputRef}
              fieldName="newPassword"
              placeholder={i18nmock(
                'settings:changePassword.newPasswordPlaceholder',
              )}
              clearErrors={clearErrors}
              error={error}
              returnKeyType="next"
              nextInputRef={confirmNewPasswordInputRef}
            />
            <PasswordHint />
            <PasswordInput
              inputRef={confirmNewPasswordInputRef}
              onSubmitEditing={handleSubmit}
              fieldName="confirmedNewPassword"
              placeholder={i18nmock(
                'settings:changePassword.confirmedNewPasswordPlaceholder',
              )}
              clearErrors={clearErrors}
              error={error}
              returnKeyType="done"
            />
            <PasswordInputError
              error={error}
              fieldName="confirmedNewPassword"
            />
            <InfoText />
            <ErrorMessage error={error} />
            <SuccessMessage />
          </FormProvider>
        </ScrollView>
        <View style={styles.footer}>
          <SaveButton isLoading={isLoading} onPress={handleSubmit} />
        </View>
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    flex: 1,
    padding: 16,
  },
  container: {
    backgroundColor: theme.background.secondary,
  },
  errorLabel: {
    color: customColors.orange['750'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
  errorSubtext: {
    color: customColors.orange['750'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    flexShrink: 0,
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginRight: 12,
  },
  infoText: {
    color: customColors.navy['600'],
    fontFamily: 'WorkSans-Regular',
    marginTop: 4,
  },
  messageContainer: {
    backgroundColor: customColors.orange['100'],
    borderRadius: 12,
    color: customColors.orange['750'],
    marginTop: 36,
    padding: 20,
    width: '100%',
  },
  passwordInputContainer: {
    marginBottom: 24,
  },
  strengthText: {
    fontSize: 12,
  },
  successLabel: {
    color: customColors.green['700'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
  successSubtext: {
    color: customColors.green['700'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    marginTop: 4,
  },
}));
