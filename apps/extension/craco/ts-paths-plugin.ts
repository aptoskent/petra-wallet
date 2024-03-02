// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/no-extraneous-dependencies */

import type { CracoPlugin } from '@craco/types';
import assert from 'assert';
import path from 'path';
import ts from 'typescript';

type AliasMap = { [src: string]: string };

/**
 * Read tsconfig.json and parse baseUrl and aliases
 * @param tsConfigPath path to the tsconfig.json
 */
function readTsConfig(tsConfigPath: string) {
  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  assert(configFile.error === undefined);
  const compilerOptions = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    './',
  );

  const baseUrl = path.resolve(
    compilerOptions.options.baseUrl ?? path.dirname(tsConfigPath),
  );

  const tsPaths: { [src: string]: string[] } =
    compilerOptions.options.paths ?? {};

  return { baseUrl, tsPaths };
}

type TsConfig = ReturnType<typeof readTsConfig>;

/**
 * Retrieve TS aliases from a TS config
 * Currently only supporting 1:1 mappings
 * @param tsConfig parsed TS config
 */
function getTsAliases({ baseUrl, tsPaths }: TsConfig) {
  const tsAliases: AliasMap = {};
  for (const [source, targets] of Object.entries(tsPaths)) {
    // Only handling 1:1 mappings
    assert(targets.length === 1);
    tsAliases[source] = path.resolve(baseUrl, targets[0]);
  }

  return tsAliases;
}

function tsAliasesToWebpackAliases(tsAliases: AliasMap) {
  const aliases: AliasMap = {};
  for (const [tsSrc, tsTgt] of Object.entries(tsAliases)) {
    const [webpackSrc, ...srcWildcards] = tsSrc.split('/*', 2);
    const [webpackTgt, ...tgtWildcards] = tsTgt.split('/*', 2);

    // Only handling exact match or single matching wildcard at the end
    if (srcWildcards.length === 0) {
      assert(tgtWildcards.length === 0);
      // Note: appending exact match symbol to source
      aliases[`${webpackSrc}$`] = webpackTgt;
    } else {
      assert(srcWildcards[0].length === 0);
      assert(tgtWildcards[0] === srcWildcards[0]);
      aliases[webpackSrc] = webpackTgt;
    }
  }
  return aliases;
}

function tsAliasesToJestAliases(tsAliases: AliasMap) {
  const jestAliases: AliasMap = {};
  for (const [tsSrc, tsTgt] of Object.entries(tsAliases)) {
    const [jestSrc, ...srcWildcards] = tsSrc.split('/*', 2);
    const [jestTgt, ...tgtWildcards] = tsTgt.split('/*', 2);

    // Only handling exact match or single matching wildcard at the end
    if (srcWildcards.length === 0) {
      assert(tgtWildcards.length === 0);
      // Note: appending exact match symbol to source
      jestAliases[`^${jestSrc}$`] = jestTgt;
    } else {
      assert(srcWildcards[0].length === 0);
      assert(tgtWildcards[0] === srcWildcards[0]);
      jestAliases[`^${jestSrc}/(.*)$`] = `${jestTgt}/$1`;
    }
  }
  return jestAliases;
}

/**
 * Plugin that syncs TS aliases to Webpack and Jest aliases.
 * It reads TS aliases from the project's tsconfig.json and automatically
 * converts them into Webpack and Jest aliases.
 */
const CracoTsPathsPlugin: CracoPlugin = {
  overrideJestConfig({ context, jestConfig }) {
    const { paths } = context;
    assert(paths !== undefined);

    const tsConfig = readTsConfig(paths.appTsConfig);

    // region Make sure project's absolute imports are handled by Jest
    // An empty `moduleDirectories` is equivalent to only looking under `node_modules`
    const moduleDirectories = jestConfig.moduleDirectories ?? ['node_modules'];

    // Give higher priority to project's absolute imports, to match typescript's module resolution
    moduleDirectories.unshift(path.relative(paths.appPath, tsConfig.baseUrl));
    // endregion

    // region Map TS aliases to Jest aliases
    const tsAliases = getTsAliases(tsConfig);
    const jestAliases = tsAliasesToJestAliases(tsAliases);
    assert(jestConfig.moduleNameMapper !== undefined);
    const moduleNameMapper = {
      ...jestConfig.moduleNameMapper,
      ...jestAliases,
    };
    // endregion

    return {
      ...jestConfig,
      moduleDirectories,
      moduleNameMapper,
    };
  },
  overrideWebpackConfig({ context, webpackConfig }) {
    const { paths } = context;
    assert(paths !== undefined);

    const tsConfig = readTsConfig(paths.appTsConfig);

    // region Make sure project's absolute imports are handled by Webpack
    assert(webpackConfig.resolve?.modules !== undefined);

    // Give higher priority to project's absolute imports, to match typescript's module resolution
    const resolveModules = [tsConfig.baseUrl, ...webpackConfig.resolve.modules];
    // endregion

    // region Map TS aliases to Webpack aliases
    const tsAliases = getTsAliases(tsConfig);
    const webpackAliases = tsAliasesToWebpackAliases(tsAliases);

    assert(webpackConfig.resolve.alias !== undefined);
    const resolveAlias = {
      ...webpackConfig.resolve.alias,
      ...webpackAliases,
    };
    // endregion

    return {
      ...webpackConfig,
      resolve: {
        ...webpackConfig.resolve,
        alias: resolveAlias,
        modules: resolveModules,
      },
    };
  },
};

export default CracoTsPathsPlugin;
