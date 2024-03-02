// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Routes } from './routes';

export const walletBgColor = (pathname: string) => {
  switch (pathname) {
    case Routes.wallet.path:
    case Routes.switchAccount.path:
      return 'navy.900';
    default:
      return undefined;
  }
};

export const walletTextColor = (pathname: string) => {
  switch (pathname) {
    case Routes.wallet.path:
    case Routes.switchAccount.path:
      return 'white';
    default:
      return undefined;
  }
};

export const walletBackButtonColor = (
  pathname: string,
  colorMode: 'dark' | 'light',
) => {
  switch (pathname) {
    case Routes.wallet.path:
    case Routes.switchAccount.path:
      return 'navy.800';
    default:
      return colorMode === 'dark' ? 'navy.800' : 'gray.100';
  }
};
