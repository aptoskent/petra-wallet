// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { collapseHexString } from '@petra/core/utils/hex';
import { i18nmock } from 'strings';

export const IS_DEVELOPMENT =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export function throwInDev(errorMsg: string) {
  if (IS_DEVELOPMENT) {
    throw new Error(errorMsg);
  }
}

function addressChars(address: string) {
  return collapseHexString(address, 8, true);
}

// takes an address and turns into xxxx..xxxx or (xxxx..xxxx)
// 0x6014304e1ba8989b6cb91e95274dd5cd6ef0c3b40a8ec55b1d22c22a9a3f15f1 => 0x60..15f1 or (0x60..15f1)
function addressDisplay(address: string, parens: boolean = true) {
  return parens ? `(${addressChars(address)})` : addressChars(address);
}

function accountNameDisplay(
  accountName: string | undefined,
  idx: number,
): string {
  return accountName ?? `${i18nmock('general:account')} ${idx}`;
}

function quantityDisplayApt(quantityDisplay?: string) {
  const quantity = quantityDisplay ?? '';
  if (quantity === '') {
    return '0';
  }
  const splitQuant = quantity.split('.');
  if (splitQuant.length === 1) {
    return splitQuant[0];
  }
  return `${splitQuant[0]}.${splitQuant[1].slice(0, 4)}`;
}

export { accountNameDisplay, addressDisplay, quantityDisplayApt };
