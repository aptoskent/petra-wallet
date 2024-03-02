// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AccountCoinResource } from '@petra/core/queries/account';

export type RawCoinInfoWithLogo = AccountCoinResource & {
  logoUrl: string | undefined;
};

// on the assets page, the gutter between the edge of the screen and the cards
export const ASSETS_GUTTER_PADDING = 16;
// on a home page Card (Coins, NFTS, Names), the gutter between the edge of the card and the content
export const CARD_GUTTER_PADDING = 16;

// margin between two NFTs
export const nftSpacing = 4;
export const nftSpacingLarge = 7;

// extra spacing for nft rows
export const nftRowSpacing = 16;

// if there is a single nft, the width should expand to fill the width of the container
// if there is more than 1, then the max width of the nft should be 1/2 the width and also
// account for the margin separating the two images as well as the padding of the container
export function calculateMaxNftWidth(
  containerWidth: number,
  nftsQuantity: number,
) {
  return nftsQuantity < 2
    ? containerWidth - Math.ceil(2 * CARD_GUTTER_PADDING)
    : Math.floor(
        (containerWidth - Math.ceil(2 * nftSpacing + 2 * CARD_GUTTER_PADDING)) /
          2,
      );
}

export function coinBalanceDisplay(coin: AccountCoinResource): string {
  const { balance, info } = coin;
  let display: string;
  try {
    display = `${Number(balance) * 10 ** (-1 * info.decimals)}`;
  } catch {
    display = '0';
  }
  return display;
}
