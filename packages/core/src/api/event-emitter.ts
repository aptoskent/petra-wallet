// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Storage, StorageChangesCallbackCleanup } from '../storage';
import { DefaultNetworks, PersistentState } from '../types';
import { PetraEventArgs, PetraEventName } from './events';

export type SendEventCallback = <EventName extends PetraEventName>(
  name: EventName,
  args: PetraEventArgs<EventName>,
) => void;

/**
 * Service class that emits Petra events according to changes in state.
 * Should live in the Petra context as it requires access to the state.
 */
export default class PetraEventEmitter {
  private cleanupCallback?: StorageChangesCallbackCleanup;

  constructor(
    private readonly domain: string,
    private readonly persistentStorage: Storage<PersistentState>,
    private readonly sendEventCallback: SendEventCallback,
  ) {}

  start() {
    this.cleanupCallback = this.persistentStorage.onChange(async (changes) => {
      // Note: not triggering event when the new values are undefined.
      const newAddress = changes.activeAccountAddress?.newValue;
      const newPublicKey = changes.activeAccountPublicKey?.newValue;
      if (newAddress !== undefined && newPublicKey !== undefined) {
        this.sendEventCallback('accountChange', {
          address: newAddress,
          publicKey: newPublicKey,
        });
      }

      if (
        changes.activeNetworkChainId ||
        changes.activeNetworkName ||
        changes.activeNetworkRpcUrl
      ) {
        const {
          activeNetworkChainId: storedNetworkChainId,
          activeNetworkName: storedNetworkName,
          activeNetworkRpcUrl: storedNetworkRpcUrl,
        } = await this.persistentStorage.get([
          'activeNetworkChainId',
          'activeNetworkName',
          'activeNetworkRpcUrl',
        ]);
        const chainId =
          changes.activeNetworkChainId?.newValue ?? storedNetworkChainId;
        const name =
          changes.activeNetworkName?.newValue ??
          storedNetworkName ??
          DefaultNetworks.Mainnet;
        const url =
          changes.activeNetworkRpcUrl?.newValue ?? storedNetworkRpcUrl;
        this.sendEventCallback('networkChange', {
          chainId,
          name,
          url,
        });
      }

      if (changes.aptosWalletPermissions) {
        const { activeAccountAddress } = await this.persistentStorage.get([
          'activeAccountAddress',
        ]);
        if (activeAccountAddress !== undefined) {
          const oldPermissions = changes.aptosWalletPermissions?.oldValue ?? {};
          const oldDomains = oldPermissions[activeAccountAddress] ?? [];
          const wasConnected = oldDomains.includes(this.domain);

          const newPermissions = changes.aptosWalletPermissions?.newValue ?? {};
          const newDomains = newPermissions[activeAccountAddress] ?? [];
          const isConnected = newDomains.includes(this.domain);

          if (wasConnected && !isConnected) {
            this.sendEventCallback('disconnect', undefined);
          }
        }
      }
    });
  }

  stop() {
    if (this.cleanupCallback !== undefined) {
      this.cleanupCallback();
    }
  }
}
