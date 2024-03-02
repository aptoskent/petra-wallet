// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { COMPANY_NAME, PETRA_DISCORD, PETRA_TWITTER } from 'core/constants';
import { FaDiscord, FaTwitter } from 'react-icons/fa/index';
import Link from 'next/link';
import HeaderDrawer from './HeaderDrawer';

export function PetraSalmonLogo() {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      fill="#FF5F5F"
    >
      <path d="M473.73,933.7h0c-158.66,0-287.28-128.62-287.28-287.28V170.77S473.73,66.3,473.73,66.3V933.7Z" />
      <path d="M526.27,576.86h0c158.66,0,287.28-128.62,287.28-287.28v-118.81s-287.28-104.47-287.28-104.47v510.56Z" />
    </svg>
  );
}

export function PetraLogoWithText() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      <div style={{ color: '#FF5F5F', width: '24px' }}>
        <PetraSalmonLogo />
      </div>
      <span className="text-[#172B45] text-lg">{COMPANY_NAME}</span>
    </div>
  );
}

const Header = () => (
  <div className="sticky top-0 bg-white bg-opacity-[.90] backdrop-blur-md border-b border-b-slate-200 flex justify-center z-50 w-full h-[calc(40px + 32px)] py-2 px-2 sm:px-4 md:px-16 lg:px-32 font-medium sm:h-[72px]">
    <div className="max-w-screen-2xl w-full grid grid-cols-[160px_auto]">
      <div className="flex flex-row space-x-8 items-center">
        <a href="/">
          <PetraLogoWithText />
        </a>
        <a
          href="/docs"
          aria-label="Petra Docs"
          className="sm:hidden md:block pt-[2px]"
        >
          <button type="button" aria-label="Petra Docs">
            Docs
          </button>
        </a>
      </div>
      <div className="w-full flex-wrap flex flex-row justify-end sm:space-x-2 md:space-x-6">
        <Link
          target="_blank"
          aria-label="Petra Discord"
          href="https://discord.com/invite/petrawallet"
          className="sm:hidden md:block"
        >
          <button
            type="button"
            aria-label="Petra Discord"
            className="w-full h-full text-xl"
          >
            <FaDiscord style={{ height: '24px', width: '24px' }} />
          </button>
        </Link>
        <Link
          target="_blank"
          aria-label="Petra Twitter"
          href="https://twitter.com/PetraWallet"
          className="sm:hidden md:block flex"
        >
          <button
            type="button"
            aria-label="Petra Twitter"
            className="w-full h-full"
          >
            <FaTwitter style={{ height: '20px', width: '20px' }} />
          </button>
        </Link>
        <a
          target="_blank"
          aria-label="Petra Chrome Extension"
          href="https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci"
          className="sm:hidden md:flex h-full flex flex-col justify-center align-middle"
          rel="noreferrer"
        >
          <button
            type="button"
            aria-label="Add Petra Chrome Extension to browser"
            className="rounded-lg bg-[#092F63] px-4 py-2 text-white font-normal text-sm"
          >
            Add to browser
          </button>
        </a>
        <HeaderDrawer>
          <div className="flex flex-col px-6">
            <div className="flex flex-col gap-4 pb-4">
              <a href="/docs" aria-label="Petra Docs">
                Docs
              </a>
              <a
                target="_blank"
                aria-label="Petra Twitter"
                href={PETRA_TWITTER}
                rel="noreferrer"
              >
                Twitter
              </a>
              <a
                target="_blank"
                aria-label="Petra Discord"
                href={PETRA_DISCORD}
                rel="noreferrer"
              >
                Discord
              </a>
            </div>
          </div>
        </HeaderDrawer>
      </div>
    </div>
  </div>
);

export default Header;
