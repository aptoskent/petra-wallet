// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { EntryFunctionPayload } from '@petra/core/serialization';
import { HexString, TxnBuilderTypes } from 'aptos';
import getTypeTag from './getTypeTag';

export interface EntryFunctionId {
  functionName: string;
  moduleAddress: string;
  moduleName: string;
}

export interface EntryFunctionInfo {
  args: any[];
  functionId: EntryFunctionId;
  typeArgs: string[];
}

export interface EntryFunctionPayloadInfo {
  type: 'entryFunction';
  value: EntryFunctionInfo;
}

export function getEntryFunctionInfo(
  entryFunction: TxnBuilderTypes.EntryFunction,
): EntryFunctionInfo {
  const functionId = {
    functionName: entryFunction.function_name.value,
    moduleAddress: HexString.fromUint8Array(
      entryFunction.module_name.address.address,
    ).toShortString(),
    moduleName: entryFunction.module_name.name.value,
  };

  return {
    // TODO: need ABI support
    args: [],
    functionId,
    typeArgs: entryFunction.ty_args.map((typeTag) => getTypeTag(typeTag)),
  };
}

export default function getEntryFunctionPayloadInfo(
  payload:
    | EntryFunctionPayload
    | TxnBuilderTypes.TransactionPayloadEntryFunction,
): EntryFunctionPayloadInfo {
  if (payload instanceof TxnBuilderTypes.TransactionPayloadEntryFunction) {
    return {
      type: 'entryFunction',
      value: getEntryFunctionInfo(payload.value),
    };
  }

  const [moduleAddress, moduleName, functionName] =
    payload.function.split('::');
  const functionId = {
    functionName,
    moduleAddress,
    moduleName,
  };

  const value = {
    args: payload.arguments.map((arg) => JSON.stringify(arg)),
    functionId,
    typeArgs: payload.type_arguments,
  };

  return {
    type: 'entryFunction',
    value,
  };
}
