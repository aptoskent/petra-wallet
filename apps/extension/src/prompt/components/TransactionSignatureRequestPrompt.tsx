// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Center,
  Heading,
  Spinner,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { secondaryErrorMessageColor } from '@petra/core/colors';
import { TransactionPayload } from '@petra/core/serialization';
import { TransactionOptions } from '@petra/core/transactions';
import dappTransactionHeadingProps from '@petra/core/utils/styles';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { BCS, HexString, TxnBuilderTypes } from 'aptos';
import { useTransactions } from '@petra/core/hooks/useTransactions';
import { transactionErrorToast } from 'core/components/Toast';
import { isKeystoneSignatureCancel } from 'modules/keystone';
import PayloadInfoSection from './PayloadInfoSection';
import {
  PermissionRequestBody,
  PermissionRequestFooter,
  PermissionRequestLayout,
} from './PermissionPromptLayout';
import { Tile } from './Tile';
import usePayloadInfo from './usePayloadInfo';

interface TransactionSignatureRequestPromptProps {
  options?: TransactionOptions;
  payload: TransactionPayload | TxnBuilderTypes.MultiAgentRawTransaction;
}

export function TransactionSignatureRequestPrompt({
  options,
  payload,
}: TransactionSignatureRequestPromptProps) {
  const { colorMode } = useColorMode();
  const { buildRawTransaction, signMultiAgentTransaction, signTransaction } =
    useTransactions();
  const payloadInfo = usePayloadInfo(payload);

  const onApprove = async () => {
    try {
      let signedBytes;
      if (payload instanceof TxnBuilderTypes.MultiAgentRawTransaction) {
        signedBytes = await signMultiAgentTransaction(payload);
      } else {
        const rawTxn = await buildRawTransaction(payload, options);
        const signedTxn = await signTransaction(rawTxn);
        signedBytes = BCS.bcsToBytes(signedTxn);
      }

      const signedTxnHex = HexString.fromUint8Array(signedBytes).toString();
      return { signedTxnHex };
    } catch (err) {
      if (!isKeystoneSignatureCancel(err)) {
        transactionErrorToast(err);
      }
      throw err;
    }
  };

  function renderPayloadInfo() {
    if (payloadInfo.error) {
      return (
        <Box color={secondaryErrorMessageColor[colorMode]}>
          <Heading {...dappTransactionHeadingProps}>
            <FormattedMessage defaultMessage="Payload parse error" />
          </Heading>
          <Text fontSize="sm" lineHeight="20px">
            {payloadInfo.error.message}
          </Text>
        </Box>
      );
    }

    return (
      <>
        <Heading size="sm" lineHeight="24px" mb="4px">
          <FormattedMessage defaultMessage="Payload info" />
        </Heading>
        {payloadInfo.isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <PayloadInfoSection info={payloadInfo.data} />
        )}
      </>
    );
  }

  return (
    <PermissionRequestLayout
      title={<FormattedMessage defaultMessage="Signature request" />}
    >
      <PermissionRequestBody>
        <Tile>{renderPayloadInfo()}</Tile>
      </PermissionRequestBody>
      <PermissionRequestFooter onApprove={onApprove} requiresSigner />
    </PermissionRequestLayout>
  );
}

export default TransactionSignatureRequestPrompt;
