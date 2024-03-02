// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { HexString } from 'aptos';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useSigner from '@petra/core/hooks/useSigner';
import { transactionErrorToast } from 'core/components/Toast';
import { isKeystoneSignatureCancel } from 'modules/keystone';
import {
  PermissionRequestBody,
  PermissionRequestFooter,
  PermissionRequestLayout,
} from './PermissionPromptLayout';
import { Tile } from './Tile';

interface SignatureRequestPromptProps {
  fullMessage: string;
  message: string;
}

export function SignatureRequestPrompt({
  fullMessage,
  message,
}: SignatureRequestPromptProps) {
  const { activeAccount } = useActiveAccount();
  const { withSigner } = useSigner();

  const onApprove = async () => {
    try {
      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(fullMessage);
      const signatureBytes = await withSigner(activeAccount, (signer) =>
        signer.signBuffer(messageBytes),
      );
      const signature = HexString.fromUint8Array(signatureBytes).noPrefix();
      return { signature };
    } catch (err) {
      if (!isKeystoneSignatureCancel(err)) {
        transactionErrorToast(err);
      }
      throw err;
    }
  };

  return (
    <PermissionRequestLayout
      title={<FormattedMessage defaultMessage="Signature request" />}
    >
      <PermissionRequestBody>
        <Tile>
          <Heading size="sm" lineHeight="24px" mb="4px">
            <FormattedMessage defaultMessage="Message" />
          </Heading>
          <Text whiteSpace="pre" fontSize="sm" lineHeight="20px">
            {message}
          </Text>
        </Tile>
      </PermissionRequestBody>
      <PermissionRequestFooter onApprove={onApprove} requiresSigner />
    </PermissionRequestLayout>
  );
}

export default SignatureRequestPrompt;
