// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Box,
  useColorMode,
} from '@chakra-ui/react';
import { type PrivateKeyFormValues } from 'core/layouts/AddAccountLayout';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye';
import { AiOutlineEyeInvisible } from '@react-icons/all-files/ai/AiOutlineEyeInvisible';
import { useFormContext } from 'react-hook-form';
import { buttonBorderColor } from '@petra/core/colors';

interface ImportAccountPrivateKeyBodyProps {
  hasSubmit?: boolean;
  px?: number;
}

export default function ImportAccountPrivateKeyBody({
  hasSubmit,
  px = 4,
}: ImportAccountPrivateKeyBodyProps) {
  const { register, setValue, watch } = useFormContext<PrivateKeyFormValues>();
  const { colorMode } = useColorMode();
  const intl = useIntl();

  const showPrivateKey = watch('showPrivateKey');
  const privateKey = watch('privateKey');
  const handleToggleShow = () => setValue('showPrivateKey', !showPrivateKey);

  return (
    <Flex flexDirection="column" height="100%">
      <VStack spacing={4} px={px} pt={4} flex={1} marginTop={4}>
        <VStack width="100%" flex="1">
          <Flex justifyContent="flex-start" width="100%" flexDirection="column">
            <Text fontSize={14}>
              <FormattedMessage defaultMessage="Access an existing wallet with your private key." />
            </Text>
          </Flex>
          <InputGroup>
            <Input
              variant="filled"
              {...register('privateKey')}
              minLength={1}
              placeholder={intl.formatMessage({
                defaultMessage: 'Enter private key here',
              })}
              height={14}
              type={showPrivateKey ? 'text' : 'password'}
              pr="60px"
            />
            <InputRightElement
              width="4.5rem"
              marginTop={2}
              onClick={handleToggleShow}
            >
              {showPrivateKey ? (
                <AiOutlineEyeInvisible size={28} />
              ) : (
                <AiOutlineEye size={28} />
              )}
            </InputRightElement>
          </InputGroup>
        </VStack>
      </VStack>
      {hasSubmit ? (
        <Box
          p={4}
          width="100%"
          borderTop="1px"
          borderColor={buttonBorderColor[colorMode]}
        >
          <Button
            colorScheme="salmon"
            height="48px"
            width="100%"
            type="submit"
            disabled={privateKey.length === 0}
          >
            <FormattedMessage defaultMessage="Submit" />
          </Button>
        </Box>
      ) : null}
    </Flex>
  );
}
