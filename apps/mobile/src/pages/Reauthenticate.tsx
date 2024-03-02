// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import PetraSecureTextInput from 'core/components/PetraSecureTextInput';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React, { useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
  Dimensions,
  NativeSyntheticEvent,
  Text,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { i18nmock } from 'strings';
import { getResetPasswordContent } from 'core/components/PetraAlertModalContent';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';

interface PasswordInputProps {
  onSubmit: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => Promise<void>;
}

function PasswordInput({ onSubmit }: PasswordInputProps) {
  const styles = useStyles();
  const {
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useFormContext<FormValues>();
  const password = watch('password');

  const errorMessage = errors?.password?.message;
  const errorStyles = errorMessage
    ? { borderColor: customColors.error, borderWidth: 2 }
    : {};

  return (
    <>
      <PetraSecureTextInput
        onSubmitEditing={onSubmit}
        onChangeText={(e) => {
          setValue('password', e);
          setError('password', {});
        }}
        placeholder={i18nmock('settings:securityCheckpoint.placeholder')}
        style={{
          ...styles.passwordInput,
          ...errorStyles,
        }}
        value={password}
      />
      {errorMessage ? (
        <View style={styles.incorrectPasswordContainer}>
          {errors.password?.message ? (
            <Text style={styles.incorrectPassword}>
              {errors.password.message}
            </Text>
          ) : null}
        </View>
      ) : null}
    </>
  );
}

function ResetPassword() {
  const styles = useStyles();
  const { dismissAlertModal, showAlertModal } = useAlertModalContext();
  const { clearAccounts } = useInitializedAccounts();

  const handleClearAccounts = async () => {
    await clearAccounts();
    dismissAlertModal();
  };

  const handleOnResetPasswordPress = () => {
    showAlertModal(getResetPasswordContent(handleClearAccounts));
  };

  return (
    <View style={styles.resetPassword}>
      <TouchableOpacity onPress={handleOnResetPasswordPress}>
        <Typography variant="small" color="navy.600" weight="500" underline>
          {i18nmock('general:forgotPassword')}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

type ReauthenticateProps = {
  children: React.ReactElement;
  title: string;
  updateTitle?: (newTitle: string) => void;
};

interface FormValues {
  hasReauthenticated: boolean;
  password: string;
  show: boolean;
}

export default function Reauthenticate({
  children,
  title,
  updateTitle,
}: ReauthenticateProps) {
  const styles = useStyles();
  const form = useForm<FormValues>({
    defaultValues: { hasReauthenticated: false, password: '', show: false },
    reValidateMode: 'onSubmit',
  });
  const { setError, setValue, watch } = form;
  const { unlockAccounts } = useInitializedAccounts();

  const hasReauthenticated = watch('hasReauthenticated');
  const password = watch('password');

  useEffect(() => {
    // update to main screen once user has authenticated
    if (hasReauthenticated) {
      updateTitle?.(title);
    } else {
      // when component mounts and users have not reauthenticated
      // we set the title to 'Security Checkpoint'
      updateTitle?.(i18nmock('settings:securityCheckpoint.title'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasReauthenticated]);

  const handleSubmit = async () => {
    try {
      await unlockAccounts!(password);
      setValue('hasReauthenticated', true);
    } catch (error: any) {
      setError('password', {
        message: i18nmock('settings:securityCheckpoint.incorrect'),
        type: 'validate',
      });
    }
  };

  if (!hasReauthenticated) {
    return (
      <BottomSafeAreaView style={styles.container}>
        <FormProvider {...form}>
          <PasswordInput onSubmit={handleSubmit} />
          <ResetPassword />
        </FormProvider>
      </BottomSafeAreaView>
    );
  }

  return children;
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  incorrectPassword: {
    color: theme.palette.error,
    fontFamily: 'WorkSans-Regular',
  },
  incorrectPasswordContainer: {
    marginTop: 8,
    minHeight: 28,
  },
  passwordInput: {
    backgroundColor: theme.background.tertiary,
    borderColor: theme.palette.primary,
    borderRadius: Dimensions.get('window').height / 2,
    borderWidth: 1,
  },
  resetPassword: {
    alignItems: 'flex-start',
    paddingTop: 24,
  },
}));
