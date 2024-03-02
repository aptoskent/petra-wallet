// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import LandingPage from 'core/components/LandingPage';
import RootLayout from 'core/layout/RootLayout';
import type { NextPage } from 'next';

const Home: NextPage = () => (
  <RootLayout>
    <LandingPage />
  </RootLayout>
);

export default Home;
