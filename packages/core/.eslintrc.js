// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    webextensions: true,
  },
  extends: ['@petra/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    project: ['tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@petra/no-client-date': 'error',
  },
};
