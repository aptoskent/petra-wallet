// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

const ControlsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={72} height={72} fill="none">
    <path fill="#3E8E88" d="M67.5 16.5h-63V24h63v-7.5Z" />
    <path fill="#324459" d="M67.5 51h-63v7.5h63V51Z" />
    <circle cx={27} cy={54} r={15} fill="#B8E0DD" />
    <path fill="#B8E0DD" d="M33 6h27v27H33z" />
    <path
      fill="#324459"
      fillRule="evenodd"
      d="M33 24v-7.5h27V24H33Z"
      clipRule="evenodd"
    />
    <path
      fill="#3E8E88"
      fillRule="evenodd"
      d="M41.313 58.5c.447-1.42.687-2.932.687-4.5 0-1.027-.103-2.03-.3-3H12.3c-.197.97-.3 1.973-.3 3 0 1.568.24 3.08.687 4.5h28.626Z"
      clipRule="evenodd"
    />
  </svg>
);
export default ControlsIcon;
