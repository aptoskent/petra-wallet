// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Types } from 'aptos';

export const delegationPoolOperatorCommissionPercentage =
  '0x1::delegation_pool::operator_commission_percentage' as const;
export const stakeGetValidatorState =
  '0x1::stake::get_validator_state' as const;

interface ViewMap {
  [delegationPoolOperatorCommissionPercentage]: [[Types.Address], [Types.U64]];
  [stakeGetValidatorState]: [[Types.Address], [number]];
}

export type ViewFunction = keyof ViewMap;
export type ViewFunctionArgs<T extends ViewFunction> = ViewMap[T][0];
export type ViewFunctionValue<T extends ViewFunction> = ViewMap[T][1];
export type View = ViewMap[ViewFunction];
