// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Divider, Grid, Text, useColorMode, VStack } from '@chakra-ui/react';
import { secondaryTextColor } from '@petra/core/colors';
import { useTransferFlow } from 'core/hooks/useTransferFlow';
import { formatCoin } from '@petra/core/utils/coin';
import { collapseHexString } from '@petra/core/utils/hex';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { aptosCoinStructTag } from '@petra/core/constants';
import Copyable from './Copyable';

function TransferSummaryMaxGasUnits() {
  const { colorMode } = useColorMode();
  const { advancedView, debouncedMaxGasUnitsNumber } = useTransferFlow();
  const amount = formatCoin(debouncedMaxGasUnitsNumber, {
    decimals: 0,
    includeUnit: false,
    paramUnitType: 'OCTA',
    returnUnitType: 'OCTA',
  });

  return (advancedView || debouncedMaxGasUnitsNumber) &&
    debouncedMaxGasUnitsNumber &&
    debouncedMaxGasUnitsNumber > 0 ? (
    <>
      <Text color={secondaryTextColor[colorMode]}>
        <FormattedMessage defaultMessage="Max gas fee" />
      </Text>
      <Text fontWeight={600} w="100%" textAlign="right">
        <FormattedMessage
          defaultMessage="{gasAmount} gas units"
          values={{ gasAmount: amount }}
        />
      </Text>
    </>
  ) : null;
}

function TransferSummaryGasUnitPriceOcta() {
  const { colorMode } = useColorMode();
  const { AVGasUnitPrice, advancedView } = useTransferFlow();
  const amount = formatCoin(AVGasUnitPrice, {
    decimals: 0,
    paramUnitType: 'OCTA',
    returnUnitType: 'OCTA',
  });

  return (advancedView || AVGasUnitPrice) &&
    AVGasUnitPrice &&
    AVGasUnitPrice > 0 ? (
    <>
      <Text color={secondaryTextColor[colorMode]}>
        <FormattedMessage defaultMessage="Gas unit price" />
      </Text>
      <Text fontWeight={600} w="100%" textAlign="right">
        {amount}
      </Text>
    </>
  ) : null;
}

export default function TransferSummary() {
  const { colorMode } = useColorMode();
  const {
    amountBigIntWithDecimals,
    coinStructTag,
    estimatedGasFeeOcta,
    recipientAddress,
    recipientName,
    simulationResultAmountFormatted,
  } = useTransferFlow();
  const collapsedAddress = recipientAddress
    ? collapseHexString(recipientAddress)
    : '';
  const estimatedGasFeeAPTString = formatCoin(estimatedGasFeeOcta, {
    decimals: 8,
  });
  const totalOctas =
    (amountBigIntWithDecimals || 0n) + BigInt(estimatedGasFeeOcta ?? 0);
  const totalOctasString = formatCoin(totalOctas, { decimals: 8 });

  return (
    <VStack fontSize="md" divider={<Divider />} px={4} py={8} pb={24} gap={2}>
      <Grid gap={4} width="100%" templateColumns="80px 1fr">
        <Text color={secondaryTextColor[colorMode]}>
          <FormattedMessage defaultMessage="Recipient" />
        </Text>
        {recipientName !== undefined ? (
          <>
            <Text fontWeight={600} w="100%" textAlign="right">
              {recipientName.toString()}
            </Text>
            <Text color={secondaryTextColor[colorMode]}>
              <FormattedMessage defaultMessage="Address" />
            </Text>
          </>
        ) : null}
        <Text fontWeight={600} w="100%" textAlign="right">
          <Copyable value={recipientAddress}>{collapsedAddress}</Copyable>
        </Text>
      </Grid>
      <VStack width="100%">
        <Grid gap={4} width="100%" templateColumns="120px 1fr">
          <Text color={secondaryTextColor[colorMode]}>
            <FormattedMessage defaultMessage="Amount" />
          </Text>
          <Text fontWeight={600} w="100%" textAlign="right">
            {simulationResultAmountFormatted}
          </Text>
          <Text color={secondaryTextColor[colorMode]}>
            <FormattedMessage defaultMessage="Fee" />
          </Text>
          <Text fontWeight={600} w="100%" textAlign="right">
            {estimatedGasFeeAPTString}
          </Text>
          <TransferSummaryGasUnitPriceOcta />
          <TransferSummaryMaxGasUnits />
        </Grid>
      </VStack>
      <Grid gap={4} width="100%" templateColumns="80px 1fr">
        <Text fontWeight={600} color={secondaryTextColor[colorMode]}>
          <FormattedMessage defaultMessage="Total" />
        </Text>
        <VStack justifyContent="right">
          {coinStructTag === aptosCoinStructTag ? (
            <Text fontWeight={600} w="100%" textAlign="right">
              {totalOctasString}
            </Text>
          ) : (
            <>
              <Text fontWeight={600} w="100%" textAlign="right">
                {simulationResultAmountFormatted}
              </Text>
              <Text fontWeight={600} w="100%" textAlign="right">
                {estimatedGasFeeAPTString}
              </Text>
            </>
          )}
        </VStack>
      </Grid>
    </VStack>
  );
}
