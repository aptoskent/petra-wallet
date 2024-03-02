// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { CreateAccountFromLedgerParams } from 'modules/accountCreation/types';
import {
  FullscreenExtensionContainer,
  FullscreenExtensionContainerBody,
  FullscreenExtensionContainerHeader,
} from '../layouts/ExtensionContainerLayout';

export default function LedgerAccountAdded() {
  const navigate = useNavigate();
  const { setValue } = useFormContext<CreateAccountFromLedgerParams>();

  function onAddMore() {
    setValue('hdPath', '');
    navigate(-1 as any);
  }

  return (
    <FullscreenExtensionContainer>
      <FullscreenExtensionContainerHeader
        title={<FormattedMessage defaultMessage="Account added" />}
        hideBackButton
      />
      <FullscreenExtensionContainerBody>
        <VStack
          height="50%"
          justifyContent="center"
          spacing={8}
          textAlign="center"
        >
          <Text fontSize="md">
            <FormattedMessage defaultMessage="Account added successfully." />
            <br />
            <FormattedMessage defaultMessage="You can now close this page and return to the extension." />
          </Text>
          <Button onClick={() => onAddMore()}>
            <FormattedMessage defaultMessage="Add another account" />
          </Button>
        </VStack>
      </FullscreenExtensionContainerBody>
    </FullscreenExtensionContainer>
  );
}
