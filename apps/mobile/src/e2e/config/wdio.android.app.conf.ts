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
    'appium:app': join(process.cwd(), './android/build/Petra-Wallet.apk'),
    'appium:automationName': 'UiAutomator2',

    // For W3C the appium capabilities need to have an extension prefix
    // http://appium.io/docs/en/writing-running-appium/caps/
    // This is `appium:` for all Appium Capabilities which can be found here
    'appium:deviceName': 'Pixel_3_10.0',

    'appium:newCommandTimeout': 240,

    'appium:orientation': 'PORTRAIT',

    maxInstances: 1,
    // The defaults you need to have in your config
    platformName: 'Android',
  },
];

exports.config = config;
