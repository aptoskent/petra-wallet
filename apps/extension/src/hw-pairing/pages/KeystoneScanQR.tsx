// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { Text, useColorMode, VStack } from '@chakra-ui/react';
import { URType } from '@keystonehq/animated-qr';
import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry';
import { primaryTextColor, secondaryTextColor } from '@petra/core/colors';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { importAccountErrorToast } from 'core/components/Toast';
import {
  AptosKeyring,
  KeystoneQRScanner,
  SerializedUR,
  deserializeUR,
} from 'modules/keystone';
import {
  FullscreenExtensionContainer,
  FullscreenExtensionContainerBody,
  FullscreenExtensionContainerHeader,
} from '../layouts/ExtensionContainerLayout';

export default function KeystoneScanQR() {
  const { colorMode } = useColorMode();
  const { accounts, addAccount } = useUnlockedAccounts();
  const navigate = useNavigate();

  const onScan = async (ur: SerializedUR) => {
    try {
      // Initialize keyring from imported UR
      const { cbor } = deserializeUR(ur);
      const keystoneAccounts = CryptoMultiAccounts.fromCBOR(cbor);
      const keyring = new AptosKeyring();
      keyring.syncKeyring(keystoneAccounts);

      // Extract accounts from keyring and filter out existing ones
      const newAccounts = keyring.accounts.filter(
        ({ address }) => !Object.keys(accounts).includes(address),
      );

      // Import new accounts into Petra
      await Promise.all(newAccounts.map((account) => addAccount(account)));

      navigate('/keystone/success', {
        replace: true,
      });
    } catch (err: any) {
      importAccountErrorToast(err.message);
    }
  };

  return (
    <FullscreenExtensionContainer>
      <FullscreenExtensionContainerHeader
        title={<FormattedMessage defaultMessage="Scan the QR Code" />}
      />
      <FullscreenExtensionContainerBody>
        <VStack textAlign="center" spacing={8}>
          <Text
            px={10}
            fontSize={18}
            lineHeight="26px"
            w={400}
            color={primaryTextColor[colorMode]}
          >
            <FormattedMessage
              defaultMessage="Scan the QR code displayed on your Keystone Device"
              description="Prompt the user to scan the QR code displayed on their Keystone Device
                           in order to import the accounts"
            />
          </Text>
          <KeystoneQRScanner
            boxSize="300px"
            urType={URType.CRYPTO_MULTI_ACCOUNTS}
            onScan={onScan}
          />
          <Text fontSize={16} color={secondaryTextColor[colorMode]}>
            <FormattedMessage
              defaultMessage="Position the QR code in front of your camera."
              description="Prompt the user to position the QR code displayed on
                           their Keystone Device in front of the camera, while importing accounts"
            />
          </Text>
        </VStack>
      </FullscreenExtensionContainerBody>
    </FullscreenExtensionContainer>
  );
}
