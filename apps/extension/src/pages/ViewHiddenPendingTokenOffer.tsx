// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import WalletLayout from 'core/layouts/WalletLayout';
import PendingOfferClaimList from 'core/components/PendingOfferClaimList';
import { VStack } from '@chakra-ui/react';

function ViewHiddenPendingTokenOffer() {
  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Hidden offers" />}
      showBackButton
      position="relative"
      showAccountCircle={false}
    >
      <VStack p={4} height="100%">
        <PendingOfferClaimList showHiddenOffers />
      </VStack>
    </WalletLayout>
  );
}

export default ViewHiddenPendingTokenOffer;
