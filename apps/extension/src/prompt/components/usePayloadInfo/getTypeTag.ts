// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString, TxnBuilderTypes } from 'aptos';

export default function getTypeTag(typeTag: TxnBuilderTypes.TypeTag): string {
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
    if (typeArgs.length === 0) {
      return structName;
    }

    const structTypes = typeArgs.reduce(
      (acc, arg) => `${acc},${getTypeTag(arg)}`,
      '',
    );
    return `${structName}<${structTypes}>`;
  }
  return 'Unknown';
}
