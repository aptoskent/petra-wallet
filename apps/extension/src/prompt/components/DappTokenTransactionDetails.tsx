// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Avatar, Flex, Grid, Text } from '@chakra-ui/react';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import React, { useMemo } from 'react';
import { TokenBalanceChange, TokenData } from '@petra/core/types';
import { useTokenDataCachedRestApi } from '@petra/core/queries/useTokenData';
import { DappTransactionDetailAmount } from './DappTransactionDetailsAmount';

interface DappTransactionDetailItemImageProps {
  tokenData: TokenData;
}

function DappTokenTransactionDetailItemImage({
  tokenData,
}: DappTransactionDetailItemImageProps) {
  const { data: tokenMetadata } = useTokenMetadata(tokenData);
  return <Avatar size="sm" src={tokenMetadata?.image} />;
}

export interface DappTokenTransactionDetailItemProps {
  item: TokenBalanceChange;
}

export function DappTokenTransactionDetailItem({
  item,
}: DappTokenTransactionDetailItemProps) {
  const { data: tokenData } = useTokenDataCachedRestApi(item.tokenDataId);
  const tokenMetadataImage = useMemo(() => {
    if (tokenData) {
      return <DappTokenTransactionDetailItemImage tokenData={tokenData} />;
    }
    return <Avatar size="sm" />;
  }, [tokenData]);

  return (
    <Grid gap={4} width="100%" templateColumns="30px 1fr 120px">
      <Flex alignItems="center">{tokenMetadataImage}</Flex>
      <Flex alignItems="center" overflow="hidden">
        <Text fontSize="sm" noOfLines={1} textOverflow="ellipsis" width="100%">
          {item.tokenDataId?.name}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <DappTransactionDetailAmount formattedAmount={item.amount.toString()} />
      </Flex>
    </Grid>
  );
}
