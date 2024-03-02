// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Button,
  Box,
  Checkbox,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import { MdCancel } from '@react-icons/all-files/md/MdCancel';
import { secondaryTextColor } from '@petra/core/colors';
import { useFormContext } from 'react-hook-form';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { type CreateWalletFormValues } from 'core/layouts/CreateWalletLayout';

export const passwordOptions = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
};

zxcvbnOptions.setOptions(passwordOptions);

const iconColor = {
  dark: 'white',
  light: 'gray.500',
};

export default function CreatePasswordBody() {
  const { colorMode } = useColorMode();
  const { getValues, register, setValue, watch } =
    useFormContext<CreateWalletFormValues>();
  const intl = useIntl();
  const handleClick = () =>
    setValue('showPassword', !getValues('showPassword'));

  const initialPassword = watch('initialPassword');
  const showPassword = watch('showPassword');
  const termsOfService = watch('termsOfService');
  const confirmPassword = watch('confirmPassword');
  const confirmPasswordFocused = watch('confirmPasswordFocused');
  const result = zxcvbn(initialPassword);
  const passwordScore = result.score;

  useEffect(
    () => () => {
      setValue('showPassword', false);
    },
    [setValue],
  );

  const passwordWarningText = useMemo(() => {
    if (passwordScore <= 1) {
      return (
        <FormattedMessage
          defaultMessage={'Password strength must be at least "strong"'}
        />
      );
    }

    return null;
  }, [passwordScore]);

  const confirmPasswordWarningText = useMemo(() => {
    if (
      !initialPassword ||
      !confirmPassword ||
      initialPassword === confirmPassword
    ) {
      return null;
    }

    if (initialPassword !== confirmPassword) {
      return <FormattedMessage defaultMessage="Passwords must match" />;
    }

    if (!termsOfService) {
      return (
        <FormattedMessage defaultMessage="You must agree to the Terms of Service" />
      );
    }

    return null;
  }, [initialPassword, confirmPassword, termsOfService]);

  const termsOfServiceWarningText = useMemo(() => {
    if (
      !initialPassword ||
      !confirmPassword ||
      initialPassword !== confirmPassword ||
      passwordScore <= 2
    ) {
      return '';
    }

    if (!termsOfService) {
      return (
        <FormattedMessage defaultMessage="You must agree to the Terms of Service" />
      );
    }

    return '';
  }, [termsOfService, initialPassword, confirmPassword, passwordScore]);

  const handleCancelClick = () => {
    setValue('initialPassword', '');
    setValue('confirmPassword', '');
  };

  return (
    <VStack align="left" pt={2}>
      <Heading fontSize="xl">
        <FormattedMessage defaultMessage="Create a password" />
      </Heading>
      <Text fontSize="md">
        <FormattedMessage defaultMessage="You'll use this to unlock your wallet" />
      </Text>
      <VStack
        pt={8}
        width="100%"
        spacing={4}
        minHeight="160px"
        display="flex"
        alignItems="flex-start"
      >
        <Box width="100%">
          <InputGroup>
            <Input
              size="lg"
              autoFocus
              autoComplete="false"
              variant="filled"
              isInvalid={!!passwordWarningText}
              errorBorderColor="orange.500"
              type={showPassword ? 'text' : 'password'}
              placeholder={intl.formatMessage({
                defaultMessage: 'Enter Password',
              })}
              maxLength={64}
              paddingTop={6}
              paddingBottom={6}
              {...register('initialPassword')}
            />
            <InputRightElement
              marginTop={1}
              color={iconColor[colorMode]}
              marginRight={2}
              width="4rem"
              className="flex"
            >
              <Box width="1.5rem" marginRight={1}>
                {initialPassword.length > 0 ? (
                  <MdCancel size={24} onClick={handleCancelClick} />
                ) : null}
              </Box>
              <Box width="1.5rem">
                {showPassword ? (
                  <AiOutlineEyeInvisible size={24} onClick={handleClick} />
                ) : (
                  <AiOutlineEye size={24} onClick={handleClick} />
                )}
              </Box>
            </InputRightElement>
          </InputGroup>
          {initialPassword.length > 0 && !!passwordWarningText ? (
            <Text color="orange.500" fontSize="xs" mt={2} width="100%">
              {passwordWarningText}
            </Text>
          ) : null}
        </Box>
        <Box width="100%">
          <InputGroup>
            <Input
              size="lg"
              isInvalid={!!confirmPasswordWarningText}
              autoComplete="false"
              variant="filled"
              errorBorderColor="orange.500"
              type={showPassword ? 'text' : 'password'}
              placeholder={intl.formatMessage({
                defaultMessage: 'Confirm Password',
              })}
              maxLength={64}
              paddingTop={6}
              paddingBottom={6}
              {...register('confirmPassword')}
              onFocus={() => setValue('confirmPasswordFocused', true)}
              onBlur={() => setValue('confirmPasswordFocused', false)}
            />
          </InputGroup>
          {!confirmPasswordFocused && (
            <Text color="orange.500" fontSize="xs" mt={2} width="100%">
              {confirmPasswordWarningText}
            </Text>
          )}
        </Box>
      </VStack>
      <Box pt={4}>
        <Checkbox
          colorScheme="salmon"
          value="terms"
          color={secondaryTextColor[colorMode]}
          {...register('termsOfService')}
        >
          <FormattedMessage
            defaultMessage="I agree to the {termsOfService}"
            values={{
              termsOfService: (
                <Button
                  as="a"
                  href="https://petra.app/Wallet_Terms.pdf"
                  color="navy.600"
                  target="_blank"
                  rel="noreferrer"
                  variant="link"
                >
                  <Text as="u">
                    <FormattedMessage defaultMessage="Terms of Service" />
                  </Text>
                </Button>
              ),
            }}
          />
        </Checkbox>
        {termsOfServiceWarningText && (
          <Text color="orange.500" fontSize="xs" mt={2} width="100%">
            {termsOfServiceWarningText}
          </Text>
        )}
      </Box>
    </VStack>
  );
}
