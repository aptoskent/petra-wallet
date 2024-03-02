// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
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
  Icon,
  Heading,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FormattedMessage, useIntl } from 'react-intl';

import { SubmitHandler, useForm } from 'react-hook-form';
import { mainBgColor, passwordBgColor } from '@petra/core/colors';
import { PetraLogo } from 'core/components/PetraLogo';
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';
import ResetPasswordConfirmationModal from '../core/components/ResetPasswordConfirmationModal';

interface FormValues {
  password: string;
}

function Password() {
  const { colorMode } = useColorMode();
  const { clearAccounts, unlockAccounts } = useInitializedAccounts();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const intl = useIntl();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<FormValues>({
    defaultValues: { password: '' },
    reValidateMode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ password }, event) => {
    event?.preventDefault();
    try {
      await unlockAccounts(password);
      // Note: redirection occurs automatically, see routing
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <VStack
      bgColor={mainBgColor[colorMode]}
      justifyContent="center"
      spacing={4}
      width="100%"
      height="100%"
    >
      <VStack
        w="100%"
        pt={8}
        px={4}
        h="100%"
        justifyContent="center"
        flexDir="column"
      >
        <Box width="84px" pb={4}>
          <PetraLogo />
        </Box>
        <Heading fontSize="3xl" fontWeight="600" color="white">
          <FormattedMessage
            defaultMessage="Welcome back"
            description="Title for the first page displayed to returning users"
          />
        </Heading>
      </VStack>
      <chakra.form onSubmit={handleSubmit(onSubmit)} width="100%" p={6}>
        <VStack gap={4}>
          <FormControl display="flex" flexDir="column" isRequired>
            <Flex flexDirection="row">
              <FormLabel
                requiredIndicator={<span />}
                fontSize="md"
                fontWeight={500}
                flex={1}
                color="white"
              >
                <FormattedMessage defaultMessage="Password" />
              </FormLabel>
              <Button
                cursor="pointer"
                onClick={handleClickResetPassword}
                fontWeight={500}
                fontSize="md"
                color="navy.500"
                variant="link"
                marginBottom={2}
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
                autoComplete="false"
                variant="filled"
                bgColor={passwordBgColor[colorMode]}
                height="48px"
                type={showPassword ? 'text' : 'password'}
                placeholder={intl.formatMessage({
                  defaultMessage: 'Password...',
                })}
                maxLength={64}
                _hover={{
                  bgColor: 'navy.700',
                }}
                color="white"
                {...register('password')}
              />
              <InputRightElement width="3rem">
                {showPassword ? (
                  <Icon
                    as={AiOutlineEyeInvisible}
                    w={6}
                    h={6}
                    onClick={handleClickShowPassword}
                    color="white"
                    marginTop={1}
                  />
                ) : (
                  <Icon
                    as={AiOutlineEye}
                    w={6}
                    h={6}
                    onClick={handleClickShowPassword}
                    color="white"
                    marginTop={1}
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
          <Box w="100%" pb={4}>
            <Button py={6} width="100%" type="submit" colorScheme="salmon">
              <FormattedMessage defaultMessage="Unlock" />
            </Button>
          </Box>
        </VStack>
      </chakra.form>
    </VStack>
  );
}

export default Password;
