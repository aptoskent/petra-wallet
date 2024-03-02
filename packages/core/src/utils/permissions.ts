// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Storage } from '../storage';
import { PersistentState } from '../types';

export default class PermissionService {
  constructor(private readonly storage: Storage<PersistentState>) {}

  async addDomain(domain: string, address: string) {
    const domains = await this.getDomains(address);
    domains.add(domain);
    await this.saveDomains(domains, address);
  }

  async removeDomain(domain: string, address: string) {
    const domains = await this.getDomains(address);
    domains.delete(domain);
    await this.saveDomains(domains, address);
  }

  async isDomainAllowed(domain: string, address: string) {
    const domains = await this.getDomains(address);
    return domains.has(domain);
  }

  async getAllDomains() {
    const { aptosWalletPermissions } = await this.storage.get([
      'aptosWalletPermissions',
    ]);
    return aptosWalletPermissions ?? {};
  }

  async getDomains(address: string) {
    const allDomains = await this.getAllDomains();
    return new Set(allDomains[address] ?? []);
  }

  async saveDomains(domains: Set<string>, address: string) {
    const prevValue = await this.getAllDomains();
    const newValue = { ...prevValue, [address]: Array.from(domains) };
    await this.storage.set({
      aptosWalletPermissions: newValue,
    });
  }
}
