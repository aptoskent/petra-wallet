// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import { AptosAccount } from 'aptos';
import { coinClient, faucetClient } from './constants';

/**
 * @param account
 * @param minimumBalance
 * @param debug
 * @returns an array of txns if the account was funded, an empty array if not
 */
export default async function optionallyFundAccount(
  account: AptosAccount,
  minimumBalance: number = 100_000_000,
  debug: boolean = true,
): Promise<string[]> {
  try {
    if (debug) console.log('Validating funds...');
    const funds = await coinClient.checkBalance(account.address());
    if (funds < minimumBalance) {
      if (debug) console.log('Funding account...');
      return await faucetClient.fundAccount(account.address(), minimumBalance);
    }
  } catch {
    if (debug) console.log("Couldn't fund your account.");
  }

  return [];
}
