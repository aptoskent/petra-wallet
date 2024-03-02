// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */

const { getDefaultConfig } = require('metro-config');
const { resolve } = require('path');

const metroSymlinkResolverFactory = require('@rnx-kit/metro-resolver-symlinks');

const metroSymlinkResolver = metroSymlinkResolverFactory();

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const modulesMap = {
  '@petra/core': resolve('../../packages/core/src'),
  '@petra/indexer-client': resolve('../../packages/indexer-client'),
};

function resolveAlias(moduleName) {
  for (const [alias, path] of Object.entries(modulesMap)) {
    const relPath = moduleName.split(alias, 2)[1];
    if (relPath !== undefined) {
      return `${path}${relPath}`;
    }
  }
  return moduleName;
}

module.exports = (async () => {
  const { resolver: { assetExts, sourceExts } } = await getDefaultConfig(undefined);
  const resolveSvgsAsSourceResolverConfig = {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  };

  return {
    resolver: {
      resolveRequest: (context, moduleName, platform) => {
        // Apply normal module resolution to aliased module
        const aliasedModuleName = resolveAlias(moduleName);
        return metroSymlinkResolver(context, aliasedModuleName, platform);
      },
      ...resolveSvgsAsSourceResolverConfig,
    },
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    // Watch root of monorepo for additional node_modules folders
    watchFolders: [
      resolve(__dirname, './node_modules'),
      resolve(__dirname, '../../node_modules'),
      // Ensure visibility of hoisted dependencies for @petra/core
      resolve(__dirname, '../../packages/core/node_modules'),
      ...Object.values(modulesMap),
    ],
  };
})();
