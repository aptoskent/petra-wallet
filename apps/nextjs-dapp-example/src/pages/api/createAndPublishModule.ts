// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { AptosAccount, AptosClient, HexString } from 'aptos';
import { defaultNetworks } from '@petra/core/types/network';
import { moonCoinAccountInfo } from 'src/constants';
import { createAndPublishModule } from 'src/utils';

type Data = {
  hasPublished: boolean
};

const modulePath = '../../../../src/modules/source/coin/build/Examples';

export default async function createAndPublishModuleHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { query } = req;
  const { network } = query;

  if (typeof network !== 'string') {
    throw new Error('Network was undefined');
  }

  const client = new AptosClient(defaultNetworks[network].nodeUrl);

  const moonCoinAccount = new AptosAccount(
    new HexString(moonCoinAccountInfo.privateKey).toUint8Array(),
  );

  const packageMetadataPath = path.resolve(__dirname, path.join(modulePath, 'package-metadata.bcs'));
  const moduleDataPath = path.resolve(__dirname, path.join(modulePath, 'bytecode_modules', 'moon_coin.mv'));

  const packageMetadata = fs.readFileSync(packageMetadataPath);
  const moduleData = fs.readFileSync(moduleDataPath);

  // Check if it has already been published to the chain
  const accountResource = await client.getAccountResource(
    moonCoinAccountInfo.address,
    `0x1::coin::CoinInfo<${moonCoinAccountInfo.address}::moon_coin::MoonCoin3>`,
  );

  const { data } = accountResource;

  if (data) {
    return res.json({ hasPublished: true });
  }

  await createAndPublishModule({
    aptosClient: client,
    authorAccount: moonCoinAccount,
    moduleData,
    packageMetadata,
  });

  return res.json({ hasPublished: false });
}
