// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable sort-keys-fix/sort-keys-fix,sort-keys */

import type { CracoConfig } from '@craco/types';
import { whenDev } from '@craco/craco';
import { ProvidePlugin } from 'webpack';

import CracoTsPathsPlugin from './craco/ts-paths-plugin';
import CracoIgnoreSourcemapPlugin, {
  type CracoIgnoreSourcemapPluginOptions,
} from './craco/ignore-sourcemap-plugin';
import CracoInternalPackagesPlugin, {
  type CracoInternalPackagesPluginOptions,
} from './craco/internal-projects-plugin';
import CracoMultipagePlugin, {
  type CracoMultipagePluginOptions,
} from './craco/multipage-plugin';

// region Config

const packagesRelDir = '../../packages';
const internalPackagesPluginOptions: CracoInternalPackagesPluginOptions = {
  packages: [
    { path: `${packagesRelDir}/core` },
    { path: `${packagesRelDir}/indexer-client` },
  ],
};

const multipagePluginOptions: CracoMultipagePluginOptions = {
  entrypoints: {
    background: 'scripts/background.ts',
    contentscript: 'scripts/contentscript.ts',
    core: 'core',
    hwPairing: {
      dependOn: ['core'],
      import: 'hw-pairing/index.tsx',
    },
    inpage: 'scripts/inpage.ts',
    main: {
      dependOn: ['core'],
      import: 'index.tsx',
    },
    onboarding: {
      dependOn: ['core'],
      import: 'onboarding/index.tsx',
    },
    prompt: {
      dependOn: ['core'],
      import: 'prompt/index.tsx',
    },
  },
  filenameMap: {
    'hw-pairing.html': ['hwPairing', 'core'],
    'index.html': ['main', 'core'],
    'onboarding.html': ['onboarding', 'core'],
    'prompt.html': ['prompt', 'core'],
  },
};

// Don't look for sourcemaps from these dependencies, as they don't exist and would show a warning
const ignoreDepSourcemapsOptions: CracoIgnoreSourcemapPluginOptions = {
  patterns: [/jsbi/, /@zxing/],
};

const urDecoderReplacement = require.resolve('@ngraveio/bc-ur/dist/urDecoder');

// endregion

const cracoConfig: CracoConfig = {
  babel: {
    plugins: [
      [
        'formatjs',
        {
          ast: true,
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
        },
      ],
    ],
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^axios$': require.resolve('axios'),
        // This module's conditional exports don't work with jest.
        '^@ledgerhq/devices/hid-framing$': require.resolve(
          '@ledgerhq/devices/hid-framing',
        ),
        '^@keystonehq/ur-decoder$': urDecoderReplacement,
      },
    },
  },
  plugins: [
    // Sync webpack module resolution with TS config paths
    { plugin: CracoTsPathsPlugin },
    // Enable parallel compilation, type checking and linting for internal packages
    {
      plugin: CracoInternalPackagesPlugin,
      options: internalPackagesPluginOptions,
    },
    {
      plugin: CracoMultipagePlugin,
      options: multipagePluginOptions,
    },
    {
      plugin: CracoIgnoreSourcemapPlugin,
      options: ignoreDepSourcemapsOptions,
    },
  ],
  webpack: {
    configure: {
      // Using full source map on dev build, otherwise chrome debugger gets weird
      devtool: whenDev(() => 'eval-source-map'),
      resolve: {
        alias: {
          '@keystonehq/ur-decoder': urDecoderReplacement,
        },
        // The Aptos SDK uses the Node Stream API, so need to polyfill here
        fallback: {
          events: false,
          stream: require.resolve('stream-browserify'),
          string_decoder: require.resolve('string_decoder'),
        },
      },
    },
    plugins: {
      // The `Buffer` class is available as built-in global in the NodeJS context
      // or when running the Webpack dev server.
      // This makes sure that `Buffer` becomes available as global for the Browser context as well.
      // Required by Petra, as well as by some dependencies (e.g. `ed25519-hd-key`)
      add: [[new ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }), 'append']],
    },
  },
};

export default cracoConfig;
