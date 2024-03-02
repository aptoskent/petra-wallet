// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */

import type { CracoPlugin } from '@craco/types';
import assert from 'assert';
import type { RuleSetCondition } from 'webpack';

// Taken from CRA's webpack.config
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

export interface CracoIgnoreSourcemapPluginOptions {
  patterns: RuleSetCondition[];
}

/**
 * Plugin that extends the `exclude` property of the source-map-loader rule
 */
const CracoIgnoreSourcemapPlugin: CracoPlugin = {
  overrideWebpackConfig({ pluginOptions, webpackConfig }) {
    // This plugin should be executed only when source maps are being used
    if (!shouldUseSourceMap) {
      return webpackConfig;
    }

    const sourceMapLoaderRule = webpackConfig.module?.rules?.[0];
    assert(sourceMapLoaderRule !== undefined && sourceMapLoaderRule !== '...');
    assert(sourceMapLoaderRule.loader?.includes('source-map-loader'));
    assert(sourceMapLoaderRule.exclude instanceof RegExp);

    const { patterns } = pluginOptions as CracoIgnoreSourcemapPluginOptions;

    sourceMapLoaderRule.exclude = {
      or: [sourceMapLoaderRule.exclude, ...patterns],
    };
    return webpackConfig;
  },
};

export default CracoIgnoreSourcemapPlugin;
