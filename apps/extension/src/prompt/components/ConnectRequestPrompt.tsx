// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import { MdCheckCircle } from '@react-icons/all-files/md/MdCheckCircle';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import {
  PermissionRequestBody,
  PermissionRequestFooter,
  PermissionRequestLayout,
} from './PermissionPromptLayout';
import { Tile } from './Tile';

export function ConnectRequestPrompt() {
  const {
    activeAccount: { address, name, publicKey },
  } = useActiveAccount();

  // Return the connected account info on approval
  const onApprove = async () => ({
    account: {
      address,
      name,
      publicKey,
    },
  });

  return (
    <PermissionRequestLayout
      title={<FormattedMessage defaultMessage="Connection request" />}
    >
      <PermissionRequestBody>
        <Tile>
          <Heading size="sm" lineHeight="24px" mb="8px">
            <FormattedMessage defaultMessage="This app would like to:" />
          </Heading>
          <List fontSize="sm" lineHeight="20px" spacing="4px">
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              <FormattedMessage defaultMessage="View your balance and activity" />
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              <FormattedMessage defaultMessage="Request approval for transactions" />
            </ListItem>
          </List>
        </Tile>
      </PermissionRequestBody>
      <PermissionRequestFooter onApprove={onApprove} />
    </PermissionRequestLayout>
  );
}

export default ConnectRequestPrompt;
