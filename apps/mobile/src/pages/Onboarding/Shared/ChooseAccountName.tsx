// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { PetraPillButton, PetraTextInput } from 'core/components';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import {
  ImportStackScreenProps,
  SignupStackScreenProps,
} from 'navigation/types';
import OnboardingInstruction from 'pages/Onboarding/Shared/OnboardingInstruction';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';

type ChooseAccountNameProps =
  | SignupStackScreenProps<'SignUpChooseAccountName'>
  | ImportStackScreenProps<'ImportWalletChooseAccountName'>;

export default function ChooseAccountName({
  navigation,
  route,
}: ChooseAccountNameProps) {
  const styles = useStyles();
  const accountName = useRef<string>('');
  const [isNameValid, setIsNameValid] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onNameChange = (newValue: string) => {
    accountName.current = newValue;
    const isNameTooLong = newValue.length > 30;
    setIsNameValid(newValue.length > 0 && !isNameTooLong);
    setError(
      isNameTooLong
        ? i18nmock('settings:manageAccount.accountName.maxLength')
        : undefined,
    );
  };

  const onSubmit = () => {
    if (!isNameValid) {
      return;
    }
    const { fromRoute, isAddAccount = false, ...previousParams } = route.params;
    const sharedParams = {
      accountName: accountName.current,
      isAddAccount,
      ...previousParams,
    };

    if (fromRoute?.includes('ImportWallet')) {
      const typedNavigation =
        navigation as ImportStackScreenProps<'ImportWalletChooseAccountName'>['navigation'];
      typedNavigation.navigate('ImportWalletCongratsFinish', {
        ...sharedParams,
        fromRoute: 'ImportWalletChooseAccountName',
      });
    } else {
      const typedNavigation =
        navigation as SignupStackScreenProps<'SignUpChooseAccountName'>['navigation'];
      typedNavigation.navigate('SignUpCongratsFinish', {
        ...sharedParams,
        fromRoute: 'SignUpChooseAccountName',
      });
    }
  };

  return (
    <BottomSafeAreaView style={styles.container}>
      <PetraKeyboardAvoidingView>
        <View style={styles.body} {...testProps('ChooseAccountName-screen')}>
          <ScrollView>
            <OnboardingInstruction
              title={i18nmock('onboarding:chooseAccountName.title')}
              subtext={i18nmock('onboarding:chooseAccountName.subtext')}
            />
            <View style={styles.inputContainer}>
              <Typography color="navy.900" style={styles.label}>
                {i18nmock('onboarding:chooseAccountName.label')}
              </Typography>
              <PetraTextInput
                onChangeText={onNameChange}
                onSubmitEditing={onSubmit}
                placeholder={i18nmock(
                  'onboarding:chooseAccountName.placeholder',
                )}
                style={[
                  styles.input,
                  error
                    ? {
                        borderColor: customColors.error,
                        color: customColors.error,
                      }
                    : undefined,
                ]}
                focusedBorderColor={error ? customColors.error : undefined}
                testId="choose-account-name"
              />
              <Typography
                variant="small"
                color={customColors.error}
                style={styles.error}
              >
                {error}
              </Typography>
            </View>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <PetraPillButton
            onPress={onSubmit}
            disabled={!isNameValid}
            text={i18nmock('general:done')}
            testId="done"
          />
        </View>
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    flex: 1,
    padding: PADDING.container,
  },
  container: {
    backgroundColor: theme.background.secondary,
  },
  error: {
    marginTop: 8,
  },
  footer: {
    padding: PADDING.container,
  },
  input: {
    backgroundColor: theme.background.tertiary,
  },
  inputContainer: {
    marginTop: 40,
  },
  label: {
    marginBottom: 8,
  },
}));
