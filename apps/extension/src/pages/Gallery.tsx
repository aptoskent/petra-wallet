// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import WalletLayout from 'core/layouts/WalletLayout';
import { useAccountTokens } from '@petra/core/queries/useTokens';
import useTokenPendingOfferClaims from '@petra/core/queries/useTokenPendingOfferClaims';
import CollectedTokens from 'core/components/CollectedTokens';
import PendingOfferClaimList from 'core/components/PendingOfferClaimList';
import { textColorPrimary } from '@petra/core/colors';

export default function Gallery() {
  const { activeAccountAddress } = useActiveAccount();
  const { colorMode } = useColorMode();
  const pendingClaims = useTokenPendingOfferClaims(
    activeAccountAddress,
    undefined,
    {
      refetchInterval: 5000,
    },
  );
  const tokens = useAccountTokens(activeAccountAddress, {
    refetchInterval: 2500,
  });

  const allTokens = tokens?.data?.pages.flatMap((page) => page.items) || [];
  const pendingTokens =
    pendingClaims?.data?.pages.flatMap((page) =>
      page.items.map((token) => token),
    ) || [];
  const totalPendingTokens = pendingTokens.length;

  return (
    <WalletLayout title={<FormattedMessage defaultMessage="Collectibles" />}>
      <Tabs
        width="100%"
        height="100%"
        display="flex"
        flexDir="column"
        colorScheme="salmon"
      >
        <TabList textColor={textColorPrimary[colorMode]}>
          <Tab
            fontWeight="700"
            width="100%"
            aria-label="collected-tab"
            onClick={async () => {
              // refetch the list of nft when clicking on Collected Tab
              await tokens.refetch();
            }}
          >
            Collected {tokens.isSuccess && `(${allTokens.length})`}
          </Tab>
          <Tab fontWeight="700" width="100%" aria-label="pending-tab">
            Pending {pendingClaims.isSuccess && `(${totalPendingTokens})`}
          </Tab>
        </TabList>
        <TabPanels flexGrow={1}>
          <TabPanel height="100%">
            <CollectedTokens />
          </TabPanel>
          <TabPanel height="100%">
            <PendingOfferClaimList showViewHiddenOffer />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </WalletLayout>
  );
}
