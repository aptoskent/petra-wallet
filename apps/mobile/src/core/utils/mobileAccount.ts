// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */
// disable entire file because it's currently junk - re-enable this year or next
// @TODO Remove
import { AptosAccount, HexString } from 'aptos';
import { Buffer } from 'buffer';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { derivePath } from 'ed25519-hd-key';

export interface Mnemonic {
  mnemonic: string;
  seed: Uint8Array;
}

// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const bip44Coin = 637;

export function duplicatesExist(mnemonic: string) {
  const arrayedMnemonic = mnemonic.split(' ');
  const mnemonicSet = new Set();
  for (let i = 0; i < arrayedMnemonic.length; i++) {
    if (mnemonicSet.has(arrayedMnemonic[i])) {
      return true;
    }
    mnemonicSet.add(arrayedMnemonic[i]);
  }
  return false;
}

// eslint-disable-next-line consistent-return
export function generateMnemonic(): string {
  let mnemonic = bip39.generateMnemonic(wordlist);
  while (duplicatesExist(mnemonic)) {
    mnemonic = bip39.generateMnemonic(wordlist);
  }
  return mnemonic;
}

// We are only looking for the first derivation of the bip44
// In the future we may support importing multiple keys from other wallets
function getAptosBip44Path(): string {
  return `m/44'/${bip44Coin}'/0'/0'/0'`;
}

// IDENTICAL BETWEEN THE TWO
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

// export async function getBackgroundCurrentPublicAccount(): Promise<PublicAccount | null> {
//     const { activeAccountAddress: address, activeAccountPublicKey: publicKey } =
//         await PersistentStorage.get([
//             'activeAccountAddress',
//             'activeAccountPublicKey',
//         ]);
//
//     return address !== undefined && publicKey !== undefined
//         ? { address, publicKey }
//         : null;
// }

// export async function getBackgroundAptosAccountState(): Promise<AptosAccountState> {
//     const [{ activeAccountAddress }, { accounts }] = await Promise.all([
//         PersistentStorage.get(['activeAccountAddress']),
//         SessionStorage.get(['accounts']),
//     ]);
//
//     const activeAccount =
//         activeAccountAddress !== undefined && accounts !== undefined
//             ? accounts[activeAccountAddress]
//             : undefined;
//
//     return activeAccount !== undefined
//         ? new AptosAccount(
//             HexString.ensure(activeAccount.privateKey).toUint8Array(),
//             activeAccount.address,
//         )
//         : undefined;
// }
//
// export async function getBackgroundNetwork() {
//     const { activeNetworkName, customNetworks } = await PersistentStorage.get([
//         'activeNetworkName',
//         'customNetworks',
//     ]);
//     const networks = {
//         ...defaultNetworks,
//         ...(customNetworks ?? defaultCustomNetworks),
//     };
//     return networks[activeNetworkName ?? defaultNetworkName];
// }
//
export function normalizeAddress(address: string) {
  const noPrefix = new HexString(address).noPrefix();
  const paddedNoPrefix = noPrefix.padStart(64, '0');
  return `0x${paddedNoPrefix}`;
}
