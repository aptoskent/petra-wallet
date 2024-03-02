// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import CoinbasePayLogo from '../CoinbasePayLogo';
import MoonpayLogo from '../MoonpayLogo';
import LandingPageModule2Lottie from './LandingPageModule2Lottie';

export default function LandingPageModule2() {
  return (
    <div className="flex flex-col items-center">
      <div className="sm:flex sm:flex-col sm:gap-2 sm:grid-cols-1 md:grid md:grid-cols-2 max-w-screen-2xl w-full">
        <LandingPageModule2Lottie />
        <div className="flex flex-col lg:pl-32 md:pl-16 sm:px-4 md:pr-16 lg:pr-32 pb-16 md:order-last sm:order-first md:pt-32 sm:max-h-[250px] md:max-h-[700px]">
          <h2 className="text-4xl pt-4">Buy, swap, and send in seconds</h2>
          <span className="pt-4 text-[#475467]">
            With Petra, transacting on Aptos has never been easier. Our
            industry-leading partners and Aptos’ scalable, lightning-fast
            protocol lets you buy APT, send tokens and experience the magic of
            web3 in moments.
          </span>
          <div className="ml-[-8px] flex flex-row sm:hidden md:flex sm:gap-0 md:gap-2 lg:gap-4 py-8 md:flex-wrap lg:flex-nowrap">
            <a
              href="https://www.coinbase.com/cloud/products/pay-sdk"
              target="_blank"
              className="w-48 flex items-center rounded-lg outline-1 pt-1"
              rel="noreferrer"
              aria-label="Coinbase Pay"
            >
              <CoinbasePayLogo />
            </a>
            <a
              href="https://www.moonpay.com"
              target="_blank"
              className="w-48 flex items-center rounded-lg outline-1 md:ml-[-20px]"
              rel="noreferrer"
              aria-label="Moonpay"
            >
              <MoonpayLogo />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
