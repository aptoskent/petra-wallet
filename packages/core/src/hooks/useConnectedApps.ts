// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppStorage } from './useStorage';
import PermissionService from '../utils/permissions';
import { useActiveAccount } from './useAccounts';

export class App {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  get domain(): string {
    return this.url.replace(/^https?:\/\/(www\.)?/, '');
  }

  get favicon(): string {
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=64&url=${this.url}`;
  }
}

export function useConnectedApps() {
  const [connectedApps, setConnectedApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { activeAccountAddress } = useActiveAccount();
  const { persistentStorage } = useAppStorage();
  const permissionService = useMemo(
    () => new PermissionService(persistentStorage),
    [persistentStorage],
  );

  const getConnectedApps = useCallback(
    async (address: string) => {
      const urls = await permissionService.getDomains(address);
      const apps = Array.from(urls).map((url) => new App(url));
      apps.sort((a, b) => a.domain.localeCompare(b.domain));

      return apps;
    },
    [permissionService],
  );

  const fetchConnectedApps = useCallback(
    (address: string) => {
      setIsLoading(true);
      getConnectedApps(address).then((apps: App[]) => {
        setConnectedApps(apps);
        setIsLoading(false);
      });
    },
    [getConnectedApps],
  );

  const revokeApp = useCallback(
    async (app: App) =>
      permissionService
        .removeDomain(app.url, activeAccountAddress)
        .then(() => fetchConnectedApps(activeAccountAddress)),
    [activeAccountAddress, fetchConnectedApps, permissionService],
  );

  useEffect(() => {
    fetchConnectedApps(activeAccountAddress);
  }, [activeAccountAddress, fetchConnectedApps]);

  return { connectedApps, isLoading, revokeApp };
}
