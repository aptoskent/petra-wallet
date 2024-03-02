// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useNetworks } from '@petra/core/hooks/useNetworks';
import { useEffect, useState } from 'react';
import MobilePreferences from '../../util/mobilePreferences';

const recentContactsKey = 'recentContacts';
const maxRecentContacts = 30;

function getStorageKey(chainId: number) {
  return `${recentContactsKey}_${chainId}`;
}

export interface Contact {
  address: string;
  name?: string;
}

export default function useRecentContacts() {
  const [recentContacts, setRecentContacts] = useState<Contact[]>();
  const { aptosClient } = useNetworks();

  // Initialize state on mount
  useEffect(() => {
    setRecentContacts(undefined);
    aptosClient
      .getChainId()
      .then((chainId) => MobilePreferences.getData(getStorageKey(chainId)))
      .then((serialized) => (serialized !== null ? JSON.parse(serialized) : []))
      .catch(() => [])
      .then((contacts) => setRecentContacts(contacts));
  }, [aptosClient]);

  function pushContact(contact: Contact) {
    setRecentContacts((prevContacts) => {
      const newContacts = prevContacts ? [...prevContacts] : [];

      const currIdx = newContacts.findIndex(
        ({ address }) => address === contact.address,
      );
      if (currIdx !== -1) {
        newContacts.splice(currIdx, 1);
      }
      newContacts.unshift(contact);
      if (newContacts.length > maxRecentContacts) {
        newContacts.pop();
      }

      // Update storage with new contacts
      const serializedContacts = JSON.stringify(newContacts);
      void aptosClient
        .getChainId()
        .then((chainId) =>
          MobilePreferences.storeData(
            getStorageKey(chainId),
            serializedContacts,
          ),
        );

      return newContacts;
    });
  }

  return { pushContact, recentContacts };
}
