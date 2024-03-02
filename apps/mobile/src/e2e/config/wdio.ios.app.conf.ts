// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
// copied from https://github.com/webdriverio/appium-boilerplate
/* eslint-disable import/no-import-module-exports */

import { join } from 'path';
import config from './wdio.shared.local.appium.conf';

// ============
// Specs
// ============
config.specs = [
  '../../**/**/tests/specs/**/app*.spec.ts',
  '../../**/**/tests/nightly-specs/**/app*.spec.ts',
];
config.baseUrl = 'http://localhost:4723/wd/hub';

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
  {
    // The path to the app
    'appium:app': join(process.cwd(), './ios/build/Petra-Wallet.app'),
    'appium:automationName': 'XCUITest',
    'appium:bundleId': 'com.aptoslabs.petra',

    // For W3C the appium capabilities need to have an extension prefix
    // This is `appium:` for all Appium Capabilities which can be found here
    // http://appium.io/docs/en/writing-running-appium/caps/
    'appium:deviceName': 'iPhone 14',
    'appium:newCommandTimeout': 240,
    'appium:orientation': 'PORTRAIT',
    'appium:platformVersion': '16.2',

    maxInstances: 1,
    // The defaults you need to have in your config
    platformName: 'iOS',
  },
];

exports.config = config;
