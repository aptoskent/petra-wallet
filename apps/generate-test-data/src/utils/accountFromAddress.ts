// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount } from 'aptos';

/**
 * @param address The private key of an account
 * @returns An AptosAccount
 */
export default function accountFromAddress(address: string) {
  const nonHexKey = address.startsWith('0x') ? address.slice(2) : address;
  const encodedKey = Uint8Array.from(Buffer.from(nonHexKey, 'hex'));
  return new AptosAccount(encodedKey);
}
