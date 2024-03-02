// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { renderHook } from '@testing-library/react';
import { HexString } from 'aptos';
import { buildCoinTransferPayload } from '../transactions';
import { LocalAccount } from '../types';
import { useTransactions } from './useTransactions';

const activeAccount: LocalAccount = {
  address: '0x111111',
  privateKey: '0x222222',
  publicKey: '0x333333',
  type: 'local',
};
const activeAccountSeqNumber = 1n;

const payload = buildCoinTransferPayload({
  amount: 1n,
  recipient: '0x01',
});

jest.mock('./useSequenceNumber', () => () => ({
  get: async () => activeAccountSeqNumber,
}));

jest.mock('./useAccounts', () => ({
  useActiveAccount: () => ({
    activeAccount,
  }),
}));

jest.mock('./useNetworks', () => ({
  useNetworks: () => ({
    aptosClient: {
      getChainId: async () => 1,
    },
  }),
}));

jest.mock('./useRestApi', () => () => ({
  addPendingTxn: async () => {},
}));

jest.mock('./useSigner', () => () => ({
  withSigner: async () => {},
}));

test('build transaction with active account', async () => {
  const { result } = renderHook(() => useTransactions());
  const rawTxn = await result.current.buildRawTransaction(payload);
  expect(rawTxn.payload).toEqual(payload);

  const address = HexString.fromUint8Array(rawTxn.sender.address);
  expect(activeAccount.address).toEqual(address.toShortString());
});

test('build transaction with overridden sender and sequence number', async () => {
  const { result } = renderHook(() => useTransactions());

  const sender = '0x444444';
  const sequenceNumber = 2;
  expect(sender).not.toEqual(activeAccount.address);
  expect(sequenceNumber).not.toEqual(activeAccountSeqNumber);

  const rawTxn = await result.current.buildRawTransaction(payload, {
    sender,
    sequenceNumber,
  });

  const rawTxnSender = HexString.fromUint8Array(
    rawTxn.sender.address,
  ).toShortString();
  expect(rawTxnSender).toEqual(sender);
  expect(rawTxn.sequence_number).toEqual(BigInt(sequenceNumber));
});
