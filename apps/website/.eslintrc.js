// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    webextensions: true,
  },
  extends: [
    '@petra/eslint-config',
    'next/core-web-vitals',
  ],
  ignorePatterns: ['*.d.ts', '*.config.js'],
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
    'react/function-component-definition': 0,
  },
};
