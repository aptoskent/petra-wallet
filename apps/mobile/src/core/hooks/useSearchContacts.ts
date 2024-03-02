// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import useRestApi from '@petra/core/hooks/useRestApi';
import { isAddressValid, isAptosName } from '@petra/core/utils/address';
import { AptosName } from '@petra/core/utils/names';
import { Contact } from 'core/hooks/useRecentContacts';
import { useCallback, useEffect, useRef, useState } from 'react';

const debounceTime = 500;

export default function useSearchContacts(contacts: Contact[] | undefined) {
  const [result, setResult] = useState(contacts ?? []);
  const prevQuery = useRef<string>();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const { getAddressFromName, getNameFromAddress } = useRestApi();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const pendingRequest = useRef<Promise<void>>();

  const updateFilteredRecipients = useCallback(
    async (query: string) => {
      prevQuery.current = query;
      const normalizedQuery = query.toLowerCase();

      // Cancel pending debounced filter
      if (debounceTimer.current !== undefined) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = undefined;
      }

      // Cancel pending request
      if (pendingRequest.current !== undefined) {
        pendingRequest.current = undefined;
        setIsFetching(false);
      }

      if (!normalizedQuery || contacts === undefined) {
        setResult(contacts ?? []);
        return;
      }

      // Don't debounce on exact match
      const exactMatch = contacts.find(
        ({ address, name }) =>
          address.toLowerCase() === normalizedQuery ||
          (name && name.toLowerCase() === normalizedQuery),
      );
      if (exactMatch !== undefined) {
        setResult([exactMatch]);
        return;
      }

      // Don't debounce on full valid address
      if (isAddressValid(query)) {
        setIsFetching(true);
        const request = getNameFromAddress(query)
          .then((name) => {
            const contact: Contact = {
              address: query,
              name: name?.toString(),
            };
            return [contact];
          })
          .then((newResult) => {
            if (request === pendingRequest.current) {
              setIsFetching(false);
              setResult(newResult);
              pendingRequest.current = undefined;
            }
          });
        pendingRequest.current = request;
        return;
      }

      // Don't debounce on full valid aptos name
      if (isAptosName(query)) {
        setIsFetching(true);
        const request = getAddressFromName(new AptosName(query))
          .then((address) => {
            if (address === undefined) {
              return [];
            }
            const contact: Contact = {
              address,
              name: query,
            };
            return [contact];
          })
          .then((newResult) => {
            if (request === pendingRequest.current) {
              setResult(newResult);
              setIsFetching(false);
              pendingRequest.current = undefined;
            }
          });
        pendingRequest.current = request;
        return;
      }

      // Debounce for partial matches
      debounceTimer.current = setTimeout(() => {
        const matches = contacts.filter(
          ({ address, name }) =>
            address.toLowerCase().includes(query) ||
            (name && name.toLowerCase().includes(query)),
        );
        // TODO: when names are cached, re-fetch here to ensure updated names
        setResult(matches);
      }, debounceTime);
    },
    [getAddressFromName, getNameFromAddress, contacts],
  );

  // Update results if the available contacts change
  useEffect(() => {
    void updateFilteredRecipients(prevQuery.current ?? '');
  }, [contacts, updateFilteredRecipients]);

  return {
    isFetching,
    onQueryChange: updateFilteredRecipients,
    result,
  };
}
