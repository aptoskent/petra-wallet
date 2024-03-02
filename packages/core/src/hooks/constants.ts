// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export enum RefetchInterval {
  STANDARD = 10_000,
  LONG = 30_000,
}

export default RefetchInterval;

export const usdcStructType =
  '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T';
export const aptStructType = '0x1::aptos_coin::AptosCoin';

export const defaultSlippage = 0.01;
export const defaultTokenAmount = 0;
