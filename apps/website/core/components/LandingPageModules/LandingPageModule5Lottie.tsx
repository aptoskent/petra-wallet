// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

export default function LandingPageModule5Lottie() {
  const [animationData, setAnimationData] = useState<any>(undefined);

  useEffect(() => {
    import('../../../public/newHere.json').then((data) =>
      setAnimationData(data),
    );
  }, []);

  return (
    <div className="w-full flex justify-center items-center sm:pb-8">
      <div className="rounded-3xl overflow-hidden">
        <Lottie
          loop
          animationData={animationData}
          play
          style={{
            height: '100%',
            maxWidth: '500px',
            minWidth: '375px',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}
