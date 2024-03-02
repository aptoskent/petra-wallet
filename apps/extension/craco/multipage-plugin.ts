// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */

import type { CracoPlugin } from '@craco/types';
import assert from 'assert';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { EntryObject } from 'webpack';

export interface CracoMultipagePluginOptions {
  entrypoints: EntryObject;
  filenameMap: { [key: string]: string[] };
  relativeImports?: boolean;
}

/**
 * Plugin that overrides the default webpack config to support multiple HTML pages and entrypoints
 */
const MultipagePlugin: CracoPlugin = {
  overrideWebpackConfig({ context: { paths }, pluginOptions, webpackConfig }) {
    assert(paths !== undefined);
    assert(webpackConfig.output !== undefined);
    assert(webpackConfig.plugins !== undefined);
    assert(webpackConfig.plugins[0] instanceof HtmlWebpackPlugin);

    const {
      entrypoints,
      filenameMap,
      relativeImports = true,
    } = pluginOptions as CracoMultipagePluginOptions;

    // Adjust imports relative to appSrc
    if (relativeImports) {
      for (const [name, entrypoint] of Object.entries(entrypoints)) {
        if (typeof entrypoint === 'string') {
          entrypoints[name] = `${paths.appSrc}/${entrypoint}`;
        } else if (Array.isArray(entrypoint)) {
          entrypoints[name] = entrypoint.map(
            (importPath) => `${paths.appSrc}/${importPath}`,
          );
        } else {
          entrypoint.import = `${paths.appSrc}/${entrypoint.import}`;
        }
      }
    }

    // The name of output bundles should be unique for each entrypoint
    const outputConfig = {
      ...webpackConfig.output,
      filename: 'static/js/[name].js',
    };

    // Retrieve default HtmlPlugin config from default instance
    const defaultHtmlPlugin = webpackConfig.plugins[0];
    const otherDefaultPlugins = [...webpackConfig.plugins.slice(1)];
    const defaultHtmlPluginOptions = defaultHtmlPlugin.userOptions;

    // Instantiate one plugin per page
    const htmlPlugins = Object.entries(filenameMap).map(
      ([filename, chunks]) =>
        new HtmlWebpackPlugin({
          ...defaultHtmlPluginOptions,
          chunks,
          filename,
          template: `${paths.appPublic}/${filename}`,
        }),
    );

    return {
      ...webpackConfig,
      entry: entrypoints,
      output: outputConfig,
      plugins: [...htmlPlugins, ...otherDefaultPlugins],
    };
  },
};

export default MultipagePlugin;
