// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */

import type { CracoPlugin } from '@craco/types';
import assert from 'assert';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { ForkTsCheckerWebpackPluginOptions } from 'fork-ts-checker-webpack-plugin/lib/plugin-options';
import path from 'path';

import ESLintPlugin from 'eslint-webpack-plugin';

export interface InternalPackageOptions {
  checkTypes?: boolean;
  eslint?: boolean;
  path: string;
}

export interface CracoInternalPackagesPluginOptions {
  packages: InternalPackageOptions[];
}

/**
 * Extend the CRA app with the specified internal packages
 */
const CracoInternalPackagesPlugin: CracoPlugin = {
  overrideWebpackConfig({ context, pluginOptions, webpackConfig }) {
    const { paths } = context;
    assert(paths !== undefined);

    const { packages } = pluginOptions as CracoInternalPackagesPluginOptions;

    // Note: please refer to the react-scripts' webpack.config to better understand what's happening

    // region Extend babel-loader with internal packages
    // Expecting at least one root rule
    const moduleRules = webpackConfig.module?.rules;
    assert(moduleRules !== undefined && moduleRules.length >= 1);

    // The last rule is the main "oneOf" rule
    const oneOfRule = moduleRules[moduleRules.length - 1];
    assert(oneOfRule !== '...' && oneOfRule.oneOf !== undefined);

    const babelLoaderRule = oneOfRule.oneOf[3];
    assert(babelLoaderRule !== undefined);
    assert(babelLoaderRule.loader?.includes('babel-loader'));
    assert(babelLoaderRule.include === paths.appSrc);

    babelLoaderRule.include = [
      // Main source directory
      paths.appSrc,
      // Internal packages source directories
      ...packages
        .map((pkg) => path.resolve(paths.appPath, pkg.path))
        .map((pkgAbsPath) => `${pkgAbsPath}/src`),
    ];
    // endregion

    // region Opt-out of ModuleScopePlugin
    // This plugin is a safety measure to prevent includes that are external to the project.
    // We know what we're doing, so opting out of it :)
    const resolvePlugins = webpackConfig.resolve?.plugins;
    assert(resolvePlugins?.length === 1);

    const moduleScopePlugin = resolvePlugins[0];
    assert(moduleScopePlugin !== undefined && moduleScopePlugin !== '...');
    resolvePlugins.splice(0, 1);
    // endregion

    assert(webpackConfig.plugins !== undefined);
    const plugins = [...webpackConfig.plugins];

    // region Extend TS checker plugin to type-check internal packages
    // Note: we're replacing the react-scripts version of the plugin with a newer one,
    //  as version "^6.0.0" has some issues type checking external files
    const tsCheckerPluginIdx = plugins.findIndex(
      (plugin) => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin',
    );
    if (tsCheckerPluginIdx !== undefined) {
      const oldTsCheckerPlugin: any = plugins[tsCheckerPluginIdx];
      const options: ForkTsCheckerWebpackPluginOptions = {
        ...oldTsCheckerPlugin.options,
      };

      // The default value causes a crash with the latest version of the plugin
      options.logger = undefined;

      assert(options?.issue?.include !== undefined);
      assert(Array.isArray(options.issue.include));
      options.issue.include = [
        // Main source directory
        { file: 'src/**/*.{ts,tsx}' },
        // Internal packages source directories.
        // They need to be relative to the project root
        ...packages
          .filter(({ checkTypes = true }) => checkTypes)
          .map((pkg) => path.relative(paths.appPath, pkg.path))
          .map((pkgRelPath) => ({
            file: `${pkgRelPath}/src/**/*.{ts,tsx}`,
          })),
      ];

      plugins[tsCheckerPluginIdx] = new ForkTsCheckerWebpackPlugin(options);
    }
    // endregion

    // region Extend ESLint plugin to check internal packages
    const eslintPluginIdx = plugins.findIndex(
      (plugin) => plugin instanceof ESLintPlugin,
    );
    if (eslintPluginIdx !== undefined) {
      const eslintPlugin = plugins[eslintPluginIdx] as ESLintPlugin;
      const options = {
        ...(eslintPlugin.options as ESLintPlugin.Options),
        files: [
          // Main source directory
          '**/*.{ts,tsx}',
          // Internal packages source directories.
          // They need to be absolute paths
          ...packages
            .filter(({ eslint = true }) => eslint)
            .map((pkg) => path.resolve(paths.appPath, pkg.path))
            .map((pkgAbsPath) => `${pkgAbsPath}/src/**/*.{ts,tsx}`),
        ],
      };
      plugins[eslintPluginIdx] = new ESLintPlugin(options);
    }
    // endregion

    return {
      ...webpackConfig,
      plugins,
    };
  },
};

export default CracoInternalPackagesPlugin;
