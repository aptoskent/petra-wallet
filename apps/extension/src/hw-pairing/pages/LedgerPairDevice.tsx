// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { CreateAccountFromLedgerParams } from 'modules/accountCreation/types';
import { BsLaptop } from '@react-icons/all-files/bs/BsLaptop';
import { CgUsb } from '@react-icons/all-files/cg/CgUsb';
import { PairWithLedgerContext } from '../hooks/usePairWithLedger';
import {
  FullscreenExtensionContainer,
  FullscreenExtensionContainerBody,
  FullscreenExtensionContainerHeader,
  FullscreenExtensionContainerFooter,
} from '../layouts/ExtensionContainerLayout';

export default function LedgerPairDevice() {
  const { getValues } = useFormContext<CreateAccountFromLedgerParams>();
  const { pairDevice } = useContext(PairWithLedgerContext);
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const navigate = useNavigate();

  async function onPair() {
    const transport = getValues('transport');
    setIsPairing(true);
    try {
      const isPaired = await pairDevice(transport);
      if (isPaired) {
        navigate('/ledger/select-address');
      }
    } finally {
      setIsPairing(false);
    }
  }

  return (
    <FullscreenExtensionContainer>
      <FullscreenExtensionContainerHeader
        title={<FormattedMessage defaultMessage="Pair with Ledger" />}
        hideBackButton
      />
      <FullscreenExtensionContainerBody>
        <VStack height="100%" fontSize="md" alignItems="stretch" spacing={6}>
          <Text>
            <FormattedMessage defaultMessage="Before proceeding, make sure you follow these instructions:" />
          </Text>
          <UnorderedList spacing={1} alignSelf="center">
            <ListItem>
              <FormattedMessage defaultMessage="Connect your Ledger device to your computer" />
            </ListItem>
            <ListItem>
              <FormattedMessage defaultMessage="Insert the PIN to unlock" />
            </ListItem>
            <ListItem>
              <FormattedMessage defaultMessage="Open the Aptos nano app" />
            </ListItem>
          </UnorderedList>
          <HStack flexGrow={1} justifyContent="space-around" px={8} pb={8}>
            <CgUsb style={{ rotate: '90deg' }} size={60} />
            <BsLaptop size={80} />
          </HStack>
        </VStack>
      </FullscreenExtensionContainerBody>
      <FullscreenExtensionContainerFooter>
        <Button
          colorScheme="salmon"
          isLoading={isPairing}
          disabled={isPairing}
          onClick={() => onPair()}
        >
          Pair
        </Button>
      </FullscreenExtensionContainerFooter>
    </FullscreenExtensionContainer>
  );
}
