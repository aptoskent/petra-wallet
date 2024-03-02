// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Footer from 'core/components/Footer';
import Header from 'core/components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="w-full">
    <Header />
    {children}
    <Footer />
  </div>
);

export default Layout;
