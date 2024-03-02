// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

const locales = ['en', 'zh'];

const messages = locales.reduce(
  (acc, lang) => ({
    ...acc,
    [lang]: require(`../lang/${lang}.json`), // whatever the relative path to your messages json is
  }),
  {},
);

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: 'en',
  locales,
  messages,
  formats,
};
