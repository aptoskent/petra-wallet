// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface UpDownArrowsIconSVGProps {
  color?: string;
}

export default function UpDownArrowsIconSVG({
  color = 'white',
}: UpDownArrowsIconSVGProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.11641 8.39961V3.49961L3.36641 5.23294L2.31641 4.16628L5.88307 0.599609L9.46641 4.16628L8.39974 5.23294L6.63307 3.48294V8.39961H5.11641ZM10.1164 15.3663L6.54974 11.7829L7.59974 10.7329L9.34974 12.4496V7.56628H10.8664V12.4663L12.6331 10.7329L13.6997 11.7996L10.1164 15.3663Z"
        fill={color}
      />
    </svg>
  );
}
