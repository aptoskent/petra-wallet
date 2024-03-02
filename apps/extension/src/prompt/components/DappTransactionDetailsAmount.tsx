// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Text } from '@chakra-ui/react';
import { negativeAmountColor, positiveAmountColor } from '@petra/core/colors';

export interface DappTransactionDetailAmountProps {
  formattedAmount: string;
}

export function DappTransactionDetailAmount({
  formattedAmount,
}: DappTransactionDetailAmountProps) {
  const isPositive = !formattedAmount.startsWith('-');
  return (
    <Text
      color={isPositive ? positiveAmountColor : negativeAmountColor}
      textAlign="right"
      fontSize="sm"
      width="100%"
    >
      {formattedAmount.toString()}
    </Text>
  );
}
