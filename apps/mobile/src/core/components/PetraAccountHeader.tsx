// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { APTOS_UNIT, OCTA_UNIT, formatCoin } from '@petra/core/utils/coin';
import { collapseHexString } from '@petra/core/utils/hex';
import { testProps } from 'e2e/config/testProps';
import React, { useMemo } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HIT_SLOPS } from 'shared';
import { CopyIcon16SVG } from 'shared/assets/svgs/copy_icon';
import { AccountAvatar } from '.';

interface HeaderProps {
  accountAddress: string;
  accountName: string;
  onPressAccountAddress: (event: GestureResponderEvent) => void;
}

function PetraAccountHeader({
  accountAddress,
  accountName,
  onPressAccountAddress,
}: HeaderProps): JSX.Element {
  const { activeAccountAddress } = useActiveAccount();

  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: 30000,
    },
  );

  const coinBalanceString = useMemo(
    () =>
      formatCoin(coinBalance, {
        includeUnit: false,
        paramUnitType: OCTA_UNIT,
        returnUnitType: APTOS_UNIT,
      }),
    [coinBalance],
  );

  return (
    <View style={styles.container}>
      <AccountAvatar accountAddress={accountAddress} size={64} />
      <Text style={styles.accountNameText}>{accountName}</Text>
      <TouchableOpacity
        onPress={onPressAccountAddress}
        hitSlop={HIT_SLOPS.smallSlop}
      >
        <View style={styles.addressContainer}>
          <Text style={styles.addressText} {...testProps('settings-address')}>
            {collapseHexString(accountAddress)}
          </Text>
          <CopyIcon16SVG color={customColors.navy['600']} />
        </View>
      </TouchableOpacity>
      <View>
        <Text style={styles.balanceText}>
          {`${coinBalanceString} ${APTOS_UNIT}`}
        </Text>
      </View>
    </View>
  );
}

export default PetraAccountHeader;

const styles = StyleSheet.create({
  accountNameText: {
    color: customColors.black,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  addressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  addressText: {
    color: customColors.navy['600'],
    fontSize: 20,
    fontWeight: '500',
    marginRight: 4,
    marginTop: 4,
  },
  balanceText: {
    color: customColors.navy['600'],
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    marginRight: 4,
    marginTop: 4,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    padding: 16,
    width: '100%',
  },
});
