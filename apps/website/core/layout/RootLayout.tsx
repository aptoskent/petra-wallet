// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Footer from 'core/components/Footer';
import Header from 'core/components/Header';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Header />
      <div className="flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
