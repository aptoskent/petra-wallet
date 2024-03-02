// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useCoinListDict from '@petra/core/hooks/useCoinListDict';
import { useTokenDataCachedRestApi } from '@petra/core/queries/useTokenData';
import { useTokenMetadata } from '@petra/core/queries/useTokenMetadata';
import { CoinInfoData, OnChainTransaction, TokenData } from '@petra/core/types';
import { formatAmount } from '@petra/core/utils/coin';
import { fixBadAptosUri, getTokenDataId } from '@petra/core/utils/token';
import { parsePersonalTokenBalanceChanges } from '@petra/core/utils/transaction';
import { TokenTypes } from 'aptos';
import LinkImage from 'core/components/LinkImage';
import Typography from 'core/components/Typography';
import commonStyles from 'pages/Explore/components/ApprovalModal/styles';
import CoinIcon from 'pages/Send/components/CoinIcon';
import { CoinInfoWithMetadata } from 'pages/Send/hooks/useAccountCoinResources';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { i18nmock } from 'strings';

const iconSize = 32;

// region TokenIcon

interface TokenIconProps {
  size: number;
  tokenData: TokenData;
}

function TokenIcon({ size, tokenData }: TokenIconProps) {
  const fixedTokenData = {
    ...tokenData,
    metadataUri: fixBadAptosUri(tokenData.metadataUri),
  };
  const metadata = useTokenMetadata(fixedTokenData);

  return metadata.isSuccess ? (
    <LinkImage
      size={size}
      uri={metadata.data.image}
      style={{ borderRadius: Math.round(size / 2) }}
    />
  ) : (
    <ActivityIndicator style={{ height: iconSize, width: iconSize }} />
  );
}

// endregion

// region TokenBalanceChangeRow

interface TokenBalanceChangeRowProps {
  amount: bigint;
  tokenDataId: TokenTypes.TokenDataId;
}

function TokenBalanceChangeRow({
  amount,
  tokenDataId,
}: TokenBalanceChangeRowProps) {
  const tokenData = useTokenDataCachedRestApi(tokenDataId);

  const formattedAmount = formatAmount(amount, undefined, { prefix: true });

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 16,
      }}
    >
      {tokenData.isSuccess ? (
        <TokenIcon size={iconSize} tokenData={tokenData.data} />
      ) : (
        <ActivityIndicator style={{ height: iconSize, width: iconSize }} />
      )}
      <Typography
        weight="600"
        style={{ flexShrink: 1, marginLeft: 8 }}
        numberOfLines={1}
      >
        {tokenDataId.name}
      </Typography>
      <Typography
        color={amount > BigInt(0) ? 'green.500' : 'red.500'}
        style={{
          flexGrow: 1,
          marginLeft: 8,
          overflow: 'hidden',
          textAlign: 'right',
        }}
      >
        {formattedAmount}
      </Typography>
    </View>
  );
}

// endregion

// region CoinBalanceChangeRowProps

interface CoinBalanceChangeRowProps {
  amount: bigint;
  coinInfo: CoinInfoData;
}

function CoinBalanceChangeRow({ amount, coinInfo }: CoinBalanceChangeRowProps) {
  const { coinListDict } = useCoinListDict();
  const { logo_url: logoUrl } = coinListDict[coinInfo.type] ?? {};
  const coinInfoWithMetadata: CoinInfoWithMetadata = {
    ...coinInfo,
    metadata: { logoUrl },
  };

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 16,
      }}
    >
      <CoinIcon size={iconSize} coin={coinInfoWithMetadata} />
      <Typography
        weight="600"
        style={{ flexShrink: 1, marginLeft: 8 }}
        numberOfLines={1}
      >
        {coinInfo.name}
      </Typography>
      <Typography
        color={amount > BigInt(0) ? 'green.500' : 'red.500'}
        style={{
          flexGrow: 1,
          marginLeft: 8,
          overflow: 'hidden',
          textAlign: 'right',
        }}
      >
        {formatAmount(amount, coinInfo)}
      </Typography>
    </View>
  );
}

// endregion

interface BalanceChangesSectionProps {
  transaction: OnChainTransaction;
}

export default function BalanceChangesSection({
  transaction,
}: BalanceChangesSectionProps) {
  const { activeAccountAddress } = useActiveAccount();
  const coinBalanceChanges = Object.values(
    transaction.coinBalanceChanges[activeAccountAddress],
  );

  const tokenBalanceChanges = parsePersonalTokenBalanceChanges({
    activeAccountAddress,
    transaction,
  });

  if (coinBalanceChanges.length === 0 && tokenBalanceChanges.length === 0) {
    return (
      <Typography
        variant="small"
        color="navy.500"
        style={commonStyles.mainCard.text}
      >
        {i18nmock('approvalModal:signTransaction.noCoinChange')}
      </Typography>
    );
  }

  return (
    <>
      {coinBalanceChanges.map(({ amount, coinInfo }) =>
        coinInfo ? (
          <CoinBalanceChangeRow
            key={coinInfo.type}
            amount={amount}
            coinInfo={coinInfo}
          />
        ) : null,
      )}
      {tokenBalanceChanges.map(({ amount, tokenDataId }) => (
        <TokenBalanceChangeRow
          key={getTokenDataId(tokenDataId)}
          amount={amount}
          tokenDataId={tokenDataId}
        />
      ))}
    </>
  );
}
