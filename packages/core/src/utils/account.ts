// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount, HexString } from 'aptos';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { derivePath } from 'ed25519-hd-key';

// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const bip44Coin = 637;

export function generateMnemonic() {
  const mnemonic = bip39.generateMnemonic(wordlist);
  return mnemonic;
}

// We are only looking for the first derivation of the bip44
// In the future we may support importing multiple keys from other wallets
export function getAptosBip44Path(index: number = 0): string {
  return `m/44'/${bip44Coin}'/${index}'/0'/0'`;
}

export async function generateMnemonicObject(mnemonicString: string) {
  if (!bip39.validateMnemonic(mnemonicString, wordlist)) {
    throw new Error('Invalid mnemonic');
  }
  const seed = await bip39.mnemonicToSeed(mnemonicString);
  const derivationPath = getAptosBip44Path();
  const { key } = derivePath(derivationPath, Buffer.from(seed).toString('hex'));
  if (key) {
    return { mnemonic: mnemonicString, seed: key };
  }
  throw new Error('Private key can not be derived');
}

/**
 * Retrieve hex string from Uint8Array.
 * Needed this after a breaking bug in the sdk.
 * @param value byte array to be converted to hex string
 */
function hexStringFromUint8Array(value: Uint8Array) {
  const hexString = Buffer.from(value).toString('hex');
  return new HexString(hexString).hex();
}

/**
 * Utility to extract keys from an AptosAccount.
 * Mainly used during account creation within the wallet
 * @param aptosAccount AptosAccount instance to get keys from
 */
export function keysFromAptosAccount(aptosAccount: AptosAccount) {
  return {
    address: aptosAccount.address().hex(),
    privateKey: hexStringFromUint8Array(
      aptosAccount.signingKey.secretKey.slice(0, 32),
    ),
    publicKey: hexStringFromUint8Array(aptosAccount.signingKey.publicKey),
  };
}

export function normalizeAddress(address: string) {
  const noPrefix = new HexString(address).noPrefix();
  const paddedNoPrefix = noPrefix.padStart(64, '0');
  return `0x${paddedNoPrefix}`;
}
