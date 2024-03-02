// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  InitializedAccountsGuard,
  LockedAccountsGuard,
  UnlockedAccountsGuard,
} from 'core/guards';
import Ledger from './pages/Ledger';
import LedgerPairDevice from './pages/LedgerPairDevice';
import LedgerAccountAdded from './pages/LedgerAccountAdded';
import LedgerSelectAddress from './pages/LedgerSelectAddress';

import Unlock from './pages/Unlock';
import KeystoneScanQR from './pages/KeystoneScanQR';
import KeystoneSyncDevice from './pages/KeystoneSyncDevice';
import KeystoneImportSuccess from './pages/KeystoneImportSuccess';
import Keystone from './pages/Keystone';

function InitialRoute() {
  if (window.location.search === '?keystone') {
    return <Navigate to="/keystone/tutorial" />;
  }
  return <Navigate to="/ledger/pair-device" />;
}

export const routes = [
  {
    children: [
      {
        children: [
          {
            element: <KeystoneImportSuccess />,
            path: 'success',
          },
          {
            element: <KeystoneSyncDevice />,
            path: 'tutorial',
          },
          {
            element: <KeystoneScanQR />,
            path: 'import',
          },
        ],
        element: <Keystone />,
        path: 'keystone',
      },
      {
        children: [
          {
            element: <LedgerPairDevice />,
            path: 'pair-device',
          },
          {
            element: <LedgerSelectAddress />,
            path: 'select-address',
          },
          {
            element: <LedgerAccountAdded />,
            path: 'paired',
          },
        ],
        element: <Ledger />,
        path: 'ledger',
      },
      {
        element: <InitialRoute />,
        path: '',
      },
    ],
    element: <UnlockedAccountsGuard redirectTo="/unlock" />,
  },
  {
    children: [
      {
        children: [
          {
            element: <Unlock />,
            path: 'unlock',
          },
        ],
        element: <LockedAccountsGuard redirectTo="/" />,
      },
    ],
    element: <InitializedAccountsGuard />,
  },
];

export default routes;
