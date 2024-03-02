// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { VStack } from '@chakra-ui/react';
import WalletLayout from 'core/layouts/WalletLayout';
import NetworkBody from 'core/components/NetworkBody';

function Network() {
  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Network" />}
      hasWalletFooter={false}
      showBackButton
    >
      <VStack width="100%" paddingTop={4} height="100%">
        <NetworkBody />
      </VStack>
    </WalletLayout>
  );
}

export default Network;
