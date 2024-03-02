// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

it('renders without errors', () => {
  const root = ReactDOM.createRoot(document.createElement('div'));
  root.render(<App />);
});
