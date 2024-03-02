// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useDynamicConfig } from '@petra/core/flags';
import isDomainBlockListed from 'core/utils/isDomainBlocklisted';

export default function useBlockedDomains() {
  const [currentlyBlockedSites, setCurrentlyBlockedSites] = useState<
    Set<string> | undefined
  >(undefined);
  const value = useDynamicConfig('blocked-sites');

  useEffect(() => {
    const sites = value?.value == null ? [] : value?.value?.blockedDomains;
    const blockedSites: any = new Set(sites);
    setCurrentlyBlockedSites(blockedSites);
  }, [value]);

  const isDomainBlocked = useCallback(
    (domain: string) => isDomainBlockListed(domain, currentlyBlockedSites),
    [currentlyBlockedSites],
  );

  return { isDomainBlocked };
}
