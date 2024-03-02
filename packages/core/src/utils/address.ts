// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export function isAptosName(recipient: string) {
  return recipient.slice(-4) === '.apt';
}

export function isAddressValid(address?: string): address is string {
  if (address?.startsWith('0x')) {
    return address?.length === 66;
  }
  return address?.length === 64;
}

export function formatAddress(address: string) {
  return address && address.startsWith('0x') ? address : `0x${address}`;
}
