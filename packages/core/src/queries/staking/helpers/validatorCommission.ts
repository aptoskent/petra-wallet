// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { FetchView } from '../../useView';

export default async function getValidatorCommission(
  fetchView: FetchView,
  validatorAddress: string,
) {
  const res = await fetchView(
    [validatorAddress],
    '0x1::delegation_pool::operator_commission_percentage',
  );
  const commission = Number(res ? res[0] || 0 : 0);
  return commission / 100;
}
