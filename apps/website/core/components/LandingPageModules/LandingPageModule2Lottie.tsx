// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

export default function LandingPageModule2Lottie() {
  const [animationData, setAnimationData] = useState<any>(undefined);

  useEffect(() => {
    import('../../../public/petraTransactions.json').then((data) =>
      setAnimationData(data),
    );
  }, []);

  return (
    <div className="flex justify-center items-center w-full max-h-[600px]">
      <Lottie
        loop
        animationData={animationData}
        play
        style={{
          height: '100%',
          maxHeight: '600px',
          maxWidth: '600px',
          width: '100%',
        }}
      />
    </div>
  );
}
