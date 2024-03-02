// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import pbkdf2 from 'pbkdf2';
import { secretbox } from 'tweetnacl';

const { keyLength } = secretbox;
const iterations = 10000;
const digest = 'sha256';

export default async function pbkdf2DeriveKey(
  password: string,
  salt: Uint8Array,
) {
  return new Promise<Uint8Array>((resolve, reject) => {
    pbkdf2.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      (error, key) => {
        if (error) {
          reject(error);
        } else {
          resolve(key);
        }
      },
    );
  });
}
