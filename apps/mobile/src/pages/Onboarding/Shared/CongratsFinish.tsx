// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import { customColors } from '@petra/core/colors';
import {
  PetraBackButton,
  PetraPillButton,
  PillButtonDesign,
} from 'core/components';
import { OpenURLButton } from 'core/components/PetraCheckBox';
import Typography from 'core/components/Typography';
import { useKeychain } from 'core/hooks/useKeychain';
import useTrackEvent from 'core/hooks/useTrackEvent';
import usePreventBackButton from 'core/hooks/usePreventBackButton';
import Lottie from 'lottie-react-native';
import {
  ImportStackScreenProps,
  RootAuthenticatedStackScreenProps,
  SignupStackScreenProps,
} from 'navigation/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { onboardingSuccessAnimation } from 'shared/assets/json';
import { i18nmock } from 'strings';
import { testProps } from 'e2e/config/testProps';
import makeStyles from 'core/utils/makeStyles';
import { HELP_SUPPORT_LINK, PADDING } from 'shared/constants';
import AlertOctagonFillIcon from 'shared/assets/svgs/alert_octagon_fill_icon';
import { IS_DEVELOPMENT } from 'shared/utils';
import {
  AnalyticsEventTypeValues,
  createAccountEvents,
  developmentEvents,
  importAccountEvents,
} from '@petra/core/utils/analytics/events';
import { usePetraToastContext } from 'core/providers/ToastProvider';

type AddAccountMnemonicPromiseType = (
  mnemonicString: string,
  accountName?: string,
) => Promise<void>;

type AddAccountPKPromiseType = (
  privateKey: string,
  accountName?: string,
) => Promise<void>;

type CreateAccountMnemonicPromiseType = (
  privateKey: string,
  password: string,
  accountName?: string,
) => Promise<void>;

type CreateAccountPKPromiseType = (
  mnemonicString: string,
  password: string,
  accountName?: string,
) => Promise<void>;

type CheckAndCallProps =
  | AddAccountMnemonicPromiseType
  | AddAccountPKPromiseType
  | CreateAccountMnemonicPromiseType
  | CreateAccountPKPromiseType;

type WrapperProps = {
  activeAccountAddress: string | undefined;
  addAccountWithMnemonic?: AddAccountMnemonicPromiseType;
  addAccountWithPrivateKey?: AddAccountPKPromiseType;
  createAccountWithMnemonic?: CreateAccountMnemonicPromiseType;
  createAccountWithPrivateKey?: CreateAccountPKPromiseType;
};

export type SignUpCongratsFinishProps =
  | SignupStackScreenProps<'SignUpCongratsFinish'>
  | ImportStackScreenProps<'ImportWalletCongratsFinish'>
  | RootAuthenticatedStackScreenProps<'ImportWalletCongratsFinish'>
  | RootAuthenticatedStackScreenProps<'SignUpCongratsFinish'>;

// if a user is adding an account, we are waiting for the activeAccountAddress to change
// in order to trigger the navigation (popToTop).
// if a user accidentally adds the same account and account address does not change, we
// want to make sure they don't get stuck on the CongratsFinish screen, and want them to
// navigate anyway after 3 seconds.
let navigateTimer: ReturnType<typeof setTimeout> | null = null;
const navigateTimerWaitMs = 3000;

export default function CongratsFinish({
  activeAccountAddress,
  addAccountWithMnemonic,
  addAccountWithPrivateKey,
  createAccountWithMnemonic,
  createAccountWithPrivateKey,
  navigation,
  route,
}: SignUpCongratsFinishProps & WrapperProps) {
  const { trackEvent } = useTrackEvent();
  const styles = useStyles();
  const [isAddingAccount, setIsAddingAccount] = React.useState<boolean>(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [didAddAccount, setDidAddAccount] = useState<boolean>(false);
  const { showWarningToast } = usePetraToastContext();

  const handleLikeAnimation = useCallback(() => {
    Animated.timing(progress, {
      duration: 3000,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  useEffect(() => {
    handleLikeAnimation();
  }, [handleLikeAnimation]);

  usePreventBackButton();

  const { unlockedPassword } = useKeychain();

  const {
    accountName,
    confirmedPassword,
    fromRoute,
    isAddAccount,
    mnemonic: mnemonicPhrase,
    privateKey,
  } = route.params as any;

  // pick either the user's entered password at the first step
  // or the password from keychain
  const password = confirmedPassword ?? unlockedPassword;
  const handleRenderHeader = () => (
    <View style={styles.header}>
      <AlertOctagonFillIcon size={24} color="red.500" />
      <Typography variant="heading">
        {i18nmock('onboarding:congratsFinish.error.title')}
      </Typography>
    </View>
  );

  const handlePressLink = useCallback(() => {
    void Linking.openURL(HELP_SUPPORT_LINK);
  }, []);

  const handleRenderContent = () => (
    <ScrollView style={styles.scrollView}>
      <Typography variant="body">
        {i18nmock('onboarding:congratsFinish.error.message')}
      </Typography>
      <Typography variant="body" weight="600" style={{ marginTop: 12 }}>
        {i18nmock('onboarding:congratsFinish.error.causeOne')}
      </Typography>
      <Typography variant="body">
        {i18nmock('onboarding:congratsFinish.error.solutionOne')}
      </Typography>
      <Typography variant="body" weight="600" style={{ marginTop: 12 }}>
        {i18nmock('onboarding:congratsFinish.error.causeTwo')}
      </Typography>
      <Typography variant="body">
        {i18nmock('onboarding:congratsFinish.error.solutionTwo')}
      </Typography>
      <Typography variant="body" weight="600" style={{ marginTop: 12 }}>
        {i18nmock('onboarding:congratsFinish.error.causeThree')}
      </Typography>
      <Typography variant="body">
        {i18nmock('onboarding:congratsFinish.error.solutionThree')}
      </Typography>
      <Typography variant="body" style={{ marginTop: 12 }}>
        {i18nmock('onboarding:congratsFinish.error.reachOut.text')}
      </Typography>
      <TouchableOpacity onPress={handlePressLink}>
        <Typography
          variant="body"
          weight="800"
          align="center"
          style={{ marginBottom: 20 }}
        >
          {i18nmock('onboarding:congratsFinish.error.reachOut.discordLink')}
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  );
  const handleUserAccepted = () => {
    setModalVisible(false);
    // enable the ability for user to go back (otherwise only option is to kill app)
    navigation.setOptions({
      gestureEnabled: true,
      headerLeft: (props) => (
        <PetraBackButton {...props} navigation={navigation} />
      ),
      headerShown: true,
    });
  };
  const handleRenderButtons = () => (
    <View style={styles.buttonsContainer}>
      <PetraPillButton
        buttonDesign={PillButtonDesign.clearWithDarkText}
        buttonStyleOverride={{ paddingHorizontal: PADDING.container }}
        onPress={handleUserAccepted}
        text={i18nmock('general:ok')}
        testId="accept-error-shown"
      />
    </View>
  );

  const handleError = (
    eventType: AnalyticsEventTypeValues,
    userIsAddingAccount: boolean,
  ) => {
    setModalVisible(true);
    void trackEvent({
      eventType,
      params: {
        isAddAccount: userIsAddingAccount,
      },
    });
  };

  const checkAndCall = (
    fn: undefined | CheckAndCallProps,
  ): undefined | CheckAndCallProps => {
    // CongratsFinish screen refactored into two screens so that the
    // useUnlockedAccounts' UnlockedAccountsProvider, does not throw.
    // It could be possible to make a change elsewhere and without good testing (manual or E2E)
    // it could go unnoticed.  We are throwing an error in development so you see it!
    // if this somehow makes it to product, we are capturing a metric and alerting the user
    // that they can probably get out of the situation easily with an app kill
    if (fn) {
      return fn;
    }

    if (IS_DEVELOPMENT) {
      Alert.alert(
        'You need to fix this.',
        'One of the create/add account functions was not found.  This is a problem. Please let everyone know.',
      );
    } else {
      void trackEvent({
        eventType: developmentEvents.FUNCTION_NOT_FOUND,
      });
      Alert.alert(
        i18nmock(
          'onboarding:congratsFinish.error.somethingWrongButRecoverable',
        ),
      );
    }
    return undefined;
  };

  React.useEffect(() => {
    // activeAccountAddress passed in from props comes from two different locations
    // one is the useAccounts hook and the other is useActiveAccount.
    // Therefore, the dependency on activeAccountAddress will trigger navigation appropriately
    // once the address has been updated according to the correct hook.
    // The landing page (Assets.tsx) uses useActiveAccount hook, so we need to wait for that
    // to change here before navigating to avoid the flash of previous account.
    if (isAddAccount && didAddAccount) {
      if (navigateTimer !== null) {
        clearTimeout(navigateTimer);
      }
      navigation.popToTop();
    }
  }, [activeAccountAddress]);

  React.useEffect(() => {
    // this effect sets up navigation to occur but should get canceled 100% of the time
    // before navigation once the activeAccountAddress changes.
    // This will NOT get cancelled in the event that a user adds the same account accidentally
    // If didAddAccount somehow loses the race to activeAccountAddress, the timeout for this
    // navigation is not cleared in the above effect
    navigateTimer = setTimeout(() => {
      if (isAddAccount && didAddAccount) {
        navigation.popToTop();
      }
    }, navigateTimerWaitMs);
  }, [didAddAccount]);

  const trackAndShowAlreadyImportedToast = () => {
    void trackEvent({
      eventType: importAccountEvents.ACCOUNT_ALREADY_IMPORTED,
    });
    showWarningToast({
      hideOnPress: true,
      text: i18nmock('onboarding:congratsFinish.accountAlreadyExists'),
      toastPosition: 'bottom',
    });
  };

  const errorIsAlreadyExists = (message: string) =>
    message === 'Account already exists in wallet';

  const handleCreateImportAccount = async () => {
    setIsAddingAccount(true);
    setIsLoading(true);

    if (privateKey !== undefined) {
      if (isAddAccount) {
        try {
          // private key - adding account
          await checkAndCall(addAccountWithPrivateKey)?.(
            privateKey,
            accountName,
          );
          void trackEvent({
            eventType: importAccountEvents.IMPORT_PK_ACCOUNT,
            params: {
              isAddAccount: true,
            },
          });
        } catch (e: any) {
          if (e?.message !== undefined && errorIsAlreadyExists(e.message)) {
            trackAndShowAlreadyImportedToast();
          } else {
            handleError(importAccountEvents.ERROR_IMPORT_PK_ACCOUNT, true);
          }
        } finally {
          setDidAddAccount(true);
        }
      } else {
        try {
          // only able to reach this point if a password exists
          if (password != null) {
            // private key - first account import (NOT adding account)
            await checkAndCall(createAccountWithPrivateKey)?.(
              privateKey,
              password,
              accountName,
            );
            void trackEvent({
              eventType: importAccountEvents.IMPORT_PK_ACCOUNT,
              params: {
                isAddAccount: false,
              },
            });
          }
        } catch {
          handleError(importAccountEvents.ERROR_IMPORT_PK_ACCOUNT, false);
        }
      }
    } else if (mnemonicPhrase !== undefined) {
      if (isAddAccount) {
        try {
          // mnemonic phrase - adding account
          await checkAndCall(addAccountWithMnemonic)?.(
            mnemonicPhrase,
            accountName,
          );
          void trackEvent({
            eventType: importAccountEvents.IMPORT_MNEMONIC_ACCOUNT,
            params: {
              isAddAccount: true,
            },
          });
        } catch (e: any) {
          if (e?.message !== undefined && errorIsAlreadyExists(e.message)) {
            trackAndShowAlreadyImportedToast();
          } else {
            handleError(
              importAccountEvents.ERROR_IMPORT_MNEMONIC_ACCOUNT,
              true,
            );
          }
        } finally {
          setDidAddAccount(true);
        }
      } else {
        try {
          // only able to reach this point if a password exists
          if (password != null) {
            // mnemonic phrase - first account import (NOT adding account)
            await checkAndCall(createAccountWithMnemonic)?.(
              mnemonicPhrase,
              password,
              accountName,
            );
            void trackEvent({
              eventType: importAccountEvents.IMPORT_MNEMONIC_ACCOUNT,
              params: {
                isAddAccount: false,
              },
            });
          }
        } catch {
          handleError(importAccountEvents.ERROR_IMPORT_MNEMONIC_ACCOUNT, false);
        }
      }
    }

    setIsLoading(false);
    setIsAddingAccount(false);
  };

  const handleCreateNewAccount = async () => {
    setIsAddingAccount(true);
    if (mnemonicPhrase !== undefined) {
      if (isAddAccount) {
        try {
          // creating account - add account - mnemonic phrase is only option
          await checkAndCall(addAccountWithMnemonic)?.(
            mnemonicPhrase,
            accountName,
          );
          void trackEvent({
            eventType: createAccountEvents.CREATE_ACCOUNT,
            params: {
              isAddAccount: true,
            },
          });
          setDidAddAccount(true);
        } catch {
          // creating account - first account - mnemonic phrase is only option
          handleError(createAccountEvents.ERROR_CREATE_ACCOUNT, true);
        }
      } else {
        try {
          if (password != null) {
            // creating account - mnemonic phrase is only option
            await checkAndCall(createAccountWithMnemonic)?.(
              mnemonicPhrase,
              password,
              accountName,
            );
            void trackEvent({
              eventType: createAccountEvents.CREATE_ACCOUNT,
              params: {
                isAddAccount: false,
              },
            });
          }
        } catch {
          handleError(createAccountEvents.ERROR_CREATE_ACCOUNT, false);
        }
      }
    }
    setIsAddingAccount(false);
    setIsLoading(false);
  };
  const setModalNotVisible = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView
      style={styles.container}
      {...testProps('CongratsFinish-screen')}
    >
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={modalVisible}
        onRequestClose={setModalNotVisible}
      >
        <View style={styles.modalBody}>
          {handleRenderHeader()}
          {handleRenderContent()}
          {handleRenderButtons()}
        </View>
      </Modal>
      <View style={styles.body}>
        <View style={styles.animationContainer}>
          <Lottie
            style={styles.animation}
            progress={progress}
            loop
            source={onboardingSuccessAnimation}
          />
        </View>
        <View style={styles.textContainer}>
          <Typography
            color={customColors.navy['900']}
            style={styles.mainText}
            variant="display"
            {...testProps('congrats-finish-main-text')}
          >
            {i18nmock('onboarding:congratsFinish.mainText')}
          </Typography>
          <Typography
            color={customColors.navy['900']}
            style={styles.subtext}
            {...testProps('congrats-finish-main-subtext')}
          >
            {i18nmock('onboarding:congratsFinish.subtext')}
          </Typography>
        </View>
      </View>
      <View style={styles.footer}>
        {isAddAccount ? null : (
          <View style={styles.termsContainer}>
            <View style={styles.termsRow}>
              <Typography variant="small" color="navy.900">
                {`${i18nmock('onboarding:congratsFinish.agreeTerm')} `}
              </Typography>
            </View>
            <View style={styles.termsRow}>
              <Typography variant="small" color="navy.900">
                {`${i18nmock('onboarding:congratsFinish.toPetra')} `}
              </Typography>
              <OpenURLButton
                linkUrlText={i18nmock(
                  'onboarding:createPassword.termsOfService.localizedLink.text',
                )}
                url={i18nmock(
                  'onboarding:createPassword.termsOfService.localizedLink.url',
                )}
                style={styles.underline}
              />
            </View>
          </View>
        )}
        <PetraPillButton
          text={
            isAddAccount
              ? i18nmock('onboarding:congratsFinish.finish')
              : i18nmock('onboarding:congratsFinish.finishAccept')
          }
          accessibilityLabel={i18nmock('general:done')}
          disabled={isAddingAccount}
          isLoading={isLoading}
          onPress={
            fromRoute?.includes('ImportWallet')
              ? handleCreateImportAccount
              : handleCreateNewAccount
          }
          testId="congrats-finish-done"
        />
      </View>
    </SafeAreaView>
  );
}

const animationSize = 224;

const useStyles = makeStyles((theme) => ({
  animation: {
    height: animationSize,
    width: animationSize,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 72,
  },
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: PADDING.container,
  },
  buttonsContainer: {
    marginHorizontal: 16,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flexGrow: 1,
  },
  description: { fontSize: 16 },
  footer: {
    flexShrink: 0,
    padding: PADDING.container,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    marginTop: 24,
  },
  mainText: {
    lineHeight: 30,
  },
  modalBody: {
    alignItems: 'center',
    backgroundColor: customColors.white,
    height: '100%',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingTop: 70,
  },
  scrollView: {
    padding: 6,
    paddingHorizontal: 36,
    width: '100%',
  },
  subtext: {
    fontSize: 16,
    lineHeight: 32,
  },
  termsContainer: {
    padding: 24,
  },
  termsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 14,
  },
  textContainer: {
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 16,
    maxHeight: animationSize,
  },
  title: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-Bold',
    fontSize: 20,
    maxWidth: '80%',
    textAlign: 'center',
  },
  underline: {
    color: customColors.navy['900'],
    fontSize: 14,
    textDecorationLine: 'underline',
  },
}));
