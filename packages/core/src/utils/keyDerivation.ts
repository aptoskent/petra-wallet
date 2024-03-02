// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export type KeyDerivationAlgorithm = 'pbkdf2' | 'argon2';

export type KeyDerivationFunc = (
  password: string,
  salt: Uint8Array,
) => Promise<Uint8Array>;

const keyDerivationFuncMap: Partial<
  Record<KeyDerivationAlgorithm, KeyDerivationFunc>
> = {};

export function setKeyDerivationImplementation(
  algorithm: KeyDerivationAlgorithm,
  func: KeyDerivationFunc,
) {
  keyDerivationFuncMap[algorithm] = func;
}

export function isKeyDerivationAlgorithmSupported(
  algorithm: KeyDerivationAlgorithm,
) {
  return algorithm in keyDerivationFuncMap;
}

export function deriveEncryptionKey(
  algorithm: KeyDerivationAlgorithm,
  password: string,
  salt: Uint8Array,
) {
  const keyDerivationFunc = keyDerivationFuncMap[algorithm];
  if (!keyDerivationFunc) {
    throw new Error('Unsupported key derivation algorithm');
  }
  return keyDerivationFunc(password, salt);
}
