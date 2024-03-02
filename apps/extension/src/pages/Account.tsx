// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Box, Divider, Heading, Spinner, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import GraceHopperBoringAvatar from 'core/components/BoringAvatar';
import Copyable from 'core/components/Copyable';
import ActivityList from 'core/components/ActivityList';
import NextPageLoader from 'core/components/NextPageLoader';
import useActivity from '@petra/core/queries/useActivity';
import WalletLayout from 'core/layouts/WalletLayout';
import { collapseHexString } from '@petra/core/utils/hex';
import { useNameFromAddress } from '@petra/core/queries/useNameAddress';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { isConfirmedActivityItem } from '@petra/core/types/activity';

function Account() {
  const { address } = useParams();
  const { activeAccountAddress } = useActiveAccount();
  const activity = useActivity(activeAccountAddress);

  const name = useNameFromAddress(address);

  const items = useMemo(
    () =>
      activity.data?.pages
        .flatMap((page) => page.items)
        .filter(
          (item) =>
            isConfirmedActivityItem(item) &&
            item.type === 'coinTransfer' &&
            (item.sender === address || item.recipient === address),
        ),
    [activity.data, address],
  );

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Account" />}
      showBackButton
    >
      <VStack width="100%" paddingTop={8} spacing={4}>
        <Box w={20}>
          <GraceHopperBoringAvatar type="beam" />
        </Box>
        <VStack spacing={1} mb={8}>
          <Heading fontSize="lg" fontWeight={500}>
            {name.data ? (
              name.data.toString()
            ) : (
              <Copyable value={address!}>
                {collapseHexString(address!, 12)}
              </Copyable>
            )}
          </Heading>
          {name.isLoading ? <Spinner size="sm" /> : null}
          {name.data ? (
            <Copyable value={address!}>
              {collapseHexString(address!, 12)}
            </Copyable>
          ) : null}
        </VStack>
        <Divider />
        <Heading fontSize="lg">
          <FormattedMessage defaultMessage="Between you" />
        </Heading>
        <ActivityList items={items ?? []} />
        {activity.isLoading || activity.isFetchingNextPage ? <Spinner /> : null}
        <NextPageLoader query={activity} />
      </VStack>
    </WalletLayout>
  );
}

export default Account;
