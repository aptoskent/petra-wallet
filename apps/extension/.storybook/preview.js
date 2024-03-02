// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { reactIntl } from './reactIntl';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  reactIntl,
  locale: reactIntl.defaultLocale,
  locales: {
    en: 'English',
    zh: 'Chinese',
  },
};
