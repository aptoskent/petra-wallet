// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Outlet } from 'react-router-dom';
import FullscreenLayout from '../layouts/FullscreenLayout';

export default function Keystone() {
  return (
    <FullscreenLayout>
      <Outlet />
    </FullscreenLayout>
  );
}
