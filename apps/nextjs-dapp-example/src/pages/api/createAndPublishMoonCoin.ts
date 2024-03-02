// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-console */

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { AptosAccount, AptosClient, FaucetClient, HexString, TxnBuilderTypes } from 'aptos';
import { defaultNetworks } from '@petra/core/types/network';
import { moonCoinAccountInfo } from 'src/constants';

type Data = {
  hasPublished: boolean
};

const modulePath = '../../../../src/modules/source/coin/build/Examples';

export default async function createAndPublishMoonCoinHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { query } = req;
  const { network } = query;

  if (typeof network !== 'string') {
    throw new Error('Network was undefined');
  }

  const aptosClient = new AptosClient(defaultNetworks[network].nodeUrl);

  const randomAccount = new AptosAccount(
    new HexString(moonCoinAccountInfo.privateKey).toUint8Array(),
  );

  const packageMetadataPath = path.resolve(__dirname, path.join(modulePath, 'package-metadata.bcs'));
  const moduleDataPath = path.resolve(__dirname, path.join(modulePath, 'bytecode_modules', 'moon_coin.mv'));

  const packageMetadata = fs.readFileSync(packageMetadataPath);
  const moduleData = fs.readFileSync(moduleDataPath);

  // Funding account

  try {
    const faucetClient = new FaucetClient(
      aptosClient.nodeUrl,
      defaultNetworks[network].faucetUrl as string,
    );
    const [fundAccountHash] = await faucetClient.fundAccount(moonCoinAccountInfo.address, 1e9);
    await faucetClient.waitForTransaction(fundAccountHash, { checkSuccess: true });
  } catch (err) {
    console.log(err, 'Failed to fund account, transaction failed or account is already funded');
  }

  // Check if it has already been published to the chain

  try {
    const accountResource = await aptosClient.getAccountResource(
      moonCoinAccountInfo.address,
      `0x1::coin::CoinInfo<${moonCoinAccountInfo.address}::moon_coin::MoonCoin3>`,
    );
    const { data } = accountResource;

    if (data) {
      return res.json({ hasPublished: true });
    }
  } catch {
    console.log('MoonCoin resource does not exist on chain');
  }

  // Publishing contract

  try {
    console.log('Publishing contract...');
    const txnHash = await aptosClient.publishPackage(randomAccount, new HexString(packageMetadata.toString('hex')).toUint8Array(), [
      new TxnBuilderTypes.Module(new HexString(moduleData.toString('hex')).toUint8Array()),
    ]);
    await aptosClient.waitForTransaction(txnHash, { checkSuccess: true }); // <:!:publish
    console.log('Published successfully');
    return res.json({ hasPublished: true });
  } catch {
    console.log('Error during publishing package');
  }

  return res.json({ hasPublished: false });
}
