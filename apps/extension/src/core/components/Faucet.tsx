// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaucet } from '@fortawesome/free-solid-svg-icons/faFaucet';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useFundAccount from '@petra/core/hooks/useFaucet';
import { aptosCoinStructTag, defaultFundAmount } from '@petra/core/constants';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { faucetOnErrorToast } from 'core/components/Toast';
import { useAnalytics } from 'core/hooks/useAnalytics';
import { faucetEvents } from '@petra/core/utils/analytics/events';

export default function Faucet() {
  const { activeAccountAddress } = useActiveAccount();
  const { activeNetwork } = useNetworks();
  const { trackEvent } = useAnalytics();
  const faucet = useFundAccount();

  const onClick = async () => {
    try {
      if (!faucet.canFundAccount) return;

      await faucet.fundAccount({
        address: activeAccountAddress,
        amount: defaultFundAmount,
      });

      trackEvent({
        eventType: faucetEvents.RECEIVE_FAUCET,
        params: {
          amount: defaultFundAmount.toString(),
          coinType: aptosCoinStructTag,
        },
      });
    } catch (e: any) {
      trackEvent({
        eventType: faucetEvents.ERROR_RECEIVE_FAUCET,
        params: {
          amount: defaultFundAmount.toString(),
          coinType: aptosCoinStructTag,
        },
      });

      faucetOnErrorToast(activeNetwork, e?.body);
    }
  };

  const isFunding = faucet.canFundAccount && faucet.isFunding;

  return (
    <Button
      isLoading={isFunding}
      leftIcon={<FontAwesomeIcon icon={faFaucet} />}
      onClick={onClick}
      isDisabled={isFunding}
      width="100%"
      backgroundColor="whiteAlpha.200"
      _hover={{
        backgroundColor: 'whiteAlpha.300',
      }}
      _active={{
        backgroundColor: 'whiteAlpha.400',
      }}
      color="white"
      variant="solid"
    >
      <FormattedMessage defaultMessage="Faucet" />
    </Button>
  );
}
