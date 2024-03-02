// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/**
 * A simple Hamburger Icon
 * @see https://tailwindcomponents.com/component/animated-hamburger-menu-icon
 */
export default function HamburgerIcon() {
  return (
    <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px]">
      <div className="flex flex-col justify-between w-[20px] h-[15px] origin-center overflow-hidden">
        <div className="bg-black h-[2px] w-7 origin-left" />
        <div className="bg-black h-[2px] w-7 rounded" />
        <div className="bg-black h-[2px] w-7 origin-left" />
      </div>
    </div>
  );
}
