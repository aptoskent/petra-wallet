// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import LedgerAddressSelectionForm from '../components/LedgerAddressSelectionForm';
import {
  FullscreenExtensionContainer,
  FullscreenExtensionContainerBody,
  FullscreenExtensionContainerHeader,
  FullscreenExtensionContainerFooter,
} from '../layouts/ExtensionContainerLayout';

export default function LedgerSelectAddress() {
  return (
    <FullscreenExtensionContainer>
      <FullscreenExtensionContainerHeader
        title={<FormattedMessage defaultMessage="Select address" />}
      />
      <FullscreenExtensionContainerBody>
        <LedgerAddressSelectionForm />
      </FullscreenExtensionContainerBody>
      <FullscreenExtensionContainerFooter>
        <Button colorScheme="salmon" type="submit">
          <FormattedMessage defaultMessage="Add account" />
        </Button>
      </FullscreenExtensionContainerFooter>
    </FullscreenExtensionContainer>
  );
}
