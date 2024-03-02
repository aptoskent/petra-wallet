// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { defaultFundAmount } from '@petra/core/constants';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import { useFaucet } from '@petra/core/hooks/useFaucet';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { faucetEvents } from '@petra/core/utils/analytics/events';
import { PillButtonProps } from './PetraPillButton';

interface FaucetProps extends Pick<PillButtonProps, 'containerStyleOverride'> {}

export default function Faucet({ containerStyleOverride }: FaucetProps) {
  const { activeAccountAddress } = useActiveAccount();
  const faucet = useFaucet();
  const { trackEvent } = useTrackEvent();

  const onClick = async () => {
    if (!faucet.canFundAccount) return;

    try {
      await faucet.fundAccount({
        address: activeAccountAddress,
        amount: defaultFundAmount,
      });
      void trackEvent({
        eventType: faucetEvents.RECEIVE_FAUCET,
      });
    } catch {
      void trackEvent({
        eventType: faucetEvents.ERROR_RECEIVE_FAUCET,
      });
    }
  };

  const isFunding = faucet.canFundAccount && faucet.isFunding;

  return (
    <PetraPillButton
      onPress={onClick}
      disabled={isFunding}
      isLoading={isFunding}
      text={i18nmock('assets:faucet')}
      containerStyleOverride={containerStyleOverride}
      buttonDesign={PillButtonDesign.default}
    />
  );
}
