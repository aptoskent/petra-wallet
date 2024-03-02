// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */
// disable entire file because it's currently junk - re-enable this year or next
// @TODO Remove
import { AptosAccount, AptosClient, HexString, ApiError } from 'aptos';
import { Account, Accounts } from 'core/hooks/types';
import { keysFromAptosAccount, normalizeAddress } from './mobileAccount';

export const lookupOriginalAddress = async (
  aptosClient: AptosClient,
  aptosAccount: AptosAccount,
  mnemonic?: string,
  accountName?: string,
) => {
  // Attempt to look up original address to see
  // if account key has been rotated previously
  const originalAddress: HexString = await aptosClient.lookupOriginalAddress(
    aptosAccount.address(),
  );

  // lookup original address can return an address with the leading 0's trimed
  // We will fix this upstream in the future but for now lets fix it inline
  const originalAddressString = normalizeAddress(
    HexString.ensure(originalAddress).toString(),
  );

  // if account is looked up successfully, it means account key has been rotated
  // therefore update the account derived from private key
  // with the original address
  const newAptosAccount = AptosAccount.fromAptosAccountObject({
    ...aptosAccount.toPrivateKeyObject(),
    address: originalAddressString,
  });

  // pass in mnemonic phrase if account is imported via secret recovery phrase
  const newAccount = mnemonic
    ? {
        mnemonic,
        ...keysFromAptosAccount(newAptosAccount),
      }
    : keysFromAptosAccount(newAptosAccount);

  const newAccountWithName = accountName
    ? { name: accountName, ...newAccount }
    : newAccount;

  return newAccountWithName;
};

interface LookUpAndInitAccountsProps {
  aptosAccount: AptosAccount;
  aptosClient: AptosClient;
  confirmPassword: string;
  initAccounts: (password: string, initialAccounts: Accounts) => Promise<void>;
  mnemonic?: string;
  accountName?: string;
}

export async function lookUpAndInitAccounts({
  aptosAccount,
  aptosClient,
  confirmPassword,
  initAccounts,
  mnemonic,
  accountName,
}: LookUpAndInitAccountsProps) {
  try {
    const newAccount = await lookupOriginalAddress(
      aptosClient,
      aptosAccount,
      mnemonic,
      accountName,
    );

    await initAccounts(confirmPassword, {
      [newAccount.address]: newAccount,
    });
  } catch (err) {
    // if account failed to be looked up then account key has not been rotated
    // therefore add the account derived from private key or mnemonic string
    // errorCode 'table_item_not_found' means address cannot be found in the table
    if (err instanceof ApiError && err.errorCode === 'table_item_not_found') {
      // eslint-disable-next-line no-console
      console.error(
        'failed to fetch rotated key for address ',
        aptosAccount.address(),
      );

      const newAccount = mnemonic
        ? {
            mnemonic,
            ...keysFromAptosAccount(aptosAccount),
          }
        : keysFromAptosAccount(aptosAccount);

      const newAccountWithName = accountName
        ? { name: accountName, ...newAccount }
        : newAccount;

      await initAccounts(confirmPassword, {
        [newAccount.address]: newAccountWithName,
      });
    } else {
      // throw err here so we can catch it later in Import Account flow
      // and raise error toast/trigger analytic event
      throw err;
    }
  }
}

interface LookUpAndAddAccountProps {
  accountName?: string;
  addAccount: (account: Account) => Promise<void>;
  aptosAccount: AptosAccount;
  aptosClient: AptosClient;
  mnemonic?: string;
}

// look up account on chain to determine if account has rotated private key
// 1. if account has private key rotated,
// update the derived account with the original account address before adding the acocunt
// 2. otherwise, simply add the derived account
export async function lookUpAndAddAccount({
  accountName,
  addAccount,
  aptosAccount,
  aptosClient,
  mnemonic,
}: LookUpAndAddAccountProps) {
  // Look up original address if account key has been rotated previously
  try {
    const newAccount = await lookupOriginalAddress(
      aptosClient,
      aptosAccount,
      mnemonic,
      accountName,
    );

    await addAccount(newAccount);
  } catch (err) {
    // if account failed to be looked up then account key has not been rotated
    // therefore add the account derived from private key or mnemonic string
    // errorCode 'table_item_not_found' means address cannot be found in the table
    if (err instanceof ApiError && err.errorCode === 'table_item_not_found') {
      // eslint-disable-next-line no-console
      console.error(
        'failed to fetch rotated key for address ',
        aptosAccount.address(),
      );

      const newAccount = mnemonic
        ? {
            mnemonic,
            ...keysFromAptosAccount(aptosAccount),
          }
        : keysFromAptosAccount(aptosAccount);

      const newAccountWithName = accountName
        ? { name: accountName, ...newAccount }
        : newAccount;

      await addAccount(newAccountWithName);
    } else {
      // throw err here so we can catch it later in Import Account component
      // and raise error toast/trigger analytic event
      throw err;
    }
  }
}

export default {
  lookUpAndAddAccount,
  lookUpAndInitAccounts,
  lookupOriginalAddress,
};
