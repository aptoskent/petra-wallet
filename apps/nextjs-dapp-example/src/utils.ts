// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { HexString, TxnBuilderTypes, AptosClient, AptosAccount } from 'aptos';

interface CreateAndPublishModuleProps {
  aptosClient: AptosClient;
  authorAccount: AptosAccount,
  moduleData: Buffer,
  packageMetadata: Buffer
}

export async function createAndPublishModule({
  aptosClient,
  authorAccount,
  moduleData,
  packageMetadata,
}: CreateAndPublishModuleProps) {
  try {
    const txnHash = await aptosClient.publishPackage(authorAccount, new HexString(packageMetadata.toString('hex')).toUint8Array(), [
      new TxnBuilderTypes.Module(new HexString(moduleData.toString('hex')).toUint8Array()),
    ]);
    await aptosClient.waitForTransaction(txnHash, { checkSuccess: true }); // <:!:publish
    return true;
  } catch (err: any) {
    throw new Error(err);
  }
}

export default createAndPublishModule;
