// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import React from 'react';
import SelectContact from 'core/components/SelectContact';
import useRecentContacts, { Contact } from 'core/hooks/useRecentContacts';
import { useAccountCoinResources } from './hooks/useAccountCoinResources';

type SelectContactProps = RootAuthenticatedStackScreenProps<'SendFlow1'>;

export default function SendSelectContact({ navigation }: SelectContactProps) {
  const { activeAccountAddress } = useActiveAccount();

  const { pushContact } = useRecentContacts();

  const availableCoins = useAccountCoinResources(activeAccountAddress);

  const onContactPress = (contact: Contact) => {
    // skip the select coin screen if a user only has one type of coin
    if (availableCoins.data?.length === 1) {
      navigation.navigate('SendFlow3', {
        coinInfo: availableCoins.data[0].info,
        contact,
      });
    } else {
      navigation.navigate('SendFlow2', { contact });
    }
    // TODO: the update is visible during navigation, maybe wait for the end of navigation
    //  or just push contact after a successful transfer
    pushContact(contact);
  };

  return <SelectContact onContactPress={onContactPress} />;
}
