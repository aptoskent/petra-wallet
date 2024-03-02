// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import {
  useActiveAccount,
  useUnlockedAccounts,
} from '@petra/core/hooks/useAccounts';
import {
  PetraPillButton,
  PetraTextInput,
  PillButtonDesign,
} from 'core/components';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';

interface EditAccountNameInputProps {
  onSubmit: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => Promise<void>;
}

function EditAccountNameInput({ onSubmit }: EditAccountNameInputProps) {
  const styles = useStyles();
  const {
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useFormContext<FormValues>();
  const accountName = watch('accountName');

  const errorStyles = errors.accountName?.message
    ? {
        borderColor: customColors.error,
        borderWidth: 2,
        color: customColors.error,
      }
    : undefined;

  return (
    <View style={styles.accountNameInputContainer}>
      <Typography color="navy.800" style={styles.label}>
        {i18nmock('settings:manageAccount.accountName.label')}
      </Typography>
      <PetraTextInput
        onSubmitEditing={onSubmit}
        onChangeText={(e) => {
          setValue('accountName', e);
          if (e.length > 30) {
            setError('accountName', {
              message: i18nmock('settings:manageAccount.accountName.maxLength'),
              type: 'validate',
            });
          } else {
            setError('accountName', {});
          }
        }}
        placeholder={i18nmock('settings:manageAccount.accountName.placeholder')}
        placeholderTextColor={customColors.navy['600']}
        style={errorStyles}
        value={accountName}
      />
      {errors.accountName?.message ? (
        <Typography
          variant="small"
          color={customColors.error}
          style={styles.errorMessage}
        >
          {errors.accountName.message}
        </Typography>
      ) : null}
    </View>
  );
}

interface SaveButtonProps {
  disabled: boolean;
  onPress: () => void;
}

function SaveButton({ disabled, onPress }: SaveButtonProps) {
  return (
    <PetraPillButton
      onPress={onPress}
      text={i18nmock('settings:manageAccount.accountName.save')}
      buttonDesign={PillButtonDesign.default}
      disabled={disabled}
    />
  );
}

interface FormValues {
  accountName: string;
}

export default function EditAccountName(
  props: RootAuthenticatedStackScreenProps<'EditAccountName'>,
) {
  const styles = useStyles();
  const { navigation } = props;
  const { renameAccount } = useUnlockedAccounts();
  const { activeAccount } = useActiveAccount();
  const { address, name } = activeAccount;

  const form = useForm<FormValues>({
    defaultValues: { accountName: name ?? '' },
    mode: 'onChange',
  });

  const { setError, watch } = form;

  const accountName = watch('accountName');
  const isNameValid = accountName.length > 0 && accountName.length <= 30;

  const onSubmit = async () => {
    if (!isNameValid) {
      return;
    }
    try {
      await renameAccount(address, accountName);
      navigation.navigate('ManageAccount', { needsAuthentication: false });
    } catch (error: any) {
      setError('accountName', {
        message: i18nmock('settings:manageAccount.accountName.errorMessage'),
        type: 'validate',
      });
    }
  };

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView>
        <FormProvider {...form}>
          <View style={styles.body}>
            <EditAccountNameInput onSubmit={onSubmit} />
          </View>
          <View style={styles.footer}>
            <SaveButton onPress={onSubmit} disabled={!isNameValid} />
          </View>
        </FormProvider>
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  accountNameInputContainer: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: PADDING.container,
  },
  container: {
    backgroundColor: theme.background.secondary,
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 8,
  },
  footer: {
    padding: PADDING.container,
  },
  label: {
    marginBottom: 8,
  },
}));
