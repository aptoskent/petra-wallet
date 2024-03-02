// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
  chakra,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

import { SubmitHandler, useForm } from 'react-hook-form';
import WalletLayout from 'core/layouts/WalletLayout';
import {
  secondaryBgColor,
  buttonBorderColor,
  secondaryTextColor,
} from '@petra/core/colors';
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import ResetPasswordConfirmationModal from '../core/components/ResetPasswordConfirmationModal';

interface FormValues {
  hasReauthenticated: boolean;
  password: string;
  show: boolean;
}

type ReauthenticateProps = {
  children: JSX.Element;
  title: JSX.Element;
};

function Reauthenticate({ children, title }: ReauthenticateProps) {
  const { colorMode } = useColorMode();
  const { clearAccounts, unlockAccounts } = useInitializedAccounts();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: { hasReauthenticated: false, password: '', show: false },
    reValidateMode: 'onSubmit',
  });
  const intl = useIntl();

  const hasReauthenticated = watch('hasReauthenticated');
  const show = watch('show');

  const onSubmit: SubmitHandler<FormValues> = async ({ password }, event) => {
    event?.preventDefault();
    try {
      await unlockAccounts!(password);
      setValue('hasReauthenticated', true);
    } catch (error: any) {
      setError('password', {
        message: intl.formatMessage({ defaultMessage: 'Incorrect password' }),
        type: 'validate',
      });
    }
  };

  const handleClickResetPassword = () => {
    onOpen();
  };

  const handleConfirmResetPassword = async () => {
    await clearAccounts();
    onClose();
  };

  const handleToggleShowPassword = () => {
    setValue('show', !getValues('show'));
  };

  // prompt user for password if they have not yet re-authenticated
  if (!hasReauthenticated) {
    return (
      <WalletLayout
        title={title}
        showBackButton
        hasWalletFooter={false}
        showAccountCircle={false}
      >
        <VStack
          bgColor={secondaryBgColor[colorMode]}
          spacing={4}
          width="100%"
          height="100%"
        >
          <chakra.form
            onSubmit={handleSubmit(onSubmit)}
            width="100%"
            height="100%"
            pt={10}
          >
            <VStack gap={4} height="100%">
              <FormControl
                display="flex"
                flexDir="column"
                isRequired
                height="100%"
                px={4}
              >
                <Flex flexDirection="row">
                  <FormLabel
                    requiredIndicator={<span />}
                    fontSize="md"
                    fontWeight={500}
                    flex={1}
                  >
                    <FormattedMessage defaultMessage="Enter password" />
                  </FormLabel>
                  <Button
                    cursor="pointer"
                    onClick={handleClickResetPassword}
                    fontWeight={500}
                    fontSize="md"
                    color={secondaryTextColor[colorMode]}
                    variant="link"
                  >
                    <FormattedMessage defaultMessage="Reset password" />
                  </Button>
                </Flex>
                <ResetPasswordConfirmationModal
                  onConfirm={handleConfirmResetPassword}
                  isOpen={isOpen}
                  onClose={onClose}
                />
                <InputGroup>
                  <Input
                    size="lg"
                    autoComplete="false"
                    variant="filled"
                    type={show ? 'text' : 'password'}
                    placeholder={intl.formatMessage({
                      defaultMessage: 'Password...',
                    })}
                    maxLength={64}
                    {...register('password')}
                  />
                  <InputRightElement width="4.5rem" pt={1}>
                    {show ? (
                      <AiOutlineEyeInvisible
                        size={28}
                        onClick={handleToggleShowPassword}
                      />
                    ) : (
                      <AiOutlineEye
                        size={28}
                        onClick={handleToggleShowPassword}
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
                {errors.password && (
                  <Text fontSize="sm" color="red.400">
                    {errors.password.message}
                  </Text>
                )}
              </FormControl>
              <Box
                width="100%"
                borderTop="1px"
                p={4}
                borderColor={buttonBorderColor[colorMode]}
              >
                <Button
                  color="white"
                  py={6}
                  width="100%"
                  type="submit"
                  colorScheme="salmon"
                >
                  <FormattedMessage defaultMessage="Next" />
                </Button>
              </Box>
            </VStack>
          </chakra.form>
        </VStack>
      </WalletLayout>
    );
  }

  // show the wrapped children after correct password has been entered
  return children;
}

export default Reauthenticate;
