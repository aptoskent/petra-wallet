// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Avatar, Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';
import { CoinBalanceChange, CoinInfoData } from '@petra/core/types';
import { formatAmount } from '@petra/core/utils/coin';
import useCoinListDict from '@petra/core/hooks/useCoinListDict';
import { DappTransactionDetailAmount } from './DappTransactionDetailsAmount';

interface DappTransactionDetailItemCoinImageProps {
  coinInfo: CoinInfoData;
}

export function DappCoinTransactionDetailItemImage({
  coinInfo,
}: DappTransactionDetailItemCoinImageProps) {
  const { coinListDict } = useCoinListDict();
  const coinMetadata = coinListDict[coinInfo.type];
  return <Avatar size="sm" src={coinMetadata?.logo_url} />;
}

interface DappTransactionDetailCoinItemProps {
  item: CoinBalanceChange;
}

export function DappCoinTransactionDetailItem({
  item,
}: DappTransactionDetailCoinItemProps) {
  if (!item.coinInfo) {
    return null;
  }

  const { decimals, name, symbol, type } = item.coinInfo;

  const formattedAmount = formatAmount(
    item.amount,
    {
      decimals,
      name,
      symbol,
      type,
    },
    { prefix: true },
  );

  return (
    <Grid gap={4} width="100%" templateColumns="30px 1fr 120px">
      <Flex alignItems="center">
        <DappCoinTransactionDetailItemImage coinInfo={item.coinInfo} />
      </Flex>
      <Flex alignItems="center" overflow="hidden">
        <Text fontSize="sm" noOfLines={1} textOverflow="ellipsis" width="100%">
          {item.coinInfo?.name}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <DappTransactionDetailAmount formattedAmount={formattedAmount} />
      </Flex>
    </Grid>
  );
}
