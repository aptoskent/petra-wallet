// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BaseKeyring, InteractionProvider } from '@keystonehq/aptos-keyring';
import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry';
import { AptosSignature } from '@keystonehq/bc-ur-registry-aptos';
import { KeystoneAccount } from '@petra/core/types';
import { HexString, TxnBuilderTypes } from 'aptos';
import { sendKeystoneRequest } from './api';

const keystoneDevice = 'Petra Extension';
const keystoneKeyring = 'Keystone';

const aptosInteractionProvider: InteractionProvider = {
  async readCryptoMultiAccounts() {
    return CryptoMultiAccounts.fromCBOR(Buffer.alloc(0));
  },

  async requestSignature(aptosSignRequest) {
    const response = await sendKeystoneRequest(aptosSignRequest.toUR());
    return AptosSignature.fromCBOR(response.cbor);
  },
};

function publicKeyToAddress(publicKeyBytes: Uint8Array) {
  const publicKey = new TxnBuilderTypes.Ed25519PublicKey(publicKeyBytes);
  const authKey =
    TxnBuilderTypes.AuthenticationKey.fromEd25519PublicKey(publicKey);
  return authKey.derivedAddress();
}

export default class AptosKeyring extends BaseKeyring {
  syncKeyring(data: CryptoMultiAccounts) {
    super.syncKeyring(data);
    this.device = keystoneDevice;
    this.name = keystoneKeyring;
  }

  static fromAccount({ hdPath, index, publicKey, xfp }: KeystoneAccount) {
    const keyring = new AptosKeyring();
    keyring.syncKeyringData({
      device: keystoneDevice,
      keys: [{ hdPath, index, pubKey: publicKey }],
      name: keystoneKeyring,
      xfp,
    });
    return keyring;
  }

  get accounts() {
    return this.keys.map(({ hdPath, index, pubKey }) => {
      const publicKey = new HexString(pubKey);
      const publicKeyBytes = publicKey.toUint8Array();
      const address = publicKeyToAddress(publicKeyBytes).toString();
      const account: KeystoneAccount = {
        address,
        device: keystoneDevice,
        hdPath,
        index,
        publicKey: publicKey.toString(),
        type: 'keystone',
        xfp: this.xfp,
      };
      return account;
    });
  }

  getInteraction = () => aptosInteractionProvider;
}
