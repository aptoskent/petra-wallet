// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BCS, HexString, TxnBuilderTypes, Types } from 'aptos';
import { buildCoinTransferPayload } from '../transactions';
import { PublicAccount } from '../types';
import PetraApiClient from './client';
import MockWindow from './mock-window';
import {
  isPetraApiRequest,
  makePetraApiResponse,
  PetraApiRequest,
} from './types';
import { PetraApiErrors } from './error';
import { AccountChangeEventArgs, NetworkChangeEventArgs } from './events';
import { aptosAccountCoinTransferFunction } from '../constants';

describe(PetraApiClient, () => {
  const client = new PetraApiClient();
  const mockWindow = new MockWindow();

  const mockAccount: PublicAccount = {
    address: '0x42',
    publicKey: '0x24',
  };
  const mockNetwork = {
    chainId: '2',
    name: 'Testnet',
    url: 'localhost:1234',
  };

  afterEach(() => {
    // Ensure no pending listeners
    expect(mockWindow.listeners.size).toEqual(0);
    mockWindow.postMessage.mockClear();
    mockWindow.addEventListener.mockClear();
    mockWindow.removeEventListener.mockClear();
  });

  describe('api calls', () => {
    test('connect', async () => {
      const responsePromise = client.connect();

      const request: PetraApiRequest = await mockWindow.waitForMessage();
      expect(isPetraApiRequest(request)).toBeTruthy();
      expect(request).toMatchObject({ args: [], method: 'connect' });

      await mockWindow.sendMessage(
        makePetraApiResponse<'connect'>(request.id, mockAccount),
      );

      const account = await responsePromise;
      expect(account).toBe(mockAccount);
    });

    test('isConnected', async () => {
      const responsePromise = client.isConnected();

      const request: PetraApiRequest = await mockWindow.waitForMessage();
      expect(isPetraApiRequest(request)).toBeTruthy();
      expect(request).toMatchObject({ args: [], method: 'isConnected' });

      await mockWindow.sendMessage(
        makePetraApiResponse<'isConnected'>(request.id, true),
      );

      const isConnected = await responsePromise;
      expect(isConnected).toBeTruthy();
    });

    test('disconnect', async () => {
      const responsePromise = client.disconnect();

      const request: PetraApiRequest = await mockWindow.waitForMessage();
      expect(isPetraApiRequest(request)).toBeTruthy();
      expect(request).toMatchObject({ args: [], method: 'disconnect' });

      await mockWindow.sendMessage(
        makePetraApiResponse<'disconnect'>(request.id, undefined),
      );

      expect(await responsePromise).toBeUndefined();
    });

    test('getAccount', async () => {
      const responsePromise = client.getAccount();

      const request: PetraApiRequest = await mockWindow.waitForMessage();
      expect(isPetraApiRequest(request)).toBeTruthy();
      expect(request).toMatchObject({ args: [], method: 'getAccount' });

      await mockWindow.sendMessage(
        makePetraApiResponse<'getAccount'>(request.id, mockAccount),
      );

      const account = await responsePromise;
      expect(account).toBe(mockAccount);
    });

    test('getNetwork', async () => {
      const responsePromise = client.getNetwork();

      const request: PetraApiRequest = await mockWindow.waitForMessage();
      expect(isPetraApiRequest(request)).toBeTruthy();
      expect(request).toMatchObject({ args: [], method: 'getNetwork' });

      await mockWindow.sendMessage(
        makePetraApiResponse<'getNetwork'>(request.id, mockNetwork),
      );

      const network = await responsePromise;
      expect(network).toEqual(mockNetwork);
    });

    describe('transactions', () => {
      const recipient =
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8';
      const amount = 717n;
      const jsonPayload: Types.EntryFunctionPayload = {
        arguments: [recipient, amount],
        function: aptosAccountCoinTransferFunction,
        type_arguments: [],
      };

      // BCS payload
      const bcsPayload = buildCoinTransferPayload({ amount, recipient });
      const serializedBcsPayload =
        '0x0200000000000000000000000000000000000000000000000000000000000000010d6170746f735f6163636f756e740e7472616e736665725f636f696e73010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e000220c548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b808cd02000000000000';

      const serializedSignedTxn =
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b80d000000000000000200000000000000000000000000000000000000000000000000000000000000010d6170746f735f6163636f756e740e7472616e736665725f636f696e73010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e000220c548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b808cd0200000000000000000000000000000000000000000000c54f5d64000000000100200c0f6cbdac968de0ec468c072bc0d2ff745ae4c7cc7e7c78304b94fe98166460401db6fde190abdbb192d5f958530379e1c5f5363764c072d4b70005b54d865f8c7e4e8beae222a011c52a24bc91433ac82adc4ff91a3da5df54667d0686238407';

      // MultiAgentRawTransaction
      const serializedMultiAgentTxn =
        '0x00c548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8950300000000000002000000000000000000000000000000000000000000000000000000000000000305746f6b656e166469726563745f7472616e736665725f736372697074000520c548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8100f416c696365436f6c6c656374696f6e0e0d416c69636520546f6b656e2032080000000000000000080100000000000000400d03000000000064000000000000007dfa5964000000000201c548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8';
      const serializedSignedMultiAgentTxn =
        '0x6280a02f97124f4267ee90ba57f46d055ca47ad13114af33e3fb13577fd9aa8f563cf65d108892d1b2f52d6bf288ebeebe3ba8346ffee7ee716dac6737564a05';

      const mockUserTxn = {} as Types.UserTransaction;

      test('signTransaction with bcsPayload', async () => {
        const responsePromise = client.signTransaction(bcsPayload);

        const request: PetraApiRequest = await mockWindow.waitForMessage();
        expect(isPetraApiRequest(request)).toBeTruthy();
        expect(request).toMatchObject({
          args: [serializedBcsPayload, undefined],
          method: 'signTransaction',
        });

        await mockWindow.sendMessage(
          makePetraApiResponse<'signTransaction'>(
            request.id,
            serializedSignedTxn,
          ),
        );

        const signedTxnBytes = await responsePromise;
        const deserializer = new BCS.Deserializer(signedTxnBytes);
        const signedTxn =
          TxnBuilderTypes.SignedTransaction.deserialize(deserializer);
        expect(signedTxn.raw_txn.payload).toEqual(bcsPayload);
      });

      test('signTransaction with jsonPayload', async () => {
        const responsePromise = client.signTransaction(jsonPayload);

        const request: PetraApiRequest = await mockWindow.waitForMessage();
        expect(isPetraApiRequest(request)).toBeTruthy();
        expect(request).toMatchObject({
          args: [jsonPayload, undefined],
          method: 'signTransaction',
        });

        await mockWindow.sendMessage(
          makePetraApiResponse<'signTransaction'>(
            request.id,
            serializedSignedTxn,
          ),
        );

        const signedTxnBytes = await responsePromise;
        const deserializer = new BCS.Deserializer(signedTxnBytes);
        const signedTxn =
          TxnBuilderTypes.SignedTransaction.deserialize(deserializer);
        expect(signedTxn.raw_txn.payload).toEqual(bcsPayload);
      });

      test('signTransaction with options', async () => {
        const responsePromise = client.signTransaction(jsonPayload, {
          maxGasFee: 100,
        });

        const request: PetraApiRequest = await mockWindow.waitForMessage();
        expect(isPetraApiRequest(request)).toBeTruthy();
        expect(request).toMatchObject({
          args: [jsonPayload, { maxGasAmount: 100 }],
          method: 'signTransaction',
        });

        await mockWindow.sendMessage(
          makePetraApiResponse<'signTransaction'>(
            request.id,
            serializedSignedTxn,
          ),
        );

        const signedTxnBytes = await responsePromise;
        const deserializer = new BCS.Deserializer(signedTxnBytes);
        const signedTxn =
          TxnBuilderTypes.SignedTransaction.deserialize(deserializer);
        expect(signedTxn.raw_txn.payload).toEqual(bcsPayload);
      });

      test('signMultiAgentTransaction', async () => {
        const multiAgentTxnBytes = new HexString(
          serializedMultiAgentTxn,
        ).toUint8Array();
        const multiDeserializer = new BCS.Deserializer(multiAgentTxnBytes);
        const txn = TxnBuilderTypes.MultiAgentRawTransaction.deserialize(
          multiDeserializer,
        ) as TxnBuilderTypes.MultiAgentRawTransaction;
        const responsePromise = client.signMultiAgentTransaction(txn);

        const request: PetraApiRequest = await mockWindow.waitForMessage();
        expect(isPetraApiRequest(request)).toBeTruthy();
        expect(request).toMatchObject({
          args: [serializedMultiAgentTxn],
          method: 'signMultiAgentTransaction',
        });

        await mockWindow.sendMessage(
          makePetraApiResponse<'signMultiAgentTransaction'>(
            request.id,
            serializedSignedMultiAgentTxn,
          ),
        );

        const signedTxnBytes = await responsePromise;
        expect(signedTxnBytes).toEqual(serializedSignedMultiAgentTxn);
      });

      test('signTransaction with multiAgent account', async () => {
        const multisigPayload = {
          multisig_address: mockAccount.address,
          type: 'multisig_payload' as const,
        };
        const responsePromise = client.signTransaction(multisigPayload);
        const request: PetraApiRequest = await mockWindow.waitForMessage();
        expect(isPetraApiRequest(request)).toBeTruthy();
        expect(request).toMatchObject({
          args: [multisigPayload],
          method: 'signTransaction',
        });

        await mockWindow.sendMessage(
          makePetraApiResponse<'signTransaction'>(
            request.id,
            serializedSignedTxn,
          ),
        );

        const signedTxnBytes = await responsePromise;
        const deserializer = new BCS.Deserializer(signedTxnBytes);
        const signedTxn =
          TxnBuilderTypes.SignedTransaction.deserialize(deserializer);
        expect(signedTxn.raw_txn.payload).toEqual(bcsPayload);
      });

      test('signAndSubmitTransaction with bcsPayload', async () => {
        const responsePromise = client.signAndSubmitTransaction(bcsPayload);

        const request: PetraApiRequest = await mockWindow.waitForMessage();
        expect(isPetraApiRequest(request)).toBeTruthy();
        expect(request).toMatchObject({
          args: [serializedBcsPayload],
          method: 'signAndSubmitTransaction',
        });

        await mockWindow.sendMessage(
          makePetraApiResponse<'signAndSubmitTransaction'>(
            request.id,
            mockUserTxn,
          ),
        );

        const userTxn = await responsePromise;
        expect(userTxn).toEqual(mockUserTxn);
      });

      test('signAndSubmitTransaction with jsonPayload', async () => {
        const responsePromise = client.signAndSubmitTransaction(jsonPayload);

        const request: PetraApiRequest = await mockWindow.waitForMessage();
        expect(isPetraApiRequest(request)).toBeTruthy();
        expect(request).toMatchObject({
          args: [jsonPayload],
          method: 'signAndSubmitTransaction',
        });

        await mockWindow.sendMessage(
          makePetraApiResponse<'signAndSubmitTransaction'>(
            request.id,
            mockUserTxn,
          ),
        );

        const userTxn = await responsePromise;
        expect(userTxn).toEqual(mockUserTxn);
      });
    });

    test('signMessage', async () => {
      const testMessage = {
        message: "Si sta come d'autunno, sugli alberi, le foglie",
        nonce: 'nonce',
      };
      const mockSignedMessage: any = {};

      const responsePromise = client.signMessage(testMessage);

      const request: PetraApiRequest = await mockWindow.waitForMessage();
      expect(isPetraApiRequest(request)).toBeTruthy();
      expect(request).toMatchObject({
        args: [testMessage],
        method: 'signMessage',
      });

      await mockWindow.sendMessage(
        makePetraApiResponse<'signMessage'>(request.id, mockSignedMessage),
      );

      const signedMessage = await responsePromise;
      expect(signedMessage).toEqual(mockSignedMessage);
    });

    test('errors', async () => {
      const responsePromise = client.connect();
      const request: PetraApiRequest = await mockWindow.waitForMessage();
      await mockWindow.sendMessage(
        makePetraApiResponse(request.id, PetraApiErrors.USER_REJECTION),
      );
      await expect(responsePromise).rejects.toThrow(
        PetraApiErrors.USER_REJECTION,
      );
    });
  });

  describe('events', () => {
    test('onAccountChange', async () => {
      let receivedAccount: PublicAccount | undefined;
      client.on('accountChange', (account: AccountChangeEventArgs) => {
        receivedAccount = account;
      });

      await mockWindow.sendMessage({
        args: mockAccount,
        name: 'accountChange',
      });
      expect(receivedAccount).toEqual(mockAccount);

      client.off('accountChange');
    });

    test('onNetworkChange', async () => {
      let receivedNetworkName: string | undefined;
      client.on('networkChange', ({ name }: NetworkChangeEventArgs) => {
        receivedNetworkName = name;
      });

      await mockWindow.sendMessage({
        args: { name: mockNetwork },
        name: 'networkChange',
      });
      expect(receivedNetworkName).toEqual(mockNetwork);

      client.off('networkChange');
    });

    test('onDisconnect', async () => {
      let disconnected = false;
      client.on('disconnect', () => {
        disconnected = true;
      });

      await mockWindow.sendMessage({
        name: 'disconnect',
      });
      expect(disconnected).toBeTruthy();

      client.off('disconnect');
    });
  });
});
