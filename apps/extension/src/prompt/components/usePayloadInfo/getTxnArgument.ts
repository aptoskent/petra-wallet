// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString, TxnBuilderTypes } from 'aptos';

export default function getTxnArgument(
  arg: TxnBuilderTypes.TransactionArgument,
): boolean | number | bigint | string {
  if (arg instanceof TxnBuilderTypes.TransactionArgumentBool) {
    return arg.value;
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentU8) {
    return arg.value;
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentU16) {
    return arg.value;
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentU32) {
    return arg.value;
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentU64) {
    return arg.value;
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentU128) {
    return arg.value;
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentU256) {
    return arg.value;
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentAddress) {
    return HexString.fromUint8Array(arg.value.address).toShortString();
  }
  if (arg instanceof TxnBuilderTypes.TransactionArgumentU8Vector) {
    return HexString.fromUint8Array(arg.value).toShortString();
  }
  return 'Unknown';
}
