// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Center,
  Circle,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import WalletLayout from 'core/layouts/WalletLayout';
import ActivityList from 'core/components/ActivityList';
import NextPageLoader from 'core/components/NextPageLoader';
import useActivity from '@petra/core/queries/useActivity';
import { IoReceiptOutline } from '@react-icons/all-files/io5/IoReceiptOutline';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';

function NoActivity() {
  return (
    <VStack w="62%" spacing={2}>
      <Circle size="57px" color="navy.500" bgColor="#b3b3b31a" mb={4}>
        <IoReceiptOutline size="26px" />
      </Circle>
      <Heading fontSize="xl" color="navy.900">
        <FormattedMessage defaultMessage="No activity yet" />
      </Heading>
      <Text fontSize="md" color="navy.600" textAlign="center">
        <FormattedMessage defaultMessage="All of your transactions and dApp interactions will show up here." />
      </Text>
    </VStack>
  );
}

function Activity() {
  const { activeAccountAddress } = useActiveAccount();
  const activity = useActivity(activeAccountAddress);

  const items = useMemo(
    () => activity.data?.pages.flatMap((page) => page.items),
    [activity.data],
  );

  return (
    <WalletLayout title={<FormattedMessage defaultMessage="Activity" />}>
      {activity.isLoading || activity.isFetchingNextPage ? (
        <Center h="100%">
          <Spinner size="xl" thickness="4px" />
        </Center>
      ) : null}
      {items && items.length === 0 ? (
        <Center h="100%">
          <NoActivity />
        </Center>
      ) : null}
      {items && items.length > 0 ? (
        <Box py={3}>
          <ActivityList items={items} />
          <NextPageLoader query={activity} />
        </Box>
      ) : null}
    </WalletLayout>
  );
}

export default Activity;
