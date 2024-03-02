// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import LandingPageModule1 from 'core/components/LandingPageModules/LandingPageModule1';
import LandingPageModule2 from 'core/components/LandingPageModules/LandingPageModule2';
import LandingPageModule3 from 'core/components/LandingPageModules/LandingPageModule3';
import LandingPageModule4 from 'core/components/LandingPageModules/LandingPageModule4';
import LandingPageModule5 from 'core/components/LandingPageModules/LandingPageModule5';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full gap-16">
      <LandingPageModule1 />
      <LandingPageModule2 />
      <LandingPageModule3 />
      <LandingPageModule4 />
      <LandingPageModule5 />
    </div>
  );
}
