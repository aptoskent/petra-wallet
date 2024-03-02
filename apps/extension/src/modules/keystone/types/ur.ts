// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { RegistryItem } from '@keystonehq/bc-ur-registry-aptos';
import { URType } from '@keystonehq/animated-qr';

export type UR = ReturnType<RegistryItem['toUR']>;
export type AptosURType = 'aptos-signature' | URType.CRYPTO_MULTI_ACCOUNTS;

export interface SerializedUR {
  cbor: string;
  type: string;
}

export function serializeUR({ cbor, type }: UR): SerializedUR {
  return {
    cbor: cbor.toString('hex'),
    type,
  };
}

export function deserializeUR({ cbor, type }: SerializedUR): UR {
  return {
    cbor: Buffer.from(cbor, 'hex'),
    type,
  } as UR;
}
