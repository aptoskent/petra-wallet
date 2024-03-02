// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { useAccountResource } from '../../useAccountResources';

export function useGetActiveValidators() {
  const res = useAccountResource('0x1', '0x1::stake::ValidatorSet');

  const {
    active_validators: activeValidators,
    total_voting_power: totalVotingPower = '',
  } = res.data?.data ?? {};

  return useMemo(
    () => ({
      activeValidators: activeValidators?.map((v) => v.addr) ?? [],
      isLoading: res.isLoading,
      totalVotingPower,
    }),
    [activeValidators, totalVotingPower, res.isLoading],
  );
}

export default useGetActiveValidators;
