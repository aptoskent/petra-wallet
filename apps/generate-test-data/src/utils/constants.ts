// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosClient, CoinClient, FaucetClient, TokenClient } from 'aptos';

export const NODE_URL = 'https://fullnode.testnet.aptoslabs.com';
export const FAUCET_URL = 'https://faucet.testnet.aptoslabs.com';

export const aptosClient = new AptosClient(NODE_URL);
export const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
export const tokenClient = new TokenClient(aptosClient);
export const coinClient = new CoinClient(aptosClient);
