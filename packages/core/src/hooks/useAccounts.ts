// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosAccount, HexString } from 'aptos';
import bs58 from 'bs58';
import constate from 'constate';
import { randomBytes, secretbox } from 'tweetnacl';
import {
  EncryptedState,
  encryptedStateUpdatesToPersistentStateUpdates,
  getTargetEncryptedStateVersion,
  migrateEncryptedState,
  unlockEncryptedState,
} from '../encryptedState';
import { Account, Accounts, EncryptedAccounts } from '../types';
import {
  KeyDerivationAlgorithm,
  deriveEncryptionKey,
  isKeyDerivationAlgorithmSupported,
} from '../utils/keyDerivation';
import { useAppState } from './useAppState';

const saltSize = 16;

const defaultKeyDerivationAlgorithm: KeyDerivationAlgorithm = 'pbkdf2';

function getPreferredKeyDerivationAlgorithm(): KeyDerivationAlgorithm {
  return isKeyDerivationAlgorithmSupported('argon2') ? 'argon2' : 'pbkdf2';
}

/**
 * Hook for initializing the accounts.
 * The accounts state is stored in encrypted format, thus the only possible
 * operation that can be done by default is to initialize it
 */
export const [AccountsProvider, useAccounts] = constate(() => {
  const {
    accounts,
    activeAccountAddress,
    encryptedAccounts,
    encryptedStateVersion,
    encryptionKey,
    salt,
    updatePersistentState,
    updateSessionState,
  } = useAppState();

  /**
   * Initialize the accounts state with a password to encrypt it.
   * @param password the password for encrypting the accounts
   * @param initialAccounts initial accounts
   */
  async function initAccounts(password: string, initialAccounts: Accounts) {
    if (password.length < 1) {
      throw new Error('Password must be at least 1 character');
    }
    // Generate salt and use it to derive encryption key
    const newSalt = randomBytes(saltSize);
    const keyDerivationAlgorithm = getPreferredKeyDerivationAlgorithm();
    const newEncryptionKey = await deriveEncryptionKey(
      keyDerivationAlgorithm,
      password,
      newSalt,
    );

    // Initialize encrypted state
    const plaintext = JSON.stringify(initialAccounts);
    const nonce = randomBytes(secretbox.nonceLength);
    const ciphertext = secretbox(
      Buffer.from(plaintext),
      nonce,
      newEncryptionKey,
    );

    const newEncryptedAccounts = {
      ciphertext: bs58.encode(ciphertext),
      nonce: bs58.encode(nonce),
    };

    // Update and persist state
    const firstAvailableAddress = Object.keys(initialAccounts)[0];
    const firstAvailableAccount = firstAvailableAddress
      ? initialAccounts[firstAvailableAddress]
      : undefined;
    await Promise.all([
      updatePersistentState({
        activeAccountAddress: firstAvailableAccount?.address,
        activeAccountPublicKey: firstAvailableAccount?.publicKey,
        encryptedAccounts: newEncryptedAccounts,
        encryptedStateVersion: getTargetEncryptedStateVersion(),
        keyDerivationAlgorithm,
        salt: bs58.encode(newSalt),
      }),
      updateSessionState({
        accounts: initialAccounts,
        encryptionKey: bs58.encode(newEncryptionKey),
      }),
    ]);
  }

  return {
    accounts,
    activeAccountAddress,
    encryptedAccounts,
    encryptedStateVersion,
    encryptionKey,
    initAccounts,
    salt,
  };
});

export interface UseInitializedAccountsProps {
  encryptedAccounts: EncryptedAccounts;
  encryptedStateVersion: number;
  salt: string;
}

/**
 * Hook for locking/unlocking the accounts state.
 * Requires the accounts state to be initialized with a password.
 */
export const [InitializedAccountsProvider, useInitializedAccounts] = constate(
  ({
    encryptedAccounts,
    encryptedStateVersion,
    salt,
  }: UseInitializedAccountsProps) => {
    const {
      keyDerivationAlgorithm = defaultKeyDerivationAlgorithm,
      updatePersistentState,
      updateSessionState,
    } = useAppState();

    const clearAccounts = async () => {
      await updatePersistentState({
        activeAccountAddress: undefined,
        activeAccountPublicKey: undefined,
        encryptedAccounts: undefined,
        salt: undefined,
      });
      // Note: session needs to be updated after persistent state
      await updateSessionState({
        accounts: undefined,
        encryptionKey: undefined,
      });
    };

    const unlockAccounts = async (password: string) => {
      // Build encrypted state from persistent state
      let encryptedState: EncryptedState = {
        encryptedAccounts: {
          ciphertext: bs58.decode(encryptedAccounts.ciphertext),
          nonce: bs58.decode(encryptedAccounts.nonce),
        },
        keyDerivationAlgorithm,
        salt: bs58.decode(salt),
        version: encryptedStateVersion,
      };

      // region Migrate encrypted state if needed
      const targetEncryptedStateVersion = getTargetEncryptedStateVersion();
      if (encryptedState.version !== targetEncryptedStateVersion) {
        const migrationContext = { ...encryptedState, password };
        const encryptedStateUpdates = await migrateEncryptedState(
          encryptedState.version,
          migrationContext,
          targetEncryptedStateVersion,
        );
        await updatePersistentState({
          ...encryptedStateUpdatesToPersistentStateUpdates(
            encryptedStateUpdates,
          ),
          encryptedStateVersion: targetEncryptedStateVersion,
        });
        encryptedState = { ...encryptedState, ...encryptedStateUpdates };
      }
      // endregion

      // region Unlock updated encrypted state and commit to session state
      const unlockedEncryptedState = await unlockEncryptedState(
        encryptedState,
        password,
      );
      await updateSessionState({
        accounts: unlockedEncryptedState.accounts,
        encryptionKey: bs58.encode(unlockedEncryptedState.encryptionKey),
      });
      // endregion
    };

    const lockAccounts = async () => {
      await updateSessionState({
        accounts: undefined,
        encryptionKey: undefined,
      });
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
      const ciphertext = bs58.decode(encryptedAccounts.ciphertext);
      const nonce = bs58.decode(encryptedAccounts.nonce);
      const encryptionKey = await deriveEncryptionKey(
        keyDerivationAlgorithm,
        oldPassword,
        bs58.decode(salt),
      );

      // Retrieved unencrypted value
      const plaintext = secretbox.open(ciphertext, nonce, encryptionKey)!;

      // incorrect current password
      if (!plaintext) {
        throw new Error('Incorrect current password');
      }

      const decodedPlaintext = Buffer.from(plaintext).toString();
      const newAccounts = JSON.parse(decodedPlaintext) as Accounts;

      // Generate salt and use it to derive encryption key
      const newSalt = randomBytes(saltSize);
      const newKeyDerivationAlgorithm = getPreferredKeyDerivationAlgorithm();
      const newEncryptionKey = await deriveEncryptionKey(
        newKeyDerivationAlgorithm,
        newPassword,
        newSalt,
      );

      // Initialize new encrypted state
      const newPlaintext = JSON.stringify(newAccounts);
      const newNonce = randomBytes(secretbox.nonceLength);
      const newCiphertext = secretbox(
        Buffer.from(newPlaintext),
        newNonce,
        newEncryptionKey,
      );

      const newEncryptedAccounts = {
        ciphertext: bs58.encode(newCiphertext),
        nonce: bs58.encode(newNonce),
      };

      await Promise.all([
        updatePersistentState({
          encryptedAccounts: newEncryptedAccounts,
          keyDerivationAlgorithm: newKeyDerivationAlgorithm,
          salt: bs58.encode(newSalt),
        }),
        updateSessionState({
          encryptionKey: bs58.encode(newEncryptionKey),
        }),
      ]);
    };

    return {
      changePassword,
      clearAccounts,
      encryptedAccounts,
      lockAccounts,
      unlockAccounts,
    };
  },
);

export interface UseUnlockedAccountsProps {
  accounts: Accounts;
  encryptionKey: string;
}

/**
 * Hook for accessing and updating the accounts state.
 * Requires the accounts state to be unlocked
 */
export const [UnlockedAccountsProvider, useUnlockedAccounts] = constate(
  ({ accounts, encryptionKey }: UseUnlockedAccountsProps) => {
    const { activeAccountAddress, updatePersistentState, updateSessionState } =
      useAppState();

    const encryptAccounts = (newAccounts: Accounts) => {
      const plaintext = JSON.stringify(newAccounts);
      const nonce = randomBytes(secretbox.nonceLength);
      const ciphertext = secretbox(
        Buffer.from(plaintext),
        nonce,
        bs58.decode(encryptionKey),
      );
      return {
        ciphertext: bs58.encode(ciphertext),
        nonce: bs58.encode(nonce),
      } as EncryptedAccounts;
    };

    const addAccount = async (account: Account) => {
      if (account.address in accounts) {
        throw new Error('Account already exists in wallet');
      }
      const newAccounts = { ...accounts, [account.address]: account };
      const newEncryptedAccounts = encryptAccounts(newAccounts);

      await updateSessionState({ accounts: newAccounts });
      await updatePersistentState({
        activeAccountAddress: account.address,
        activeAccountPublicKey: account.publicKey,
        encryptedAccounts: newEncryptedAccounts,
      });
    };

    const updateActiveAccount = async (newAccount: Account) => {
      const { address } = newAccount;
      const newAccounts = { ...accounts };
      delete newAccounts[address];
      newAccounts[address] = newAccount;

      const newEncryptedAccounts = encryptAccounts(newAccounts);
      await updatePersistentState({
        activeAccountAddress: newAccount?.address,
        activeAccountPublicKey: newAccount?.publicKey,
        encryptedAccounts: newEncryptedAccounts,
      });

      await Promise.all([updateSessionState({ accounts: newAccounts })]);
    };

    const removeAccounts = async (addressesToBeRemoved: string[]) => {
      let activeAccountWasDeleted: boolean = false;
      const newAccounts = { ...accounts };
      addressesToBeRemoved.forEach((address: string) => {
        if (activeAccountAddress === address) {
          activeAccountWasDeleted = true;
        }
        delete newAccounts[address];
      });

      const newEncryptedAccounts = encryptAccounts(newAccounts);

      // Switch account to first available when deleting the active account
      if (activeAccountWasDeleted) {
        const firstAvailableAddress = Object.keys(newAccounts)[0];
        const firstAvailableAccount =
          firstAvailableAddress !== undefined
            ? newAccounts[firstAvailableAddress]
            : undefined;
        // Note: need to await update to `activeAccountAddress` before `accounts`
        await updatePersistentState({
          activeAccountAddress: firstAvailableAccount?.address,
          activeAccountPublicKey: firstAvailableAccount?.publicKey,
          encryptedAccounts: newEncryptedAccounts,
        });
      } else {
        await updatePersistentState({
          encryptedAccounts: newEncryptedAccounts,
        });
      }

      await updateSessionState({ accounts: newAccounts });
    };

    const renameAccount = async (address: string, newName: string) => {
      if (address in accounts) {
        const newAccounts = { ...accounts };
        newAccounts[address] = { ...newAccounts[address], name: newName };
        const newEncryptedAccounts = encryptAccounts(newAccounts);

        await Promise.all([
          updatePersistentState({ encryptedAccounts: newEncryptedAccounts }),
          updateSessionState({ accounts: newAccounts }),
        ]);
      }
    };

    const switchAccount = async (address: string) => {
      const publicKey = accounts[address]?.publicKey;

      await updatePersistentState({
        activeAccountAddress: publicKey !== undefined ? address : undefined,
        activeAccountPublicKey: publicKey,
      });
    };

    return {
      accounts,
      addAccount,
      removeAccounts,
      renameAccount,
      switchAccount,
      updateActiveAccount,
    };
  },
);

export interface UseActiveAccountProps {
  activeAccountAddress: string;
}

/**
 * Hook for accessing the active account.
 * Requires the accounts state to be unlocked and have at least an account
 */
export const [ActiveAccountProvider, useActiveAccount] = constate(
  ({ activeAccountAddress }: UseActiveAccountProps) => {
    const { accounts } = useUnlockedAccounts();
    const activeAccount: Account = {
      type: 'local',
      ...accounts[activeAccountAddress],
    };

    // TODO: an AptosAccount is required to use the TokenClient.
    //  Remove this once all usages of TokenClient are replaced
    const aptosAccount =
      activeAccount.type === 'local'
        ? new AptosAccount(
            HexString.ensure(activeAccount.privateKey).toUint8Array(),
            activeAccount.address,
          )
        : undefined;

    return {
      activeAccount,
      activeAccountAddress,
      aptosAccount,
    };
  },
);
