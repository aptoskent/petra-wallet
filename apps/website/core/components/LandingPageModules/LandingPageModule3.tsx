// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import LandingPageModule3Lottie from './LandingPageModule3Lottie';

export default function LandingPageModule3() {
  return (
    <div className="flex flex-col items-center">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 w-full max-w-screen-2xl">
        <LandingPageModule3Lottie />
        <div className="flex flex-col lg:pl-32 md:pl-16 sm:px-4  md:pr-16 lg:pr-32 pb-16 md:pt-32 md:order-first sm:order-first">
          <h2 className="text-4xl pt-4">A home for your digital assets</h2>
          <span className="pt-4 text-[#475467]">
            Safely store and manage all your assets in Petra, a self-custodial
            wallet. Whether it’s the latest NFT drop, a prized collectible, or
            any other token - we support it all.
          </span>
        </div>
      </div>
    </div>
  );
}
