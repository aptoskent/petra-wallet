// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
// copied from https://github.com/webdriverio/appium-boilerplate
/* eslint-disable import/no-import-module-exports */

import { config } from './wdio.shared.conf';

//
// ======
// Appium
// ======
//
config.services = (config.services ? config.services : []).concat([
  [
    'appium',
    {
      args: {
        address: 'localhost',

        // Write the Appium logs to a file in the root of the directory
        log: './appium.log',

        // This is needed to tell Appium that we can execute local ADB commands
        // and to automatically download the latest version of ChromeDriver
        relaxedSecurity: true,
      },
      // This will use the globally installed version of Appium
      command: 'appium',
    },
  ],
]);
//
// =====================
// Server Configurations
// =====================
//
config.port = 4723;

export default config;
