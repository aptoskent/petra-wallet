// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HexString } from 'aptos';

import argon2 from 'react-native-argon2';
import { secretbox } from 'tweetnacl';

const argon2KeyDerivationOptions = {
  hashLength: secretbox.keyLength,
  iterations: 5,
  mode: 'argon2i',
};

export default async function argon2DeriveKey(
  password: string,
  salt: Uint8Array,
) {
  const saltStr = HexString.fromUint8Array(salt).toString();
  const { rawHash: encryptionKeyStr } = await argon2(
    password,
    saltStr,
    argon2KeyDerivationOptions,
  );
  return new HexString(encryptionKeyStr).toUint8Array();
}
