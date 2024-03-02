// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { RestApiContext } from '@petra/core/hooks/useRestApi';
import React, { PropsWithChildren } from 'react';
import useWebRestApi from '@petra/core/hooks/useWebRestApi';

export default function WebRestApiProvider({ children }: PropsWithChildren) {
  const webRestApi = useWebRestApi();
  return (
    <RestApiContext.Provider value={webRestApi}>
      {children}
    </RestApiContext.Provider>
  );
}
