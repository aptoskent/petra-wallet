// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { SignerContext } from '@petra/core/hooks/useSigner';
import React, { PropsWithChildren } from 'react';
import getSigner from 'shared/signer';

export default function SignerProvider({ children }: PropsWithChildren) {
  return (
    <SignerContext.Provider value={getSigner}>
      {children}
    </SignerContext.Provider>
  );
}
