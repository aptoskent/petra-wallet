// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BCS, HexString, TxnBuilderTypes } from 'aptos';

export interface SerializedPayloadInfo {
  serializedValue: string;
  type: 'serialized';
}

export default function getSerializedPayloadInfo(
  payload:
    | TxnBuilderTypes.TransactionPayload
    | TxnBuilderTypes.MultiAgentRawTransaction,
) {
  const serializedValueBytes = BCS.bcsToBytes(payload);
  const serializedValue =
    HexString.fromUint8Array(serializedValueBytes).toString();
  return {
    serializedValue,
    type: 'serialized' as const,
  };
}
