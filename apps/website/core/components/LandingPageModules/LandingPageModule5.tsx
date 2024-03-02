// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import LandingPageModule5Lottie from './LandingPageModule5Lottie';

export default function LandingPageModule5() {
  return (
    <div className="flex flex-col items-center pb-16">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 max-w-screen-2xl w-full">
        <LandingPageModule5Lottie />
        <div className="flex flex-col lg:pl-32 md:pl-16 sm:px-4 md:pr-16 lg:pr-32 pb-16 md:order-last sm:order-first md:pt-32">
          <h2 className="text-4xl pt-4">New here? We got you.</h2>
          <span className="pt-4 text-[#475467]">
            We want you to feel confident onboarding into web3 with simplified
            workflows, plain-text transactions, and user safeguards. No
            confusing jargon here!
          </span>
          <span className="pt-8">
            With features like the ability to simulate transactions, we’ll make
            sure to guide you every step of the way.
          </span>
        </div>
      </div>
    </div>
  );
}
