// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TransactionPayload } from '@petra/core/serialization';
import { HexString, TxnBuilderTypes } from 'aptos';
import { useMemo } from 'react';

interface FunctionId {
  address: string;
  moduleName: string;
  name: string;
}

export interface EntryFunctionPayloadInfo {
  args: any[];
  functionId: FunctionId;
  type: 'entryFunction';
  typeArgs: string[];
}

export type PayloadInfo = EntryFunctionPayloadInfo;

function getEntryFunctionId(
  entryFunction: TxnBuilderTypes.EntryFunction,
): FunctionId {
  const {
    function_name: { value: name },
    module_name: {
      address: { address: addressBytes },
      name: { value: moduleName },
    },
  } = entryFunction;

  const address = HexString.fromUint8Array(addressBytes).toShortString();

  return {
    address,
    moduleName,
    name,
  };
}

function getTypeTag(typeTag: TxnBuilderTypes.TypeTag): string {
  if (typeTag instanceof TxnBuilderTypes.TypeTagBool) {
    return 'Bool';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagU8) {
    return 'U8';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagU16) {
    return 'U16';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagU32) {
    return 'U32';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagU64) {
    return 'U64';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagU128) {
    return 'U128';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagU256) {
    return 'U256';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagAddress) {
    return 'Address';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagSigner) {
    return 'Signer';
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagVector) {
    const valueType = getTypeTag(typeTag.value);
    return `Vector<${valueType}>`;
  }
  if (typeTag instanceof TxnBuilderTypes.TypeTagStruct) {
    const {
      address: { address: addressBytes },
      module_name: { value: moduleName },
      name: { value: name },
      type_args: typeArgs,
    } = typeTag.value;
    const address = HexString.fromUint8Array(addressBytes).toShortString();
    const structName = `${address}::${moduleName}::${name}`;
    const structTypes = typeArgs.reduce(
      (acc, arg) => `${acc},${getTypeTag(arg)}`,
      '',
    );
    return `${structName}<${structTypes}>`;
  }
  return 'Unknown';
}

export default function usePayloadInfo(
  payload: TransactionPayload | TxnBuilderTypes.MultiAgentRawTransaction,
) {
  const payloadInfo: PayloadInfo | undefined = useMemo(() => {
    if (!(payload instanceof TxnBuilderTypes.TransactionPayload)) {
      if (payload instanceof TxnBuilderTypes.MultiAgentRawTransaction) {
        return undefined;
      }
      if (payload.type !== 'multisig_payload') {
        const [address, moduleName, name] = payload.function.split('::');
        return {
          args: [],
          functionId: {
            address,
            moduleName,
            name,
          },
          type: 'entryFunction',
          typeArgs: [],
        };
      }
      return undefined;
    }
    if (payload instanceof TxnBuilderTypes.TransactionPayloadEntryFunction) {
      const entryFunction = payload.value;
      const typeArgs = entryFunction.ty_args.map((arg) => getTypeTag(arg));
      return {
        args: [],
        functionId: getEntryFunctionId(entryFunction),
        type: 'entryFunction',
        typeArgs,
      };
    }
    throw new Error('Not supported');
  }, [payload]);
  return payloadInfo;
}
