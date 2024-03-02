// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Sdk } from '@petra/indexer-client/src/generated/sdk';

/**
 * For reference, this is how the explorer handles the same:
 *
 * - needed as an input: https://github.com/aptos-labs/explorer/blob/76aaf2672bd7a5deb29a8db3884bde44f172052c/src/api/hooks/useGetDelegatedStakeOperationActivities.ts#L35
 * - usage in component: https://github.com/aptos-labs/explorer/blob/76aaf2672bd7a5deb29a8db3884bde44f172052c/src/pages/DelegatoryValidator/MyDepositsSection.tsx#L147
 * - usage of hook: https://github.com/aptos-labs/explorer/blob/76aaf2672bd7a5deb29a8db3884bde44f172052c/src/pages/DelegatoryValidator/MyDepositsSection.tsx#L271
 * - utils helper: https://github.com/aptos-labs/explorer/blob/76aaf2672bd7a5deb29a8db3884bde44f172052c/src/pages/DelegatoryValidator/utils.tsx#L61
 */

type UseStakePrincipalsReturnValue = {
  active: number;
  pendingWithdraw: number;
};

export async function getStakePrincipals({
  delegatorAddress,
  indexerClient,
  validatorOwnerAddress,
}: {
  delegatorAddress: string;
  indexerClient: Sdk;
  validatorOwnerAddress: string;
}): Promise<UseStakePrincipalsReturnValue> {
  try {
    const result = await indexerClient?.getDelegatedStakingRoyalties({
      address: delegatorAddress,
      pool: validatorOwnerAddress,
    });

    const activities = result?.delegated_staking_activities ?? [];

    return activities
      .slice()
      .sort(
        (a, b) => Number(a.transaction_version) - Number(b.transaction_version),
      )
      .reduce(
        (memo, activity) => {
          let { active, pendingWithdraw } = memo;

          const eventType = activity.event_type.split('::')[2];

          const { amount } = activity;

          switch (eventType) {
            case 'AddStakeEvent':
              active += amount;
              break;
            case 'UnlockStakeEvent':
              active -= amount;
              pendingWithdraw += amount;
              break;
            case 'ReactivateStakeEvent':
              active += amount;
              pendingWithdraw -= amount;
              break;
            case 'WithdrawStakeEvent':
              pendingWithdraw -= amount;
              break;
            default:
              // eslint-disable-next-line no-console
              console.log('not found', eventType);
              break;
          }

          return {
            active: Math.max(0, active),
            pendingWithdraw: Math.max(0, pendingWithdraw),
          };
        },
        { active: 0, pendingWithdraw: 0 },
      );
  } catch (e) {
    return {
      active: 0,
      pendingWithdraw: 0,
    };
  }
}

export default getStakePrincipals;
