// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Navigate } from 'react-router-dom';
import Account from 'pages/Account';
import Activity from 'pages/Activity';
import CreateWallet from 'pages/CreateWallet';
import SecurityPrivacy from 'pages/SecurityPrivacy';
import Gallery from 'pages/Gallery';
import Help from 'pages/Help';
import Network from 'pages/Network';
import Password from 'pages/Password';
import Settings from 'pages/Settings';
import SwitchAccount from 'pages/SwitchAccount';
import Token from 'pages/Token';
import Wallet from 'pages/Wallet';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Transaction from 'pages/Transaction';
import NoWallet from 'pages/NoWallet';
import AddAccount from 'pages/AddAccount';
import ImportAccountMnemonic from 'pages/ImportAccountMnemonic';
import ImportAccountPrivateKey from 'pages/ImportAccountPrivateKey';
import CreateAccount from 'pages/CreateAccount';
import AddNetwork from 'pages/AddNetwork';
import RenameAccount from 'pages/RenameAccount';
import CreateWalletViaImportAccount from 'pages/CreateWalletViaImportAccount';
import Stake from 'pages/Stake';
import ChangePassword from 'pages/ChangePassword';
import ConnectedApps from 'pages/ConnectedApps';
import AutoLockTimer from 'pages/AutoLockTimer';
import ManageAssets from 'pages/ManageAssets';
import Welcome from 'pages/Welcome';
import Reauthenticate from 'pages/Reauthenticate';
import RemoveAccount from 'pages/RemoveAccount';
import ManageAccount from 'pages/ManageAccount';
import DirectTransferTokenSettings from 'pages/DirectTransferTokenSettings';
import ReviewTokenAcceptOffer from 'pages/ReviewTokenAcceptOffer';
import ReviewTokenCancelOffer from 'pages/ReviewTokenCancelOffer';
import ManageAccountShowPrivateKey from 'pages/ManageAccountShowPrivateKey';
import ManageAccountShowRecoveryPhrase from 'pages/ManageAccountShowRecoveryPhrase';
import RotateKeyOnboarding from 'pages/RotateKeyOnboarding';
import ViewHiddenPendingTokenOffer from 'pages/ViewHiddenPendingTokenOffer';
import RotateKey from 'pages/RotateKey';
import AddCustomCoin from 'pages/AddCustomCoin';
import Buy from 'pages/Buy';
import StakingList from 'pages/StakingList';
import {
  ActiveAccountGuard,
  InitializedAccountsGuard,
  LockedAccountsGuard,
  UnlockedAccountsGuard,
} from './guards';

// TODO: have a single representation for routes

export const Routes = Object.freeze({
  account: {
    element: <Account />,
    path: '/accounts/:address',
  },
  activity: {
    element: <Activity />,
    path: '/activity',
  },
  addAccount: {
    element: <AddAccount />,
    path: '/add-account',
  },
  addCustomCoin: {
    element: <AddCustomCoin />,
    path: '/add-custom-coin',
  },
  addNetwork: {
    element: <AddNetwork />,
    path: '/settings/add-network',
  },
  autolock_timer: {
    element: <AutoLockTimer />,
    path: '/settings/security_privacy/autolock_timer',
  },
  buy: {
    element: <Buy />,
    path: '/buy',
  },
  change_password: {
    element: <ChangePassword />,
    path: '/settings/security_privacy/change_password',
  },
  connected_apps: {
    element: <ConnectedApps />,
    path: '/settings/security_privacy/connected_apps',
  },
  createAccount: {
    element: <CreateAccount />,
    path: '/create-account',
  },
  createWallet: {
    element: <CreateWallet />,
    path: '/create-wallet',
  },
  createWalletViaImportAccount: {
    element: <CreateWalletViaImportAccount />,
    path: '/create-wallet/import-account',
  },
  gallery: {
    element: <Gallery />,
    path: '/gallery',
  },
  help: {
    element: <Help />,
    path: '/help',
  },
  importWalletMnemonic: {
    element: <ImportAccountMnemonic />,
    path: '/import/mnemonic',
  },
  importWalletPrivateKey: {
    element: <ImportAccountPrivateKey />,
    path: '/import/private-key',
  },
  login: {
    element: <NoWallet />,
    path: '/',
  },
  manage_account: {
    element: (
      <Reauthenticate
        title={<FormattedMessage defaultMessage="Manage Account" />}
      >
        <ManageAccount />
      </Reauthenticate>
    ),
    path: '/manage-account',
  },
  manage_account_show_private_key: {
    element: (
      <Reauthenticate
        title={<FormattedMessage defaultMessage="Show Private Key" />}
      >
        <ManageAccountShowPrivateKey />
      </Reauthenticate>
    ),
    path: '/show_private_key',
  },
  manage_account_show_recovery_phrase: {
    element: (
      <Reauthenticate
        title={
          <FormattedMessage defaultMessage="Show Secret Recovery Phrase" />
        }
      >
        <ManageAccountShowRecoveryPhrase />
      </Reauthenticate>
    ),
    path: '/show_recovery_phrase',
  },
  manage_assets: {
    element: <ManageAssets />,
    path: '/manage-assets',
  },
  network: {
    element: <Network />,
    path: '/settings/network',
  },
  noWallet: {
    element: <NoWallet />,
    path: '/no-wallet',
  },
  password: {
    element: <Password />,
    path: '/password',
  },
  receiving_nfts: {
    element: <DirectTransferTokenSettings />,
    path: '/receiving-nfts',
  },
  remove_account: {
    element: (
      <Reauthenticate
        title={<FormattedMessage defaultMessage="Remove account" />}
      >
        <RemoveAccount />
      </Reauthenticate>
    ),
    path: '/remove-account',
  },
  rename_account: {
    element: <RenameAccount />,
    path: '/settings/rename_account',
  },
  review_token_accept_offer: {
    element: <ReviewTokenAcceptOffer />,
    path: '/gallery/review-accept-offer',
  },
  review_token_cancel_offer: {
    element: <ReviewTokenCancelOffer />,
    path: '/gallery/review-cancel-offer',
  },
  rotate_key_main: {
    element: (
      <Reauthenticate title={<FormattedMessage defaultMessage="Rotate Key" />}>
        <RotateKey />
      </Reauthenticate>
    ),
    path: '/rotate-key/main',
  },
  rotate_key_onboarding: {
    element: <RotateKeyOnboarding />,
    path: '/rotate-key/onboarding',
  },
  security_privacy: {
    element: <SecurityPrivacy />,
    path: '/settings/security_privacy',
  },
  settings: {
    element: <Settings />,
    path: '/settings',
  },
  stake: {
    element: <Stake />,
    path: '/stake',
  },
  stakingList: {
    element: <StakingList />,
    path: '/staking',
  },
  switchAccount: {
    element: <SwitchAccount />,
    path: '/switch-account',
  },
  token: {
    element: <Token />,
    path: '/tokens/:id',
  },
  transaction: {
    element: <Transaction />,
    path: '/transactions/:versionOrHash',
  },
  view_hidden_pending_token_offer: {
    element: <ViewHiddenPendingTokenOffer />,
    path: '/gallery/view-hidden-pending-token-offer',
  },
  wallet: {
    element: <Wallet />,
    path: '/wallet',
  },
  welcome: {
    element: <Welcome />,
    path: '/welcome',
  },
} as const);

export type RoutePath = (typeof Routes)[keyof typeof Routes]['path'];
export default Routes;

export const noInitializedAccountRoutes = [
  Routes.noWallet,
  Routes.createWallet,
  Routes.createWalletViaImportAccount,
];

export const noInitializedAccountRoutePathDict = Object.fromEntries(
  noInitializedAccountRoutes.map((value) => [value.path, true]),
);

/**
 * Routes definition for the extension app.
 * At routing time, the router will go through the routes and stop at the first match.
 * Once a match is found, the full tree of components will be rendered.
 *
 * The guard+provider pattern ensures that a specific condition is verified
 * before rendering its children. When the condition is verified,
 * the resolved state is provided to the children which can use it freely without unwrapping,
 * otherwise an appropriate redirect is triggered
 */
export const routes = [
  {
    children: [
      {
        children: [
          {
            children: [
              Routes.autolock_timer,
              Routes.addCustomCoin,
              Routes.wallet,
              Routes.gallery,
              Routes.token,
              Routes.activity,
              Routes.transaction,
              Routes.remove_account,
              Routes.account,
              Routes.receiving_nfts,
              Routes.rotate_key_main,
              Routes.rotate_key_onboarding,
              Routes.manage_assets,
              Routes.manage_account_show_recovery_phrase,
              Routes.manage_account_show_private_key,
              Routes.review_token_accept_offer,
              Routes.review_token_cancel_offer,
              Routes.settings,
              Routes.switchAccount,
              Routes.change_password,
              Routes.connected_apps,
              Routes.rename_account,
              Routes.network,
              Routes.addNetwork,
              Routes.manage_account,
              Routes.security_privacy,
              Routes.help,
              Routes.stake,
              Routes.stakingList,
              Routes.view_hidden_pending_token_offer,
              Routes.welcome,
              Routes.buy,
              {
                element: <Navigate to={Routes.wallet.path} replace />,
                path: '/',
              },
            ],
            element: <ActiveAccountGuard />,
          },
          Routes.addAccount,
          Routes.createAccount,
          Routes.importWalletMnemonic,
          Routes.importWalletPrivateKey,
        ],
        element: <UnlockedAccountsGuard />,
      },
      {
        children: [Routes.password],
        element: <LockedAccountsGuard />,
      },
    ],
    element: <InitializedAccountsGuard />,
  },
  ...noInitializedAccountRoutes,
];
