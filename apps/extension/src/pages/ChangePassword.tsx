// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Circle,
  Button,
  useColorMode,
  Text,
  Input,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import WalletLayout from 'core/layouts/WalletLayout';
import { useForm } from 'react-hook-form';
import { FaLock } from '@react-icons/all-files/fa/FaLock';
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import {
  changePasswordNewPasswordNotMatchErrorToast,
  changePasswordSuccessfullyUpdatedToast,
  changePasswordIncorrectCurrentPasswordErrorToast,
} from 'core/components/Toast';
import { Routes } from 'core/routes';
import {
  iconBgColor,
  iconColor,
  buttonBorderColor,
  customColors,
} from '@petra/core/colors';

const inputChangePasswordBgColor = {
  dark: 'gray.800',
  light: customColors.navy[100],
};

function ChangePassword() {
  const { getValues, register, setValue, watch } = useForm({
    defaultValues: {
      confirmNewPassword: '',
      currentPassword: '',
      newPassword: '',
      show: false,
    },
  });
  const intl = useIntl();

  const currentPassword: string = watch('currentPassword');
  const newPassword: string = watch('newPassword');
  const confirmNewPassword: string = watch('confirmNewPassword');
  const show: boolean = watch('show');

  const { changePassword } = useInitializedAccounts();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const handleClickShow = () => setValue('show', !getValues('show'));

  const handleClickSave = async () => {
    if (newPassword !== confirmNewPassword) {
      changePasswordNewPasswordNotMatchErrorToast();
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      changePasswordSuccessfullyUpdatedToast();
      navigate(Routes.wallet.path);
    } catch (e) {
      changePasswordIncorrectCurrentPasswordErrorToast();
    }
  };

  const shouldDisableSaveButton =
    currentPassword.length === 0 ||
    newPassword.length === 0 ||
    confirmNewPassword.length === 0;

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Change password" />}
      showBackButton
      showAccountCircle={false}
      hasWalletFooter={false}
    >
      <VStack width="100%" height="100%" display="flex" paddingTop={8}>
        <VStack width="100%" gap={4} flex={1} px={4}>
          <Box
            px={4}
            pb={0}
            width="100%"
            alignItems="center"
            display="flex"
            justifyContent="center"
          >
            <Circle
              size={16}
              bgColor={iconBgColor[colorMode]}
              color={iconColor[colorMode]}
            >
              <FaLock size={36} />
            </Circle>
          </Box>
          <Text fontSize="sm" textAlign="center" as="div">
            <FormattedMessage defaultMessage="You'll use this to unlock your wallet" />
          </Text>
          <InputGroup>
            <Input
              {...register('currentPassword')}
              placeholder={intl.formatMessage({
                defaultMessage: 'Current password',
              })}
              type={show ? 'text' : 'password'}
              bgColor={inputChangePasswordBgColor[colorMode]}
              paddingTop={6}
              paddingBottom={6}
            />
            <InputRightElement width="4.5rem" marginTop={1}>
              {show ? (
                <AiOutlineEyeInvisible size={32} onClick={handleClickShow} />
              ) : (
                <AiOutlineEye size={32} onClick={handleClickShow} />
              )}
            </InputRightElement>
          </InputGroup>
          <Input
            {...register('newPassword')}
            placeholder="New password"
            type={show ? 'text' : 'password'}
            bgColor={inputChangePasswordBgColor[colorMode]}
            paddingTop={6}
            paddingBottom={6}
          />
          <Input
            {...register('confirmNewPassword')}
            placeholder={intl.formatMessage({
              defaultMessage: 'Confirm new password',
            })}
            type={show ? 'text' : 'password'}
            bgColor={inputChangePasswordBgColor[colorMode]}
            paddingTop={6}
            paddingBottom={6}
          />
        </VStack>
        <Box
          width="100%"
          borderTop="1px"
          p={4}
          borderColor={buttonBorderColor[colorMode]}
        >
          <Button
            width="100%"
            colorScheme="salmon"
            height="48px"
            onClick={handleClickSave}
            disabled={shouldDisableSaveButton}
          >
            <FormattedMessage defaultMessage="Save" />
          </Button>
        </Box>
      </VStack>
    </WalletLayout>
  );
}

export default ChangePassword;
