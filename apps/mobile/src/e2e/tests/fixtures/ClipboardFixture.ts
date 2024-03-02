// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// This seems to not work in browserstack currently
export default class ClipboardFixture {
  static async getValue(type: string = 'Plaintext') {
    const encodedAddress = await driver.getClipboard(type);
    return Buffer.from(encodedAddress, 'base64').toString();
  }
}
