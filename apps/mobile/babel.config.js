// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/preset-typescript'],
  plugins: [
    "@babel/plugin-syntax-bigint",
    [
      'babel-plugin-rewrite-require',
      {
        aliases: {
          stream: 'readable-stream',
        },
      },
    ],
    [
      'babel-plugin-module-resolver',
      {
        "root": ["./src"],
        "alias": {
          "e2e": "./src/e2e",
          "components": "./src/components",
          "core": "./src/core",
          "navigation": "./src/navigation",
          "pages": "./src/pages",
          "shared": "./src/shared",
          "strings": "./src/strings",
        }
      },
    ],
    [
      'react-native-reanimated/plugin', {
        globals: ['__scanCodes'],
        relativeSourceLocation: true,
      }
    ],
  ],
};
