// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  ActiveAccountProvider,
  InitializedAccountsProvider,
  UnlockedAccountsProvider,
  useAccounts,
} from '@petra/core/hooks/useAccounts';

interface GuardsProps {
  appLaunchScreen: JSX.Element;
  appSignIn: JSX.Element;
  appTabsAuthenticated: JSX.Element;
}

export default function Guards({
  appLaunchScreen,
  appSignIn,
  appTabsAuthenticated,
}: GuardsProps) {
  // check for initialized accounts, then unlocked accounts, then active accounts
  const {
    accounts,
    activeAccountAddress,
    encryptedAccounts,
    encryptedStateVersion,
    encryptionKey,
    salt,
  } = useAccounts();

  const areAccountsInitialized = encryptedAccounts && salt;
  const isUnlocked = encryptionKey && accounts;
  const isActiveAccountAvailable =
    accounts && activeAccountAddress && activeAccountAddress in accounts;
  const activeOrFirstAccountAddress =
    accounts &&
    (isActiveAccountAvailable
      ? activeAccountAddress
      : Object.keys(accounts)[0]);
  const hasActiveAccount = !!activeOrFirstAccountAddress;

  // no initialized accounts, show the App Launch Flow - import account or sign up
  // for now if we don't have any accounts, we show the app launch screen
  if (!areAccountsInitialized || activeAccountAddress === undefined) {
    return appLaunchScreen;
  }

  if (!isUnlocked) {
    // if there are initialized accounts, but they are locked, show the login screen
    return (
      <InitializedAccountsProvider
        encryptedAccounts={encryptedAccounts}
        salt={salt}
        encryptedStateVersion={encryptedStateVersion ?? 0}
      >
        {appSignIn}
      </InitializedAccountsProvider>
    );
  }

  // if there are initialized accounts, and they are unlocked, show the landing screen
  if (hasActiveAccount) {
    return (
      <InitializedAccountsProvider
        encryptedAccounts={encryptedAccounts}
        salt={salt}
        encryptedStateVersion={encryptedStateVersion ?? 0}
      >
        <UnlockedAccountsProvider
          accounts={accounts}
          encryptionKey={encryptionKey}
        >
          <ActiveAccountProvider
            activeAccountAddress={activeOrFirstAccountAddress}
          >
            {appTabsAuthenticated}
          </ActiveAccountProvider>
        </UnlockedAccountsProvider>
      </InitializedAccountsProvider>
    );
  }

  return null;
}
