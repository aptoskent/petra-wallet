// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
// copied from https://github.com/webdriverio/appium-boilerplate
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-import-module-exports
// import SlackReporter from '@ericmconnelly/wdio-slack-reporter';
// eslint-disable-next-line import/no-import-module-exports
import { config } from '../wdio.shared.conf';

const githubSha = process.env.GITHUB_SHA_SHORT;
const branchName = process.env.BRANCH_NAME;

// ============
// Specs
// ============
config.specs = ['../../**/**/tests/specs/**/app*.spec.ts'];
// =============================
// Browserstack specific config
// =============================
// User configuration
config.user = process.env.BROWSERSTACK_USERNAME;
config.key = process.env.BROWSERSTACK_ACCESS_KEY;
// Use browserstack service
config.services = [
  [
    'browserstack',
    {
      app: process.env.BROWSERSTACK_IOS_APP_ID,
      browserstackLocal: process.env.RUN_LOCAL_BROWSERSTACK === 'true',
      // eslint-disable-next-line no-template-curly-in-string
      buildIdentifier: '#${BUILD_NUMBER}',
      buildName: branchName,
      buildTag: githubSha,
      forcedStop: true,
      projectName: 'petra-wallet',
    },
  ],
];
config.hostname = 'hub.browserstack.com';

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
const capabilities = [
  {
    'bstack:options': {
      buildName: branchName,
      buildTag: githubSha,
      deviceName: 'iPhone 13 Pro',
      local: false,
      networkLogs: true,
      osVersion: '15',
    },
  },
];

const fullCapabilities = [
  ...capabilities,
  {
    'bstack:options': {
      buildName: branchName,
      buildTag: githubSha,
      deviceName: 'iPhone 14 Pro Max',
      local: false,
      networkLogs: true,
      osVersion: '16',
    },
  },
];

config.capabilities =
  process.env.RUN_NIGHTLY_BUILD === 'true' ? fullCapabilities : capabilities;

// config.reporters = [
//   [
//     SlackReporter,
//     {
//       slackOptions: {
//         channel: '#petra-ci-logs',
//         slackIconUrl: 'https://webdriver.io/img/webdriverio.png',
//         slackName: 'Petra CI WebdriverIO Reporter',
//         type: 'webhook',
//         webhook:
//           'https://hooks.slack.com/services/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',
//       },
//     },
//   ] as any,
// ];

exports.config = config;
