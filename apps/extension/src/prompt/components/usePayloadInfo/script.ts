// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString, TxnBuilderTypes } from 'aptos';
import getTxnArgument from './getTxnArgument';
import getTypeTag from './getTypeTag';

export interface ScriptPayloadInfo {
  args: string[];
  serializedCode: string;
  type: 'script';
  typeArgs: string[];
}

export default function getScriptPayloadInfo(
  payload: TxnBuilderTypes.TransactionPayloadScript,
): ScriptPayloadInfo {
  const { args, code, ty_args: typeTags } = payload.value;

  const serializedCode = HexString.fromUint8Array(code).toString();

  return {
    args: args.map((arg) => getTxnArgument(arg).toString()),
    serializedCode,
    type: 'script',
    typeArgs: typeTags.map((typeTag) => getTypeTag(typeTag)),
  };
}
