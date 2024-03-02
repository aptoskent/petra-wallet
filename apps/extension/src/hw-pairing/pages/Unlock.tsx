// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Password from 'pages/Password';
import FullscreenLayout from '../layouts/FullscreenLayout';
import {
  FullscreenExtensionContainer,
  FullscreenExtensionContainerBody,
} from '../layouts/ExtensionContainerLayout';

export default function LedgerPair() {
  return (
    <FullscreenLayout>
      <FullscreenExtensionContainer bgColor="navy.900">
        <FullscreenExtensionContainerBody>
          <Password />
        </FullscreenExtensionContainerBody>
      </FullscreenExtensionContainer>
    </FullscreenLayout>
  );
}
