// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { RestApiContext } from '@petra/core/hooks/useRestApi';
import React, { PropsWithChildren } from 'react';
import useCachedRestApi from 'core/hooks/useCachedRestApi';

export default function CachedRestApiProvider({ children }: PropsWithChildren) {
  const cachedRestApi = useCachedRestApi();
  return (
    <RestApiContext.Provider value={cachedRestApi}>
      {children}
    </RestApiContext.Provider>
  );
}
