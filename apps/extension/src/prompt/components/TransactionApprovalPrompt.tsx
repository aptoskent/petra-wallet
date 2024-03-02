// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Collapse,
  Heading,
  HStack,
  Text,
  VStack,
  chakra,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { TransactionPayload } from '@petra/core/serialization';
import { BiCopy } from '@react-icons/all-files/bi/BiCopy';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TxnBuilderTypes } from 'aptos';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { secondaryErrorMessageColor } from '@petra/core/colors';
import Copyable from 'core/components/Copyable';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { formatCoin } from '@petra/core/utils/coin';
import { maxGasFeeFromEstimated } from '@petra/core/transactions';
import dappTransactionHeadingProps from '@petra/core/utils/styles';
import { useTransactions } from '@petra/core/hooks/useTransactions';
import { transactionErrorToast } from 'core/components/Toast';
import { isKeystoneSignatureCancel } from 'modules/keystone';
import { useApprovalRequestContext } from '../hooks';
import { LoadableContent } from './LoadableContent';
import {
  PermissionRequestBody,
  PermissionRequestFooter,
  PermissionRequestLayout,
} from './PermissionPromptLayout';
import { Tile } from './Tile';
import DappTransactionDetails from './DappTransactionDetails';

const ChakraSyntaxHighlighter = chakra(SyntaxHighlighter);
const simulationRefetchInterval = 10000;

// region Components

interface RawSectionProps {
  data: any;
  title: JSX.Element;
}

function RawSection({ data, title }: RawSectionProps) {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();
  const style = colorMode === 'light' ? docco : darcula;
  const serializedData = JSON.stringify(data, null, 4);

  return (
    <Box>
      <HStack justifyContent="space-between">
        <Button size="xs" variant="unstyled" onClick={onToggle}>
          <Heading {...dappTransactionHeadingProps}>
            {title}
            {isOpen ? <ChevronDownIcon ml={1} /> : <ChevronUpIcon ml={1} />}
          </Heading>
        </Button>
        <Copyable value={serializedData}>
          <Button size="xs" variant="unstyled">
            <Center>
              <BiCopy size={14} />
            </Center>
          </Button>
        </Copyable>
      </HStack>
      <Collapse startingHeight={0} in={isOpen}>
        <ChakraSyntaxHighlighter
          w="100%"
          h="400px"
          mt={1}
          language="json"
          style={style}
          customStyle={{ resize: 'vertical' }}
        >
          {isOpen ? serializedData : undefined}
        </ChakraSyntaxHighlighter>
      </Collapse>
    </Box>
  );
}

// endregion

interface TransactionApprovalPromptProps {
  payload: TransactionPayload;
}

export function TransactionApprovalPrompt({
  payload,
}: TransactionApprovalPromptProps) {
  const { colorMode } = useColorMode();
  const { approvalRequest } = useApprovalRequestContext();
  const { activeAccountAddress } = useActiveAccount();
  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: simulationRefetchInterval,
    },
  );

  const simulation = useTransactionSimulation(
    ['approvalRequest', approvalRequest.id],
    payload,
    {
      enabled: coinBalance !== undefined,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const { buildRawTransaction, signTransaction, submitTransaction } =
    useTransactions();

  // Keeping error state, since the query error is cleared on re-fetching
  const [simulationError, setSimulationError] = useState<string | undefined>();
  useEffect(() => {
    if (simulation.error) {
      setSimulationError(simulation.error.message);
    } else if (simulation.data?.error !== undefined) {
      setSimulationError(simulation.data.error.description);
    } else if (!simulation.isLoading) {
      setSimulationError(undefined);
    }
  }, [simulation.data, simulation.error, simulation.isLoading]);

  const canApprove = simulation.data !== undefined && simulation.data.success;

  const networkFee =
    simulation.data !== undefined
      ? formatCoin(simulation.data.gasFee * simulation.data.gasUnitPrice, {
          decimals: 8,
        })
      : undefined;

  const isJsonPayload = !(
    payload instanceof TxnBuilderTypes.TransactionPayload
  );
  const isEntryFunctionPayload =
    isJsonPayload && payload.type !== 'multisig_payload';

  const onApprove = async () => {
    const transactionOptions = simulation.isSuccess
      ? {
          gasUnitPrice: simulation.data.gasUnitPrice,
          maxGasAmount: maxGasFeeFromEstimated(Number(simulation.data.gasFee)),
        }
      : undefined;

    try {
      const rawTxn = await buildRawTransaction(payload, transactionOptions);
      const signedTxn = await signTransaction(rawTxn);
      const userTxn = await submitTransaction(signedTxn);
      return { userTxn };
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
        {!simulationError ? (
          <Tile>
            <LoadableContent isLoading={simulation.isLoading}>
              <VStack>
                <DappTransactionDetails payload={payload} />
              </VStack>
            </LoadableContent>
          </Tile>
        ) : null}
        <Tile>
          <LoadableContent isLoading={simulation.isLoading}>
            <VStack spacing="21px" alignItems="stretch">
              {simulationError ? (
                <Box color={secondaryErrorMessageColor[colorMode]}>
                  <Heading {...dappTransactionHeadingProps}>
                    <FormattedMessage defaultMessage="Transaction error" />
                  </Heading>
                  <Text fontSize="sm" lineHeight="20px">
                    {simulationError}
                  </Text>
                </Box>
              ) : null}
              {!simulationError && networkFee !== undefined ? (
                <Box>
                  <Heading {...dappTransactionHeadingProps}>
                    <FormattedMessage defaultMessage="Network Fee" />
                  </Heading>
                  <Text fontSize="sm" lineHeight="20px">
                    {networkFee}
                  </Text>
                </Box>
              ) : null}
              {isEntryFunctionPayload ? (
                <Box>
                  <Heading {...dappTransactionHeadingProps}>Payload</Heading>
                  <Text fontSize="sm" lineHeight="20px">
                    {`Function: ${payload.function}`}
                  </Text>
                  {/* TODO: use ABI to retrieve arguments names */}
                </Box>
              ) : null}
              {!simulationError && simulation.data !== undefined ? (
                <>
                  <RawSection
                    data={simulation.data.rawChanges}
                    title={<FormattedMessage defaultMessage="Raw writeset" />}
                  />
                  <RawSection
                    data={simulation.data.rawEvents}
                    title={<FormattedMessage defaultMessage="Raw events" />}
                  />
                </>
              ) : null}
            </VStack>
          </LoadableContent>
        </Tile>
      </PermissionRequestBody>
      <PermissionRequestFooter
        canApprove={canApprove}
        onApprove={onApprove}
        requiresSigner
      />
    </PermissionRequestLayout>
  );
}

export default TransactionApprovalPrompt;
