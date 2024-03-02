// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { PersistentState } from '../types';
import PermissionService from '../utils/permissions';
import PetraEventEmitter, { SendEventCallback } from './event-emitter';
import MockStorage from './mock-storage';

describe(PetraEventEmitter, () => {
  const mockDomain = 'localhost';
  let mockStorage: MockStorage<PersistentState>;
  const mockSendEventCallback = jest.mocked<SendEventCallback>(jest.fn());
  let emitter: PetraEventEmitter;

  const mockAddress = '0x123';
  const mockPublicKey = '0x123';
  const mockActiveNetworkChainId = '123';
  const mockActiveNetworkName = 'Testnet';
  const mockActiveNetworkRpcUrl = 'localhost:1234';
  const mockUnrelatedDomain = 'unrelated';

  beforeEach(() => {
    mockStorage = new MockStorage();
    mockSendEventCallback.mockReset();
    emitter = new PetraEventEmitter(
      mockDomain,
      mockStorage,
      mockSendEventCallback,
    );
  });

  afterEach(() => {
    emitter.stop();
  });

  describe('lifecycle', () => {
    it("doesn't trigger an event if when not started", async () => {
      await mockStorage.set({
        activeNetworkChainId: mockActiveNetworkChainId,
        activeNetworkName: mockActiveNetworkName,
        activeNetworkRpcUrl: mockActiveNetworkRpcUrl,
      });
      expect(mockSendEventCallback).not.toHaveBeenCalled();
    });

    it("doesn't trigger an event when stopped", async () => {
      emitter.start();
      emitter.stop();
      await mockStorage.set({
        activeNetworkChainId: mockActiveNetworkChainId,
        activeNetworkName: mockActiveNetworkName,
        activeNetworkRpcUrl: mockActiveNetworkRpcUrl,
      });
      expect(mockSendEventCallback).not.toHaveBeenCalled();
    });
  });

  describe('event triggers', () => {
    beforeEach(() => {
      emitter.start();
    });

    it('triggers accountChange when the account changes', async () => {
      await mockStorage.set({
        activeAccountAddress: mockAddress,
        activeAccountPublicKey: mockPublicKey,
      });
      expect(mockSendEventCallback).toHaveBeenCalledWith('accountChange', {
        address: mockAddress,
        publicKey: mockPublicKey,
      });
    });

    it('triggers networkChange when the active network changes', async () => {
      await mockStorage.set({
        activeNetworkName: mockActiveNetworkName,
      });
      expect(mockSendEventCallback).toHaveBeenCalledWith('networkChange', {
        chainId: undefined,
        name: mockActiveNetworkName,
        url: undefined,
      });

      await mockStorage.set({
        activeNetworkChainId: mockActiveNetworkChainId,
      });
      expect(mockSendEventCallback).toHaveBeenCalledWith('networkChange', {
        chainId: mockActiveNetworkChainId,
        name: mockActiveNetworkName,
        url: undefined,
      });

      await mockStorage.set({
        activeNetworkRpcUrl: mockActiveNetworkRpcUrl,
      });
      expect(mockSendEventCallback).toHaveBeenCalledWith('networkChange', {
        chainId: mockActiveNetworkChainId,
        name: mockActiveNetworkName,
        url: mockActiveNetworkRpcUrl,
      });
    });

    it('triggers disconnect when the permission is removed', async () => {
      await mockStorage.set({ activeAccountAddress: mockAddress });
      const permissionService = new PermissionService(mockStorage);
      await permissionService.addDomain(mockDomain, mockAddress);
      expect(mockSendEventCallback).not.toHaveBeenCalled();
      await permissionService.removeDomain(mockDomain, mockAddress);
      expect(mockSendEventCallback).toHaveBeenCalledWith(
        'disconnect',
        undefined,
      );
    });

    it("it doesn't trigger disconnect when unrelated permission is removed", async () => {
      await mockStorage.set({ activeAccountAddress: mockAddress });
      const permissionService = new PermissionService(mockStorage);
      await permissionService.addDomain(mockUnrelatedDomain, mockAddress);
      expect(mockSendEventCallback).not.toHaveBeenCalled();
      await permissionService.removeDomain(mockUnrelatedDomain, mockAddress);
      expect(mockSendEventCallback).not.toHaveBeenCalled();
    });
  });
});
