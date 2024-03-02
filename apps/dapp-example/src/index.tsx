// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

declare global {
  interface Window { aptos: any; }
}

const root = createRoot(document.getElementById('root') as Element);

window.addEventListener('load', () => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
