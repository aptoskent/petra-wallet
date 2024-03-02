// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  APTOS_PRIVACY,
  APTOS_WEBSITE,
  PETRA_DISCORD,
  PETRA_TERMS,
  PETRA_TWITTER,
} from 'core/constants';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { PetraSalmonLogo } from './Header';

export default function Footer() {
  return (
    <div className="bg-[url('/PetraFooterBg.webp')] sm:px-4 md:px-16 lg:px-32 py-16 text-white gap-8 flex justify-center">
      <div className="grid grid-cols-2 justify-between max-w-screen-2xl w-full">
        <div className="flex flex-col gap-6 pr-2">
          <div className="flex flex-row gap-1">
            <div className="w-12">
              <PetraSalmonLogo />
            </div>
            <div className="flex items-center">
              <span className="text-3xl">Petra</span>
            </div>
          </div>
          <span className="text-white font-light text-sm pl-2">
            Your gateway to the Aptos ecosystem
          </span>
        </div>
        <div className="flex justify-end">
          <div className="grid grid-cols-2 font-light text-sm sm:gap-4 md:gap-24">
            <div className="flex flex-col sm:gap-0 md:gap-4">
              <a
                href="/docs"
                className="sm:h-[48px] md:h-auto"
                aria-label="Petra docs"
              >
                Docs
              </a>
              <a
                href={APTOS_WEBSITE}
                target="_blank"
                rel="noreferrer"
                aria-label="Aptos Labs website"
                className="sm:h-[48px] md:h-auto"
              >
                Aptos Labs
              </a>
              <a
                href={APTOS_PRIVACY}
                target="_blank"
                className="sm:h-[48px] md:h-auto"
                aria-label="Aptos Labs Privacy Policy"
                rel="noreferrer"
              >
                Privacy
              </a>
              <a
                className="sm:h-[48px] md:h-auto"
                href={PETRA_TERMS}
                target="_blank"
                aria-label="Petra Terms of Service"
                rel="noreferrer"
              >
                Terms of Service
              </a>
            </div>
            <div className="flex flex-col sm:gap-0 md:gap-4">
              <span className="font-semibold sm:h-[36px] md:h-auto">
                Connect with us
              </span>
              <a
                href={PETRA_TWITTER}
                target="_blank"
                className="flex flex-row items-center gap-2 sm:h-[48px] md:h-auto"
                rel="noreferrer"
                aria-label="Petra Twitter"
              >
                <div>
                  <FaTwitter width={48} />
                </div>
                <span>Twitter</span>
              </a>
              <a
                href={PETRA_DISCORD}
                target="_blank"
                className="flex flex-row items-center gap-2 sm:h-[48px] md:h-auto"
                rel="noreferrer"
                aria-label="Petra Discord"
              >
                <div>
                  <FaDiscord width={48} />
                </div>
                <span>Discord</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
