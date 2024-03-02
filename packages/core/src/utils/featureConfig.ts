// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { FeatureConfig } from '../types/featureConfig';
import { getServerTime } from './server-time';

const featureConfigOrigin = 'https://aptos-petra.s3.us-east-1.amazonaws.com';
const featureConfigUrl = `${featureConfigOrigin}/petra_feature_flag.json`;
const featureConfigUpdateTimer = 1000 * 60 * 60 * 1; // 1 hour

export function featureConfigNeedsUpdate(
  featureConfig: FeatureConfig | undefined,
): boolean {
  return (
    featureConfig?.lastUpdate === undefined ||
    new Date(featureConfig.lastUpdate).getTime() <
      getServerTime() - featureConfigUpdateTimer
  );
}

export async function fetchFeatureConfig(): Promise<FeatureConfig> {
  const { data } = await axios.get<FeatureConfig>(featureConfigUrl, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  return { ...data, lastUpdate: getServerTime() };
}
