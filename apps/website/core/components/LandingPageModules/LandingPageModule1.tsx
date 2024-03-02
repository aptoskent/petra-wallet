// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @next/next/no-img-element */

'use client';

import {
  ECONIA_URL,
  LAYER_ZERO_URL,
  PANCAKE_SWAP_URL,
  PETRA_APPLE_APP_STORE,
  PETRA_CHROME_STORE,
  PETRA_GOOGLE_PLAY_STORE,
  PONTEM_URL,
  PYTH_URL,
  TOPAZ_URL,
} from 'core/constants';
import QRCode from 'react-qr-code';
import ChromeWebStore from '../ChromeWebStore';
import Badge from '../Badge';
import AppStore from '../AppStore';
import PlayStore from '../PlayStore';
import AptosLabsLogo from '../AptosLabsLogo';
import TopazLogo from '../TopazLogo';
import PontemLogo from '../PontemLogo';
import EconiaLogo from '../EconiaLogo';
import PythLogo from '../PythLogo';
import LayerZeroLogo from '../LayerZeroLogo';
import PancakeSwapLogo from '../PancakeSwapLogo';

declare global {
  interface Window {
    mobile_modal: {
      showModal: () => void;
    };
  }
}

export default function LandingPageModule1() {
  return (
    <div className="flex flex-col items-center">
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 max-w-screen-2xl">
        <div className="flex flex-col sm:px-4 md:px-16 sm:py-16 md:py-24 lg:py-32 xl:py-48 md:pr-16 lg:px-32 lg:pr-32">
          <Badge text="New!">Mobile app</Badge>
          <h1 className="text-5xl pt-4">A web3 wallet to explore Aptos</h1>
          <span className="pt-6 text-[#475467]">
            Petra makes it easy to store your assets, transact with friends, and
            connect with apps on the Aptos blockchain.
          </span>
          <div className="flex flex-row sm:hidden md:flex gap-4 py-8 pt-10">
            <a
              href={PETRA_CHROME_STORE}
              aria-label="Chrome Web Store link for Petra Extension"
              target="_blank"
              className="flex justify-center w-48 rounded-lg ring-1 ring-slate-600"
              rel="noreferrer"
            >
              <ChromeWebStore />
            </a>
            <div>
              <button
                className="px-4 py-2 rounded-lg ring-1 ring-slate-600 h-16 text-xl"
                type="button"
                aria-label="Mobile link"
                onClick={() => window.mobile_modal.showModal()}
              >
                📱 Mobile app
              </button>
              <dialog id="mobile_modal" className="modal">
                <form method="dialog" className="modal-box max-w-[36rem]">
                  <button
                    type="submit"
                    formMethod="dialog"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  >
                    ✕
                  </button>
                  <h3 className="font-medium text-xl">Scan QR Code</h3>
                  <div className="py-4">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <span className="flex flex-col">iOS</span>
                        <div className="w-full h-full items-center justify-center">
                          <QRCode
                            value={PETRA_APPLE_APP_STORE}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="flex flex-col">Android</span>
                        <div className="w-full h-full items-center justify-center">
                          <QRCode
                            value={PETRA_GOOGLE_PLAY_STORE}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <form method="dialog" className="modal-backdrop">
                  <button type="button">close</button>
                </form>
              </dialog>
            </div>
          </div>
          <div className="flex flex-row md:hidden sm:flex gap-4 py-8">
            <a href={PETRA_APPLE_APP_STORE} target="_blank" rel="noreferrer">
              <div className="w-36">
                <AppStore />
              </div>
            </a>
            <a href={PETRA_GOOGLE_PLAY_STORE} target="_blank" rel="noreferrer">
              <div className="w-36">
                <PlayStore />
              </div>
            </a>
          </div>
          <div className="flex flex-row gap-1 sm:pb-4 items-center">
            <span className="text-[#121919]">By</span>
            <a
              href="https://aptoslabs.com"
              target="_blank"
              className="w-20 sm:h-[48px] md:h-auto flex justify-center"
              rel="noreferrer"
              aria-label="Aptos labs logo"
            >
              <AptosLabsLogo />
            </a>
          </div>
        </div>
        <div className="relative">
          <img
            src="/Hero.webp"
            alt="Petra hero background"
            className="h-full sm:min-h-[450px] sm:max-h-[500px] md:max-h-[650px] lg:max-h-[none] md:min-h-[650px] m:h-full lg:h-full xl:h-full object-cover"
          />
          <div className="absolute bottom-0 w-full flex justify-center">
            <img
              className="sm:w-[300px] md:w-[450px] lg:w-[500px] xl:w-[500px]"
              src="/GroupHero.webp"
              alt="Petra mobile hero"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col py-16 gap-12 bg-[#95D0CC] w-full items-center">
        <span className="w-full text-sm sm:px-4 text-center">
          Integrated into popular dApps like Topaz, Thala, Pontem and 160+ more
        </span>
        <div className="grid sm:gap-8 sm:grid-cols-2 md:grid-cols-3 md:px-24 lg:grid-cols-6 lg:gap-0 max-w-screen-2xl">
          <a
            href={TOPAZ_URL}
            target="_blank"
            className="flex justify-center items-center sm:h-[48px] md:h-auto"
            rel="noreferrer"
            aria-label="Topaz.so NFT Marketplace"
          >
            <TopazLogo />
          </a>
          <a
            href={PONTEM_URL}
            target="_blank"
            className="flex justify-center items-center sm:h-[48px] md:h-auto"
            rel="noreferrer"
            aria-label="Pontem.network wallet, swap, and more"
          >
            <PontemLogo />
          </a>
          <a
            href={ECONIA_URL}
            target="_blank"
            className="flex justify-center items-center sm:h-[48px] md:h-auto"
            rel="noreferrer"
            aria-label="Econialabs.com central limit order book"
          >
            <EconiaLogo />
          </a>
          <a
            href={PYTH_URL}
            target="_blank"
            className="flex justify-center items-center sm:h-[48px] md:h-auto"
            rel="noreferrer"
            aria-label="Pyth.network realtime oracle"
          >
            <PythLogo />
          </a>
          <a
            href={LAYER_ZERO_URL}
            target="_blank"
            className="flex justify-center items-center sm:h-[48px] md:h-auto"
            rel="noreferrer"
            aria-label="Layerzero.network bridge"
          >
            <LayerZeroLogo />
          </a>
          <a
            href={PANCAKE_SWAP_URL}
            target="_blank"
            className="flex justify-center items-center sm:h-[48px] md:h-auto min-w-[150px]"
            rel="noreferrer"
            aria-label="Pancake.swap decentralized exchange and liquidity pool"
          >
            <PancakeSwapLogo />
          </a>
        </div>
      </div>
    </div>
  );
}
