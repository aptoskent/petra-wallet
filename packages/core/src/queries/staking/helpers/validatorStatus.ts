// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ValidatorStatus } from '../types';
import { FetchView } from '../../useView';

export default async function getValidatorStatus(
  fetchView: FetchView,
  validatorAddress: string,
): Promise<ValidatorStatus> {
  const res = await fetchView(
    [validatorAddress],
    '0x1::stake::get_validator_state',
  );

  switch (Number(res ? res[0] : 0)) {
    case 1:
      return ValidatorStatus.pendingActivity;
    case 2:
      return ValidatorStatus.active;
    case 3:
      return ValidatorStatus.pendingInactive;
    case 4:
      return ValidatorStatus.inactive;
    default:
      return ValidatorStatus.unknown;
  }
}
