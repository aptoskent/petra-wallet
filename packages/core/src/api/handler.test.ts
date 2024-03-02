// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosClient, type Types } from 'aptos';
import type { ApprovalClient } from '../approval';
import { Storage } from '../storage';
import {
  type DappInfo,
  DefaultNetworks,
  type PersistentState,
  type PublicAccount,
} from '../types';
import PermissionService from '../utils/permissions';
import {
  ensurePayloadDeserialized,
  ensurePayloadSerialized,
} from '../serialization';
import type { TransactionOptions } from '../transactions';
import PetraApiRequestHandler from './handler';

const getChainIdSpy = jest.spyOn(AptosClient.prototype, 'getChainId');

describe(PetraApiRequestHandler, () => {
  const dappInfo: DappInfo = {
    domain: 'http://localhost:3000',
    imageURI: undefined,
    name: 'Petra',
  };

  let mockStorageData: PersistentState;
  const mockStorage: Storage<PersistentState> = {
    async get() {
      return mockStorageData;
    },
    onChange() {
      return () => {};
    },
    async set(values: Partial<PersistentState>) {
      mockStorageData = { ...mockStorageData, ...values };
    },
  };

  const mockApprovalClient = jest.mocked<ApprovalClient>({
    request: jest.fn(),
  });

  const permissionService = new PermissionService(mockStorage);

  const handler = new PetraApiRequestHandler(
    dappInfo,
    permissionService,
    mockApprovalClient,
    mockStorage,
  );

  const mockAccount: PublicAccount = {
    address: '0x42',
    publicKey: '0x24',
  };

  const recipient = '0x53';
  const amount = 717;
  const jsonPayload: Types.EntryFunctionPayload = {
    arguments: [recipient, amount],
    function: '0x1::coin::transfer',
    type_arguments: [],
  };
  const txnOptions: TransactionOptions = {
    maxGasAmount: 100,
  };
  const mockSignedTxn = '0x12345';
  const mockUserTxn = {} as Types.UserTransaction;

  beforeEach(async () => {
    mockStorageData = {} as PersistentState;
    mockApprovalClient.request.mockReset();
    getChainIdSpy.mockReset();
  });

  describe('connect', () => {
    test('no active account', async () => {
      await expect(handler.connect()).rejects.toThrow('No accounts found');
    });

    test('rejected', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.reject(new Error()),
      );
      await expect(handler.connect()).rejects.toThrow();
    });

    test('approved', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.resolve({
          account: mockAccount,
        }),
      );

      const account = await handler.connect();
      expect(account.address).toBe(mockAccount.address);
      expect(account.publicKey).toBe(mockAccount.publicKey);
    });

    test('already approved', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      await permissionService.addDomain(dappInfo.domain, mockAccount.address);
      const account = await handler.connect();
      expect(mockApprovalClient.request).not.toBeCalled();

      expect(account.address).toBe(mockAccount.address);
      expect(account.publicKey).toBe(mockAccount.publicKey);
    });
  });

  describe('isConnected', () => {
    test('no account', async () => {
      expect(await handler.isConnected()).toBeFalsy();
    });

    test('not connected', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      expect(await handler.isConnected()).toBeFalsy();
    });

    test('connected', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await permissionService.addDomain(dappInfo.domain, mockAccount.address);
      expect(await handler.isConnected()).toBeTruthy();
    });
  });

  describe('disconnect', () => {
    test('no active account', async () => {
      await expect(handler.disconnect()).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('not connected', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await expect(handler.disconnect()).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('connected', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await permissionService.addDomain(dappInfo.domain, mockAccount.address);
      await handler.disconnect();

      expect(
        await permissionService.isDomainAllowed(
          dappInfo.domain,
          mockAccount.address,
        ),
      ).toBeFalsy();
    });
  });

  describe('getAccount', () => {
    test('no account', async () => {
      await expect(handler.getAccount()).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('unauthorized', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      await expect(handler.getAccount()).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('authorized', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      await permissionService.addDomain(dappInfo.domain, mockAccount.address);
      const account = await handler.getAccount();
      expect(account.address).toBe(mockAccount.address);
      expect(account.publicKey).toBe(mockAccount.publicKey);
    });
  });

  describe('getNetwork', () => {
    test('no account', async () => {
      await expect(handler.getNetwork()).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('unauthorized', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      await expect(handler.getNetwork()).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('authorized', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      getChainIdSpy.mockResolvedValue(1);
      expect(await handler.getNetwork()).toEqual({
        chainId: '1',
        name: DefaultNetworks.Mainnet,
        url: 'https://fullnode.mainnet.aptoslabs.com',
      });

      await mockStorage.set({ activeNetworkName: DefaultNetworks.Testnet });
      getChainIdSpy.mockResolvedValue(2);
      expect(await handler.getNetwork()).toEqual({
        chainId: '2',
        name: DefaultNetworks.Testnet,
        url: 'https://fullnode.testnet.aptoslabs.com',
      });
    });
  });

  describe('signTransaction', () => {
    test('no account', async () => {
      await expect(handler.signTransaction(jsonPayload)).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('unauthorized', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await expect(handler.signTransaction(jsonPayload)).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('reject', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.reject(new Error()),
      );
      await expect(handler.signTransaction(jsonPayload)).rejects.toThrow();
    });

    test('approve without options', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.resolve({ signedTxnHex: mockSignedTxn }),
      );
      expect(await handler.signTransaction(jsonPayload)).toBe(mockSignedTxn);
      expect(mockApprovalClient.request).toHaveBeenCalledWith(dappInfo, {
        payload: jsonPayload,
        type: 'signTransaction',
      });
    });

    test('approve with options', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.resolve({ signedTxnHex: mockSignedTxn }),
      );
      expect(await handler.signTransaction(jsonPayload, txnOptions)).toBe(
        mockSignedTxn,
      );
      expect(mockApprovalClient.request).toHaveBeenCalledWith(dappInfo, {
        options: txnOptions,
        payload: jsonPayload,
        type: 'signTransaction',
      });
    });

    test('approve with serialized payload', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });

      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.resolve({ signedTxnHex: mockSignedTxn }),
      );

      const serializedPayload = ensurePayloadSerialized(jsonPayload);
      const deserializedPayload = ensurePayloadDeserialized(serializedPayload);
      expect(await handler.signTransaction(serializedPayload)).toBe(
        mockSignedTxn,
      );
      expect(mockApprovalClient.request).toHaveBeenCalledWith(dappInfo, {
        payload: deserializedPayload,
        type: 'signTransaction',
      });
    });
  });

  describe('signAndSubmitTransaction', () => {
    test('no account', async () => {
      await expect(
        handler.signAndSubmitTransaction(jsonPayload),
      ).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('unauthorized', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await expect(
        handler.signAndSubmitTransaction(jsonPayload),
      ).rejects.toThrow(
        'The requested method and/or account has not been authorized by the user.',
      );
    });

    test('reject', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.reject(new Error()),
      );
      await expect(
        handler.signAndSubmitTransaction(jsonPayload),
      ).rejects.toThrow();
    });

    test('approve', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.resolve({ userTxn: mockUserTxn }),
      );
      expect(await handler.signAndSubmitTransaction(jsonPayload)).toBe(
        mockUserTxn,
      );
      expect(mockApprovalClient.request).toHaveBeenCalledWith(dappInfo, {
        payload: jsonPayload,
        type: 'signAndSubmitTransaction',
      });
    });

    test('approve with serialized payload', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAccount.address,
        activeAccountPublicKey: mockAccount.publicKey,
      });
      await permissionService.addDomain(dappInfo.domain, mockAccount.address);

      mockApprovalClient.request.mockReturnValueOnce(
        Promise.resolve({ userTxn: mockUserTxn }),
      );
      const serializedPayload = ensurePayloadSerialized(jsonPayload);
      const deserializedPayload = ensurePayloadDeserialized(serializedPayload);
      expect(await handler.signAndSubmitTransaction(serializedPayload)).toBe(
        mockUserTxn,
      );
      expect(mockApprovalClient.request).toHaveBeenCalledWith(dappInfo, {
        payload: deserializedPayload,
        type: 'signAndSubmitTransaction',
      });
    });
  });
});
