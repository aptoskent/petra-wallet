// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { customColors } from '@petra/core/colors';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { PlusIconSVG, UserMinusIconSVG } from 'shared/assets/svgs';
import { i18nmock } from 'strings';
import { testProps } from 'e2e/config/testProps';
import { avatarSize } from './AccountRowDisplay';

export default function AddRemoveAccountRow({
  isAddAccount,
  onPress,
}: {
  isAddAccount: boolean;
  onPress: () => void;
}) {
  const textStyle = isAddAccount
    ? styles.addRemoveText
    : [
        styles.addRemoveText,
        {
          color: customColors.error,
          fontFamily: 'WorkSans-Bold',
        },
      ];
  return (
    <TouchableOpacity onPress={onPress} {...testProps('button-add-account')}>
      <View
        style={[
          styles.accountRowAddOrRemove,
          isAddAccount
            ? { justifyContent: 'flex-start', paddingLeft: 16 }
            : { justifyContent: 'center' },
        ]}
      >
        <View
          style={[
            styles.addRemoveIconContainer,
            isAddAccount ? { width: avatarSize } : { width: 24 },
          ]}
        >
          {isAddAccount ? (
            <PlusIconSVG color={customColors.navy['900']} />
          ) : (
            <UserMinusIconSVG color={customColors.error} />
          )}
        </View>
        <Text style={textStyle}>
          {isAddAccount
            ? i18nmock('assets:addAccount')
            : i18nmock('assets:removeAccounts')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  accountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    paddingLeft: 16,
    width: '100%',
  },
  accountRowAddOrRemove: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 80,
    width: '100%',
  },
  addRemoveIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  addRemoveText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    paddingLeft: 16,
  },
});
