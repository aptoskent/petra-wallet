// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import AnalyticsLayout from 'core/layout/AnalyticsLayout';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import {
  COMPANY_NAME,
  COMPANY_URL,
  DEFAULT_SEO_DESCRIPTION,
  BASE_URL,
} from '../core/constants';

import '../styles/globals.css';

const workSans = Work_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-work-sans',
});

const image = 'Petra_Card.jpg';
const imageUrl = `${BASE_URL}/${image}` as const;

export const metadata: Metadata = {
  description: DEFAULT_SEO_DESCRIPTION,
  openGraph: {
    description: DEFAULT_SEO_DESCRIPTION,
    images: [
      {
        alt: COMPANY_NAME,
        height: 600,
        type: 'image/jpeg',
        url: imageUrl,
        width: 800,
      },
    ],
    siteName: COMPANY_NAME,
    title: COMPANY_NAME,
    url: COMPANY_URL,
  },
  title: COMPANY_NAME,
  twitter: {
    card: 'summary_large_image',
    description: DEFAULT_SEO_DESCRIPTION,
    images: imageUrl,
    site: '@PetraWallet',
    title: COMPANY_NAME,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${workSans.variable}`} lang="en">
      <AnalyticsLayout>
        <body>{children}</body>
      </AnalyticsLayout>
    </html>
  );
}
