// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Center,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  Tooltip,
  useClipboard,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import WalletLayout from 'core/layouts/WalletLayout';
import SettingsListItem from 'core/components/SettingsListItem';
import { secondaryTextColor } from '@petra/core/colors';
import { CredentialHeaderAndBodyProps } from 'core/components/CredentialsBody';
import AccountView from 'core/components/AccountView';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useSettingsPaths from 'core/hooks/useSettingsPaths';
import packageJson from '../../package.json';

export function CredentialRow({ body, header }: CredentialHeaderAndBodyProps) {
  const { hasCopied, onCopy } = useClipboard(body || '');
  const { colorMode } = useColorMode();
  return (
    <SimpleGrid columns={2} width="100%">
      <Flex alignItems="flex-start">
        <Text fontSize="md" color={secondaryTextColor[colorMode]}>
          {header}
        </Text>
      </Flex>
      <Flex alignItems="flex-end">
        <Tooltip
          label={
            hasCopied ? (
              <FormattedMessage defaultMessage="Copied!" />
            ) : (
              <FormattedMessage defaultMessage="Copy" />
            )
          }
          closeDelay={300}
        >
          <Text fontSize="md" cursor="pointer" noOfLines={1} onClick={onCopy}>
            {body}
          </Text>
        </Tooltip>
      </Flex>
    </SimpleGrid>
  );
}

function Account() {
  const { activeAccount } = useActiveAccount();
  const { activeNetwork } = useNetworks();
  const settingsPaths = useSettingsPaths({ account: activeAccount });

  return (
    <WalletLayout title={<FormattedMessage defaultMessage="Settings" />}>
      <VStack width="100%" paddingTop={4} px={4} pb={4} spacing={2}>
        <AccountView allowEdit shouldSwitchOnClick={false} />
        {settingsPaths.map((items, i) => (
          <VStack w="100%" key={items[0].title}>
            {i > 0 ? <Divider /> : null}
            {items.map((item) => (
              <SettingsListItem
                key={item.title}
                network={activeNetwork}
                {...item}
              />
            ))}
          </VStack>
        ))}
      </VStack>
      <Center>
        <Text fontSize="sm" color="navy.400">
          <FormattedMessage
            defaultMessage="Petra Version: {version}"
            values={{ version: packageJson.version }}
          />
        </Text>
      </Center>
    </WalletLayout>
  );
}

export default Account;
