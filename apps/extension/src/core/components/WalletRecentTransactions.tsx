// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  Heading,
  Spinner,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { secondaryTextColor } from '@petra/core/colors';
import ChakraLink from 'core/components/ChakraLink';
import useActivity from '@petra/core/queries/useActivity';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { ActivityList } from './ActivityList';
import { Routes } from '../routes';

const maxActivityItems = 5;

export default function WalletRecentTransactions() {
  const { colorMode } = useColorMode();
  const { activeAccountAddress } = useActiveAccount();
  const activity = useActivity(activeAccountAddress);
  const items = useMemo(() => activity.data?.pages[0]?.items, [activity.data]);

  const hasActivity = items !== undefined && items.length > 0;
  if (!hasActivity) {
    return null;
  }

  const hasMore = items.length > maxActivityItems || activity.hasNextPage;

  return (
    <VStack spacing={2} alignItems="stretch">
      <Heading
        px={4}
        py={2}
        fontSize="md"
        color={secondaryTextColor[colorMode]}
      >
        <FormattedMessage defaultMessage="RECENT ACTIVITY" />
      </Heading>
      {activity.isLoading ? (
        <Spinner />
      ) : (
        <ActivityList items={items.slice(0, maxActivityItems)} />
      )}
      {hasMore ? (
        <ChakraLink to={Routes.activity.path}>
          <Button w="100%" variant="unstyled" color="green.500">
            <FormattedMessage defaultMessage="View all activity" />
          </Button>
        </ChakraLink>
      ) : null}
    </VStack>
  );
}
