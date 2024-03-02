// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { MultisigPayload } from '@petra/core/serialization';

import { AptosClient, BCS, HexString, TxnBuilderTypes } from 'aptos';
import getEntryFunctionPayloadInfo, {
  EntryFunctionInfo,
  getEntryFunctionInfo,
} from './entryFunction';

export interface MultisigPayloadInfo {
  entryFunction: EntryFunctionInfo;
  multisigAddress: string;
  type: 'multisig';
}

async function fetchMultisigEntryFunction(
  aptosClient: AptosClient,
  multisigAddress: string,
) {
  const [payloadBytesHex] = await aptosClient.view({
    arguments: [multisigAddress, ''],
    function: '0x1::multisig_account::get_next_transaction_payload',
    type_arguments: [],
  });

  const payloadBytes = new HexString(payloadBytesHex as string).toUint8Array();
  const deserializer = new BCS.Deserializer(payloadBytes);
  const multisigTxnPayload =
    TxnBuilderTypes.MultiSigTransactionPayload.deserialize(deserializer);
  return multisigTxnPayload.transaction_payload;
}

export default async function fetchMultisigPayloadInfo(
  aptosClient: AptosClient,
  payload: MultisigPayload | TxnBuilderTypes.TransactionPayloadMultisig,
): Promise<MultisigPayloadInfo> {
  if (payload instanceof TxnBuilderTypes.TransactionPayloadMultisig) {
    const multisigAddress = payload.value.multisig_address
      .toHexString()
      .toString();
    const entryFunction =
      payload.value.transaction_payload?.transaction_payload ??
      (await fetchMultisigEntryFunction(aptosClient, multisigAddress));

    return {
      entryFunction: getEntryFunctionInfo(entryFunction),
      multisigAddress,
      type: 'multisig',
    };
  }

  const multisigAddress = payload.multisig_address;
  const entryFunction =
    payload.transaction_payload !== undefined
      ? getEntryFunctionPayloadInfo(payload.transaction_payload).value
      : getEntryFunctionInfo(
          await fetchMultisigEntryFunction(aptosClient, multisigAddress),
        );

  return {
    entryFunction,
    multisigAddress,
    type: 'multisig',
  };
}
