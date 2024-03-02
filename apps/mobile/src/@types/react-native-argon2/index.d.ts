// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

declare module 'react-native-argon2' {
  export interface Argon2Options {
    hashLength?: number;
    iterations?: number;
    mode?: string;
  }

  export interface Argon2Result {
    encodedHash: string;
    rawHash: string;
  }

  export default function argon(
    password: string,
    salt: string,
    options: Argon2Options,
  ): Promise<Argon2Result>;
}
