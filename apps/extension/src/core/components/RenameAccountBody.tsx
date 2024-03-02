// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  FormControl,
  Input,
  VStack,
  Button,
  FormErrorMessage,
  Flex,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Routes from 'core/routes';
import {
  buttonBorderColor,
  secondaryButtonBgColor,
  customColors,
} from '@petra/core/colors';
import {
  useActiveAccount,
  useUnlockedAccounts,
} from '@petra/core/hooks/useAccounts';

interface AccountEditFormData {
  name: string;
}

export default function RenameAccountBody() {
  const { renameAccount } = useUnlockedAccounts();
  const { activeAccount } = useActiveAccount();
  const { address, name } = activeAccount!;
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const intl = useIntl();

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<AccountEditFormData>({
    defaultValues: { name },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<AccountEditFormData> = async (data, event) => {
    event?.preventDefault();
    await renameAccount(address, data.name);
    navigate(Routes.wallet.path);
  };

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
      <Flex flexDirection="column" height="100%">
        <FormControl
          isInvalid={errors.name !== undefined}
          display="flex"
          gap={2}
          flexDirection="column"
          flex={1}
          px={4}
          pb={4}
        >
          <Text fontSize={18}>Wallet Name</Text>
          <Input
            height="48px"
            placeholder={intl.formatMessage({
              defaultMessage: 'Enter wallet name',
            })}
            required
            {...register('name', {
              maxLength: {
                message: intl.formatMessage({ defaultMessage: 'Too long' }),
                value: 20,
              },
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <VStack
          width="100%"
          p={4}
          borderTop="1px"
          spacing={2}
          borderColor={buttonBorderColor[colorMode]}
        >
          <Button
            width="100%"
            height="48px"
            isDisabled={!isValid}
            type="submit"
            colorScheme="salmon"
          >
            <FormattedMessage defaultMessage="Save" />
          </Button>
          <Button
            width="100%"
            height="48px"
            bgColor={secondaryButtonBgColor[colorMode]}
            border="1px"
            borderColor={customColors.navy[400]}
            onClick={onCancel}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
        </VStack>
      </Flex>
    </form>
  );
}
