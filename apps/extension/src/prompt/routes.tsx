// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { Navigate } from 'react-router-dom';
import React from 'react';

import {
  ActiveAccountGuard,
  InitializedAccountsGuard,
  LockedAccountsGuard,
  UnlockedAccountsGuard,
} from 'core/guards';

import Password from 'pages/Password';
import {
  KeystoneGenerate,
  KeystoneScan,
  NoAccounts,
  PermissionPrompt,
} from './pages';

export const Routes = {
  keystoneGenerate: {
    element: <KeystoneGenerate />,
    path: 'keystone-generate',
  },
  keystoneScan: { element: <KeystoneScan />, path: 'keystone-scan' },
  noAccounts: { element: <NoAccounts />, path: 'no-accounts' },
  request: { element: <PermissionPrompt />, path: 'request' },
  unlock: { element: <Password />, path: 'unlock' },
} as const;

/**
 * Routes definition for the extension prompt.
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
              Routes.request,
              Routes.keystoneGenerate,
              Routes.keystoneScan,
              {
                element: <Navigate to={Routes.request.path} replace />,
                path: '/',
              },
            ],
            element: <ActiveAccountGuard redirectTo={Routes.noAccounts.path} />,
          },
        ],
        element: <UnlockedAccountsGuard redirectTo={Routes.unlock.path} />,
      },
      {
        children: [{ element: <Password />, path: 'unlock' }],
        element: <LockedAccountsGuard redirectTo={Routes.request.path} />,
      },
    ],
    element: <InitializedAccountsGuard redirectTo={Routes.noAccounts.path} />,
  },
  Routes.noAccounts,
];
