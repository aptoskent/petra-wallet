// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:typescript-sort-keys/recommended',
  ],
  ignorePatterns: ['*.css', '*.jsx'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@petra',
    '@typescript-eslint',
    'header',
    'react',
    'react-hooks',
    'sort-class-members',
    'sort-destructure-keys',
    'sort-keys-fix',
  ],
  rules: {
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/indent': 'off',
    // Allow not using `this` when defining method as arrow function
    'class-methods-use-this': ['error', { enforceForClassFields: false }],
    'function-paren-newline': 'off',
    "header/header": [2, "line", [" Copyright © Aptos", " SPDX-License-Identifier: Apache-2.0"]],
    'implicit-arrow-linebreak': 'off',
    'no-confusing-arrow': 'off',
    // Replacing airbnb rule with following, to re-enable "ForOfStatement"
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    // Allow prepending statements with void to explicitly ignore the return value
    'no-void': ['error', { allowAsStatement: true }],
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    // Allow using dynamic components with <FormattedMessage />
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'react/require-default-props': 0,
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': 'off',
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys-fix/sort-keys-fix': 'warn',
    'sort-keys': [
      'error',
      'asc',
      { caseSensitive: true, minKeys: 2, natural: false },
    ],
  },
};
