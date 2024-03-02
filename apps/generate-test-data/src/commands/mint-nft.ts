// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-empty */

import { AptosAccount } from 'aptos';
import { program } from 'commander';
import accountFromAddress from '../utils/accountFromAddress';
import { aptosClient, tokenClient } from '../utils/constants';
import optionallyFundAccount from '../utils/optionallyFundAccount';
import randomImage from '../utils/randomImage';

const collection = {
  description: 'A place to store all your test NFTs.',
  name: 'Petra Test Collection',
  url: 'https://aptos.dev/',
};

function generateToken(imageUrl?: string) {
  const seg = () => (Math.random() * 100000000).toString().slice(0, 4);

  return {
    collection: collection.name,
    description: 'A random NFT to test with',
    name: `${seg()}-${seg()}-${seg()}`,
    quantity: 1,
    url: imageUrl || randomImage(),
  };
}

async function createCollection(account: AptosAccount) {
  try {
    console.log('Making you a collection to store your test NFTs');
    const txn = await tokenClient.createCollection(
      account,
      collection.name,
      collection.description,
      collection.url,
    );
    await aptosClient.waitForTransaction(txn, { checkSuccess: true });
    console.log('\tCollection made!');
  } catch (e) {
    console.log('\tCollection already made...');
  } finally {
    console.log();
  }
}

async function createNFT(account: AptosAccount, imageUrl?: string) {
  console.log('\tGenerating a NFT and transfering it to your account...');
  const token = generateToken(imageUrl);
  const txnHash = await tokenClient.createToken(
    account,
    token.collection,
    token.name,
    token.description,
    token.quantity,
    token.url,
  );
  await aptosClient.waitForTransaction(txnHash, { checkSuccess: true });
  console.log(`\t\tDone: ${txnHash}\n`);
}

(async () => {
  program
    .requiredOption(
      '-a, --address <string>',
      'Required: The address in testnet you want to send the NFT to.',
    )
    .option(
      '-i, --image <string>',
      'Optional: The url of an image to make into an NFT. A random image will be used otherwise.',
    )
    .option(
      '-q, --quantity <number>',
      'Optional: The number of NFTs to put into your account. Defaults to 1.',
    );

  program.parse(process.argv);

  const options = program.opts();
  const { address, image } = options;
  const totalNFTsToMake = options.quantity || 1;

  const account = await accountFromAddress(address);
  await optionallyFundAccount(account);

  // Make sure the user has a collection to put NFTs
  await createCollection(account);

  for (let i = 0; i < totalNFTsToMake; i++) {
    console.log(`Making NFTs ${i + 1} of ${totalNFTsToMake}`);
    await createNFT(account, image);
  }

  console.log('Done!');
})();
