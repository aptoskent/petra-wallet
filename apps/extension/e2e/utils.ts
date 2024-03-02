// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
import { AptosAccount, AptosClient, FaucetClient, TokenClient } from 'aptos';

interface SetUpTokenTransferProps {
  aptosClient: AptosClient;
  faucetClient: FaucetClient;
  tokenClient: TokenClient;
}

export const setUpTokenTransfer = async ({
  aptosClient,
  faucetClient,
  tokenClient,
}: SetUpTokenTransferProps) => {
  const alice = new AptosAccount();
  const bob = new AptosAccount();

  // Fund accounts
  const [aliceFundTxn] = await faucetClient.fundAccount(
    alice.address(),
    100_000_000,
    15,
  );
  const [bobFundTxn] = await faucetClient.fundAccount(
    bob.address(),
    100_000_000,
    15,
  );
  await Promise.all([
    aptosClient.waitForTransaction(aliceFundTxn, { checkSuccess: true }),
    aptosClient.waitForTransaction(bobFundTxn, { checkSuccess: true }),
  ]);

  // Create a collection
  const collectionName = "Alice's collection";
  const createCollectionTxnHash = await tokenClient.createCollection(
    alice,
    collectionName,
    "Alice's very special collection",
    'https://alice.com',
  );
  await aptosClient.waitForTransaction(createCollectionTxnHash, {
    checkSuccess: true,
  });

  // Create a token
  const tokenName = "Alice's special token";
  const createTokenTxnHash = await tokenClient.createToken(
    alice,
    collectionName,
    tokenName,
    "Alice's very own token",
    1,
    'https://aptos.dev/img/nyan.jpeg',
  );
  await aptosClient.waitForTransaction(createTokenTxnHash, {
    checkSuccess: true,
  });

  async function optInToDirectTransfer() {
    const bobOptedInTxn = await tokenClient.optInTokenTransfer(bob, true);
    await aptosClient.waitForTransaction(bobOptedInTxn, {
      checkSuccess: true,
    });
  }

  async function offerToken() {
    // alice offers bob a token
    const offerTokenTxn = await tokenClient.offerToken(
      alice,
      bob.address(),
      alice.address(),
      collectionName,
      tokenName,
      1,
      0,
    );
    await aptosClient.waitForTransaction(offerTokenTxn, {
      checkSuccess: true,
    });
  }

  async function directTransferToken() {
    // alice offers bob a token
    const directTransferTokenTxn = await tokenClient.transferWithOptIn(
      alice,
      alice.address(),
      collectionName,
      tokenName,
      0,
      bob.address(),
      1,
    );
    await aptosClient.waitForTransaction(directTransferTokenTxn, {
      checkSuccess: true,
    });
  }

  return {
    alice,
    bob,
    tokenName,
    collectionName,
    directTransferToken,
    optInToDirectTransfer,
    offerToken,
  };
};

/**
 * MoonCoin info
 */
export const moonCoinInfo = Object.freeze({
  address: '0x894f32eb8d295f1e618570d980b816a0c4546fc7e79bc81cc07028460b23a25b',
  privateKey: '0xefb6e3a3e3bd2b2c6a0ef5ee33c5ed7389e7881ddb4ab48dd3908709524265be',
  coinName: 'moon_coin',
  symbol: {
    0: 'MoonCoin0',
    3: 'MoonCoin3',
    12: 'MoonCoin12',
  }
} as const);