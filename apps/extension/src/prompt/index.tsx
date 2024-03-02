// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Root from 'core/Root';
import Prompt from './Prompt';
import { PromptStateProvider } from './hooks';

const root = createRoot(document.getElementById('prompt') as Element);
root.render(
  <Root>
    <PromptStateProvider>
      <Prompt />
    </PromptStateProvider>
  </Root>,
);
