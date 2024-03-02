// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from 'react-query';
import { useNetworks } from '../../../hooks/useNetworks';
import { DefaultNetworks } from '../../../types';
import { PetraStakingInfo, ValidatorFromJSONFile } from '../types';
import { useGetActiveValidators } from './useGetActiveValidators';
import { normalizeAddress } from '../../../utils/account';

const VALIDATORS_DATA_URL: Record<DefaultNetworks, string> = {
  [DefaultNetworks.Mainnet]:
    'https://storage.googleapis.com/aptos-mainnet/explorer/validator_stats_v2.json?cache-version=0',
  [DefaultNetworks.Testnet]:
    'https://storage.googleapis.com/aptos-testnet/explorer/validator_stats_v2.json?cache-version=0',
  [DefaultNetworks.Devnet]: '',
  [DefaultNetworks.Localhost]: '',
};

type PartialPetraStakingInfo = Pick<
  PetraStakingInfo,
  'totalVotingPower' | 'validator'
>[];

/**
 * The list of active validators is maintained in a flat JSON file.
 * We need to further refine this list for use for delegation.
 *
 * NOTE: This is a divergence from the explorer implementation.
 * The explorer merges the ValidatorInfo from the set with the JSON file.
 * We don't need any information from the set, so we just need
 * the JSON file with the total_voting_power from the set
 */
export function useGetPartialPetraStakingInfo() {
  const { activeNetworkName } = useNetworks();
  const { totalVotingPower } = useGetActiveValidators();

  return useQuery<PartialPetraStakingInfo>(
    ['use get validators', activeNetworkName, totalVotingPower],
    async () => {
      let validators: ValidatorFromJSONFile[] = [];

      if (
        activeNetworkName === DefaultNetworks.Mainnet ||
        activeNetworkName === DefaultNetworks.Testnet
      ) {
        const response = await fetch(
          VALIDATORS_DATA_URL[activeNetworkName as DefaultNetworks],
        );
        validators = await response.json();
      }

      return validators.map((validator) => ({
        totalVotingPower,
        validator: {
          ...validator,
          operator_address: normalizeAddress(validator.operator_address),
          owner_address: normalizeAddress(validator.owner_address),
        },
      }));
    },
  );
}

export default useGetPartialPetraStakingInfo;
