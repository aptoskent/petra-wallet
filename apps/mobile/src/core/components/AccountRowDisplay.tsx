// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { Account } from '@petra/core/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addressDisplay } from 'shared/utils';
import { AccountAvatar } from '.';

export const avatarSize = 48;

// SPDX-License-Identifier: Apache-2.0
interface AccountRowDisplayProps {
  account: Account;
  icon: JSX.Element | null;
  nameDisplay: string;
  onPress: () => void;
}

// Display only component
export default function AccountRowDisplay({
  account,
  icon,
  nameDisplay,
  onPress,
}: AccountRowDisplayProps) {
  return (
    <TouchableOpacity style={styles.accountRow} onPress={onPress}>
      <View style={styles.accountRowLeft}>
        <AccountAvatar accountAddress={account.address} size={avatarSize} />
        <View style={styles.accountInfoContainer}>
          <View style={styles.accountNameTextContainer}>
            <View style={styles.accountNameContainer}>
              <Text style={styles.accountNameText} numberOfLines={1}>
                {nameDisplay}
              </Text>
            </View>
            <View style={styles.accountTextContainer}>
              <Text style={styles.accountText}>
                {addressDisplay(account.address)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.accountRowRight}>{icon}</View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  accountInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 16,
    width: '100%',
  },
  accountNameContainer: {
    maxWidth: '50%',
    minWidth: '10%',
  },
  accountNameText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    marginRight: 10,
  },
  accountNameTextContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  accountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    paddingLeft: 16,
    width: '100%',
  },
  accountRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '90%',
  },
  accountRowRight: {
    flexDirection: 'row',
    paddingRight: 26,
    width: '10%',
  },
  accountText: {
    color: customColors.navy['500'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  accountTextContainer: {
    flex: 2,
  },
});
