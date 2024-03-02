// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { addressDisplay } from 'shared';
import { Contact } from 'core/hooks/useRecentContacts';
import RowItem from './RowItem';
import { AccountAvatar } from './PetraAvatar';

export interface RecipientsListItemProps {
  contact: Contact;
  onPress: () => void;
}

export default function RecipientsListItem({
  contact: { address, name },
  onPress,
}: RecipientsListItemProps) {
  const collapsedAddress = addressDisplay(address, false);
  const icon = <AccountAvatar accountAddress={address} size={48} />;
  return (
    <RowItem
      onPress={onPress}
      text={name || collapsedAddress}
      subtext={name ? collapsedAddress : undefined}
      icon={icon}
    />
  );
}
