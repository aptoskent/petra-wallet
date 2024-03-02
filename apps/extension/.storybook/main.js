// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    'storybook-react-intl',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@petra/core': path.resolve(__dirname, '../../../packages/core/src/'),
      core: path.resolve(__dirname, '../src/core'),
    };

    config.module.rules = [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
        },
      },
      ...config.module.rules,
    ];

    return config;
  },
};
