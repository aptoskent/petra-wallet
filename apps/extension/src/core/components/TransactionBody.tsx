// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FaRegCheckCircle } from '@react-icons/all-files/fa/FaRegCheckCircle';
import { FaRegTimesCircle } from '@react-icons/all-files/fa/FaRegTimesCircle';
import { MaybeHexString } from 'aptos';
import { useParams } from 'react-router-dom';
import ChakraLink from 'core/components/ChakraLink';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { useTransaction } from '@petra/core/queries/transaction';
import { formatAmount, formatCoin } from '@petra/core/utils/coin';
import { collapseHexString } from '@petra/core/utils/hex';
import { isEntryFunctionPayload } from '@petra/core/types';
import { negativeAmountColor, positiveAmountColor } from '@petra/core/colors';
import Copyable from './Copyable';

interface DetailItemProps {
  children: React.ReactNode;
  label: JSX.Element;
}

function DetailItem({ children, label }: DetailItemProps) {
  return (
    <HStack w="100%" fontSize="md" justify="space-between">
      <Text as="span" fontWeight={700}>
        {label}
      </Text>
      {children}
    </HStack>
  );
}

function toFullDatetime(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-us', {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function TransactionBody() {
  const { activeAccountAddress } = useActiveAccount();
  const { versionOrHash } = useParams();
  const { data: txn } = useTransaction(versionOrHash);
  const getExplorerAddress = useExplorerAddress();
  const explorerAddress = getExplorerAddress(`txn/${versionOrHash}`);

  function clickableAddress(address: MaybeHexString, name?: string) {
    return address === activeAccountAddress ? (
      <Text>
        <FormattedMessage defaultMessage="You" />
      </Text>
    ) : (
      <Badge fontSize="sm" textTransform="none">
        <ChakraLink to={`/accounts/${address}`}>
          {name || collapseHexString(address, 12)}
        </ChakraLink>
      </Badge>
    );
  }

  return (
    <VStack w="100%" paddingTop={8} px={4} alignItems="stretch">
      <Flex alignItems="flex-start" width="100%" pb={4}>
        <Button
          fontSize="md"
          fontWeight={400}
          as="a"
          target="_blank"
          rightIcon={<ExternalLinkIcon />}
          variant="link"
          cursor="pointer"
          href={explorerAddress}
          alignSelf="end"
        >
          <FormattedMessage defaultMessage="View on explorer" />
        </Button>
      </Flex>
      {txn === undefined ? (
        <Center h="100%">
          <Spinner size="xl" />
        </Center>
      ) : null}
      {txn !== undefined && txn.onChain ? (
        <>
          <DetailItem label={<FormattedMessage defaultMessage="Version" />}>
            <Text>{txn.version}</Text>
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="Timestamp" />}>
            <Copyable
              prompt={<FormattedMessage defaultMessage="Copy timestamp" />}
              value={txn.timestamp}
            >
              <Badge fontSize="sm" textTransform="none">
                {toFullDatetime(txn.timestamp)}
              </Badge>
            </Copyable>
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="Status" />}>
            {txn.error ? (
              <Tooltip label={txn.error.description}>
                <Box color="red.400">
                  <FaRegTimesCircle />
                </Box>
              </Tooltip>
            ) : (
              <Tooltip label={<FormattedMessage defaultMessage="Success" />}>
                <Box color="green.400">
                  <FaRegCheckCircle />
                </Box>
              </Tooltip>
            )}
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="Gas used" />}>
            <Text>
              {formatCoin(txn.gasFee * txn.gasUnitPrice, { decimals: 8 })}
            </Text>
          </DetailItem>
          <DetailItem
            label={<FormattedMessage defaultMessage="Gas unit price" />}
          >
            <Text>{txn.gasUnitPrice}</Text>
          </DetailItem>
          <Divider />
        </>
      ) : null}
      {txn !== undefined && txn.type === 'transfer' ? (
        <>
          <DetailItem label={<FormattedMessage defaultMessage="Type" />}>
            <Text>
              <FormattedMessage defaultMessage="Coin transfer" />
            </Text>
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="From" />}>
            {clickableAddress(txn.sender, txn.senderName?.toString())}
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="To" />}>
            {clickableAddress(txn.recipient, txn.recipientName?.toString())}
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="Amount" />}>
            <Text>
              {formatAmount(txn.amount, txn.coinInfo, { prefix: false })}
            </Text>
          </DetailItem>
        </>
      ) : null}
      {txn !== undefined && txn.type === 'mint' ? (
        <>
          <DetailItem label={<FormattedMessage defaultMessage="Type" />}>
            <Text>
              <FormattedMessage defaultMessage="Coin mint" />
            </Text>
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="To" />}>
            {clickableAddress(txn.recipient)}
          </DetailItem>
          <DetailItem label={<FormattedMessage defaultMessage="Amount" />}>
            <Text>
              {formatAmount(txn.amount, txn.coinInfo, { prefix: false })}
            </Text>
          </DetailItem>
        </>
      ) : null}
      {txn !== undefined && txn.onChain && txn.type === 'generic' ? (
        <>
          {isEntryFunctionPayload(txn.payload) ? (
            <DetailItem label={<FormattedMessage defaultMessage="Function" />}>
              <Text>{txn.payload.function.split('::').pop()}</Text>
            </DetailItem>
          ) : null}
          <HStack
            w="100%"
            fontSize="md"
            justify="space-between"
            alignItems="start"
          >
            <Text as="span" fontWeight={700}>
              {' '}
              <FormattedMessage defaultMessage="Balance changes" />{' '}
            </Text>
            <VStack alignItems="end">
              {Object.entries(
                txn.coinBalanceChanges[activeAccountAddress] ?? {},
              ).map(([coinType, { amount, coinInfo }]) => (
                <Text
                  key={coinType}
                  color={amount > 0 ? positiveAmountColor : negativeAmountColor}
                >
                  {formatAmount(amount, coinInfo)}
                </Text>
              ))}
            </VStack>
          </HStack>
        </>
      ) : null}
    </VStack>
  );
}

export default TransactionBody;
