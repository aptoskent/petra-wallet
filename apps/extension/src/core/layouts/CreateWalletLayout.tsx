// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Box,
  Button,
  Flex,
  Grid,
  Tooltip,
  useColorMode,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  secondaryBgColor,
  secondaryBackButtonBgColor,
  secondaryButtonBgColor,
} from '@petra/core/colors';
import { useOnboardingState } from 'core/hooks/useOnboardingState';
import Browser, { isMobile } from '@petra/core/utils/browser';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Transition, type TransitionStatus } from 'react-transition-group';
import Routes from 'core/routes';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { passwordOptions } from 'core/components/CreatePasswordBody';
import { AptosAccount } from 'aptos';
import {
  generateMnemonic,
  generateMnemonicObject,
  keysFromAptosAccount,
} from '@petra/core/utils/account';
import { useAccounts } from '@petra/core/hooks/useAccounts';
import { passwordStrength } from '@petra/core/constants';
import Step from 'core/components/Step';
import OnboardingConfirmationPopup from 'core/components/OnboardingConfirmationPopup';
import { accountEvents } from '@petra/core/utils/analytics/events';
import { useAnalytics } from 'core/hooks/useAnalytics';
import Copyable from '../components/Copyable';
import OnboardingConfirmationModal from '../components/OnboardingConfirmationModal';

zxcvbnOptions.setOptions(passwordOptions);

export enum OnboardingPage {
  CreatePassword = 0,
  SecretRecoveryPhrase = 1,
  EnterSecretRecoveryPhrase = 2,
}

export interface CreateWalletFormValues {
  confirmPassword: string;
  confirmPasswordFocused: boolean;
  confirmSavedsecretRecoveryPhrase: boolean;
  initialPassword: string;
  mnemonic: string[];
  mnemonicString: string;
  mnemonicValues: { [key: number]: string };
  savedSecretRecoveryPhrase: boolean;
  showPassword: boolean;
  showSecretRecoveryPhrase: boolean;
  showSecretRecoveryPhrasePopup: boolean;
  termsOfService: boolean;
}

interface NextButtonProps {
  isImport?: boolean;
}

function CopyButton() {
  const { setValue, watch } = useFormContext<CreateWalletFormValues>();
  const { colorMode } = useColorMode();

  const mnemonic = watch('mnemonic');
  const showSecretRecoveryPhrase = watch('showSecretRecoveryPhrase');
  const savedSecretRecoveryPhrase = watch('savedSecretRecoveryPhrase');
  if (!showSecretRecoveryPhrase) return null;

  return (
    <Copyable value={mnemonic.join(' ')} width="100%" copiedPrompt="">
      <Button
        width="100%"
        height="48px"
        size="md"
        border="1px"
        bgColor={secondaryButtonBgColor[colorMode]}
        borderColor="navy.300"
        onClick={() => {
          setValue('savedSecretRecoveryPhrase', true);
          setTimeout(() => {
            setValue('savedSecretRecoveryPhrase', false);
          }, 3000);
        }}
      >
        {savedSecretRecoveryPhrase ? 'Copied!' : 'Copy'}
      </Button>
    </Copyable>
  );
}

function NextButton({ isImport = false }: NextButtonProps) {
  const { setValue, watch } = useFormContext<CreateWalletFormValues>();
  const { activeStep, nextStep } = useOnboardingState();
  const termsOfService = watch('termsOfService');
  const initialPassword = watch('initialPassword');
  const confirmPassword = watch('confirmPassword');
  const mnemonicString = watch('mnemonicString');
  const mnemonicValues = watch('mnemonicValues');
  const passwordResult = zxcvbn(initialPassword);
  const passwordScore = passwordResult.score;

  const nextOnClick = useCallback(async () => {
    if (activeStep === 0 || activeStep === 1) {
      nextStep();
    } else if (activeStep === 2) {
      setValue('showSecretRecoveryPhrasePopup', true);
    }
  }, [setValue, activeStep, nextStep]);

  const NextButtonComponent = useMemo(() => {
    const baseNextButton = (
      <Button
        width="100%"
        size="md"
        onClick={nextOnClick}
        height="48px"
        colorScheme="salmon"
      >
        Continue
      </Button>
    );

    const disabledNextButton = (
      <Button
        width="100%"
        isDisabled
        size="md"
        onClick={nextOnClick}
        colorScheme="salmon"
        height="48px"
      >
        Continue
      </Button>
    );

    switch (activeStep) {
      case OnboardingPage.CreatePassword: {
        if (
          termsOfService &&
          initialPassword === confirmPassword &&
          passwordScore >= passwordStrength
        ) {
          return baseNextButton;
        }
        if (initialPassword !== confirmPassword) {
          return (
            <Tooltip label="Passwords must match">
              <Box width="100%" height="100%">
                {disabledNextButton}
              </Box>
            </Tooltip>
          );
        }
        if (passwordScore < passwordStrength) {
          return (
            <Tooltip label={'Password strength must be at least "strong"'}>
              <Box width="100%" height="100%">
                {disabledNextButton}
              </Box>
            </Tooltip>
          );
        }
        return (
          <Tooltip label="You must agree to the Terms of Service">
            <Box width="100%" height="100%">
              {disabledNextButton}
            </Box>
          </Tooltip>
        );
      }
      case OnboardingPage.SecretRecoveryPhrase: {
        return baseNextButton;
      }
      case OnboardingPage.EnterSecretRecoveryPhrase: {
        const sortedMnemonicEntries = Object.entries(mnemonicValues).sort(
          (a, b) => Number(a[0]) - Number(b[0]),
        );
        const mnemonicInputString = sortedMnemonicEntries
          .map((v) => v[1])
          .join(' ');
        if (mnemonicString === mnemonicInputString) {
          return baseNextButton;
        }

        return (
          <Tooltip label="You must enter correct Secret Recovery Phrase">
            <Box width="100%" height="100%">
              {disabledNextButton}
            </Box>
          </Tooltip>
        );
      }
      default: {
        return disabledNextButton;
      }
    }
  }, [
    nextOnClick,
    mnemonicValues,
    mnemonicString,
    activeStep,
    termsOfService,
    initialPassword,
    confirmPassword,
    passwordScore,
  ]);

  return isImport && activeStep >= 1 ? null : NextButtonComponent;
}

const transitionDuration = 200;

interface CreateWalletLayoutProps {
  children: React.ReactElement;
}

const buttonBorderColor = {
  dark: 'gray.700',
  light: 'gray.200',
};

function CreateWalletLayout({ children }: CreateWalletLayoutProps) {
  const { setValue, watch } = useFormContext<CreateWalletFormValues>();
  const { initAccounts } = useAccounts();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState<boolean>(false);

  const { activeStep, nextStep, prevStep } = useOnboardingState();
  const navigate = useNavigate();
  const confirmPassword = watch('confirmPassword');
  const mnemonicString = watch('mnemonicString');
  const showSecretRecoveryPhrase = watch('showSecretRecoveryPhrase');
  const showSecretRecoveryPhrasePopup = watch('showSecretRecoveryPhrasePopup');
  const ref = useRef(null);

  const termsOfService = watch('termsOfService');
  const initialPassword = watch('initialPassword');
  const savedSecretRecoveryPhrase = watch('savedSecretRecoveryPhrase');

  const passwordResult = zxcvbn(initialPassword);
  const passwordScore = passwordResult.score;

  const initAccount = useCallback(async () => {
    setLoading(true);
    const { mnemonic, seed } = await generateMnemonicObject(mnemonicString);
    const aptosAccount = new AptosAccount(seed);

    const firstAccount = {
      mnemonic,
      ...keysFromAptosAccount(aptosAccount),
    };

    await initAccounts(confirmPassword, {
      [firstAccount.address]: firstAccount,
    });
    setLoading(false);
    return aptosAccount.address();
  }, [confirmPassword, initAccounts, mnemonicString]);

  const nextOnClick = useCallback(async () => {
    if (activeStep === 0) {
      if (
        termsOfService &&
        initialPassword === confirmPassword &&
        passwordScore >= passwordStrength
      ) {
        nextStep();
      }
    } else if (activeStep === 1) {
      if (savedSecretRecoveryPhrase) {
        nextStep();
      }
    } else if (activeStep === 3) {
      navigate(Routes.wallet.path);
    }
  }, [
    initialPassword,
    activeStep,
    confirmPassword,
    passwordScore,
    savedSecretRecoveryPhrase,
    termsOfService,
    navigate,
    nextStep,
  ]);

  const prevOnClick = useCallback(() => {
    if (activeStep === 0) {
      navigate(Routes.noWallet.path);
    }
    prevStep();
  }, [activeStep, navigate, prevStep]);

  const { colorMode } = useColorMode();

  const handleCreateAccount = useCallback(async () => {
    const address = await initAccount();
    trackEvent({
      eventType: accountEvents.CREATE_ACCOUNT,
      params: {
        address,
      },
    });
    navigate(Routes.welcome.path);
  }, [initAccount, navigate, trackEvent]);

  const handleCancel = useCallback(() => {
    setValue('showSecretRecoveryPhrasePopup', false);
  }, [setValue]);

  const props = useMemo(
    () => ({
      duration: transitionDuration,
      finalRef: ref,
      isLoading: loading,
      isOpen: showSecretRecoveryPhrasePopup,
      primaryBttnOnClick: handleCreateAccount,
      secondaryBttnOnClick: handleCancel,
    }),
    [handleCancel, handleCreateAccount, loading, showSecretRecoveryPhrasePopup],
  );

  // we only want to apply additional padding style when user is using desktop onboarding
  // not in dev simulation mode
  const shouldApplyDesktopStyle =
    !Browser.isDev() || window.location.pathname.includes('onboarding');

  const steps = [
    { content: null, label: <FormattedMessage defaultMessage="Password" /> },
    {
      content: null,
      label: <FormattedMessage defaultMessage="Secret Recovery Phrase" />,
    },
    {
      content: null,
      label: (
        <FormattedMessage defaultMessage="Enter Your Secret Recovery Phrase" />
      ),
    },
  ];

  return (
    <Grid
      height="100%"
      width="100%"
      maxW="100%"
      templateRows={[
        `60px 1fr ${showSecretRecoveryPhrase ? 132 : 84}px`,
        `${shouldApplyDesktopStyle ? '100px' : '60px'} 1fr ${
          showSecretRecoveryPhrase ? 132 : 84
        }px`,
      ]}
      bgColor={secondaryBgColor[colorMode]}
      position="relative"
      borderRadius={shouldApplyDesktopStyle ? '2rem' : ''}
    >
      <HStack width="100%" px={[4, shouldApplyDesktopStyle ? 12 : 4]}>
        <IconButton
          position="absolute"
          size="md"
          aria-label="back"
          colorScheme="salmon"
          icon={<ArrowBackIcon fontSize={20} />}
          variant="filled"
          onClick={prevOnClick}
          bgColor={secondaryBackButtonBgColor[colorMode]}
          borderRadius="1rem"
        />
        <Flex justifyContent="center" width="100%">
          <HStack spacing="0" justify="space-evenly" width="40%">
            {steps.map((_step, id) => (
              <Step
                /* eslint-disable-next-line react/no-array-index-key */
                key={id}
                cursor="pointer"
                onClick={activeStep > id ? prevOnClick : nextOnClick}
                isActive={activeStep === id}
                isCompleted={activeStep > id}
                isLastStep={id === steps.length - 1}
              />
            ))}
          </HStack>
        </Flex>
      </HStack>
      <Box
        px={[4, shouldApplyDesktopStyle ? 12 : 4]}
        height="100%"
        width="100%"
        maxH="100%"
        overflowY="auto"
      >
        <form>{children}</form>
      </Box>
      <Flex width="100%" justify="flex-end" alignItems="center">
        <VStack
          width="full"
          borderTop="1px"
          py={4}
          borderColor={buttonBorderColor[colorMode]}
        >
          <Flex
            width="100%"
            px={[4, shouldApplyDesktopStyle ? 12 : 4]}
            gap={2}
            flexDirection="column"
          >
            <CopyButton />
            <NextButton />
          </Flex>
        </VStack>
      </Flex>
      {!isMobile() ? (
        <OnboardingConfirmationModal {...props} />
      ) : (
        <Transition
          in={showSecretRecoveryPhrasePopup}
          timeout={transitionDuration}
          nodeRef={ref}
        >
          {(state: TransitionStatus) => (
            <OnboardingConfirmationPopup {...props} state={state} />
          )}
        </Transition>
      )}
    </Grid>
  );
}

export default function CreateWalletLayoutContainer(props: any) {
  const mnemonic = generateMnemonic();
  const methods = useForm<CreateWalletFormValues>({
    defaultValues: {
      confirmPassword: '',
      confirmPasswordFocused: false,
      confirmSavedsecretRecoveryPhrase: false,
      initialPassword: '',
      mnemonic: mnemonic.split(' '),
      mnemonicString: mnemonic,
      mnemonicValues: {},
      savedSecretRecoveryPhrase: false,
      showPassword: false,
      showSecretRecoveryPhrase: false,
      showSecretRecoveryPhrasePopup: false,
    },
  });

  return (
    <FormProvider {...methods}>
      <CreateWalletLayout {...props} />
    </FormProvider>
  );
}
