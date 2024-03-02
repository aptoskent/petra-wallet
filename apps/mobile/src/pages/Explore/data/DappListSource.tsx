// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import getFavicon from 'core/utils/getFavicon';
import { Platform } from 'react-native';

import topazIcon from 'shared/assets/images/dapps/topaz.png';
import pancakeSwapIcon from 'shared/assets/images/dapps/pancakeSwap.png';
import blueMoveIcon from 'shared/assets/images/dapps/bluemove.png';
import dittoIcon from 'shared/assets/images/dapps/ditto.png';
import ariesIcon from 'shared/assets/images/dapps/aries.png';
import liquidSwapIcon from 'shared/assets/images/dapps/liquidswap.png';
import souffl3Icon from 'shared/assets/images/dapps/souffl3.png';
import argoIcon from 'shared/assets/images/dapps/argo.png';
import tsunamiIcon from 'shared/assets/images/dapps/tsunamiFinance.png';
import ablelFinanceIcon from 'shared/assets/images/dapps/abelFinance.png';
import tortugaIcon from 'shared/assets/images/dapps/tortuga.png';
import housetonSwapIcon from 'shared/assets/images/dapps/houstonSwap.png';
import kanaLabsIcon from 'shared/assets/images/dapps/kanaLabs.png';
import thalaIcon from 'shared/assets/images/dapps/thala.png';
import aptosNamesIcon from 'shared/assets/images/dapps/aptosNames.png';
import aptosSwapIcon from 'shared/assets/images/dapps/aptosSwap.png';
import aptinLabsIcon from 'shared/assets/images/dapps/aptinLabs.png';
import baptswapIcon from 'shared/assets/images/dapps/baptswap.png';

interface DApp {
  categories?: DappCategory[];
  description?: string;
  link: string;
  /**
   * An imported image
   */
  logoImage?: any;
  /**
   * The url for the favicon or other icon depeciting the DApp
   */
  logoUrl: string;
  name: string;
  /**
   * A string to test if a given URL belongs to a DApp.
   * If a user goes to the sub page of a DApp, this lets
   * us keep a consistent icon and title in our history.
   */
  tester: string;
}

enum DappCategory {
  all = 'All',
  defi = 'DeFi',
  nfts = 'NFTs',
}

const aptosNameServiceName = 'Aptos Name Service';
const dapps: DApp[] = [
  {
    categories: [DappCategory.nfts],
    description: 'The premiere NFT marketplace, built on Aptos.',
    link: 'https://topaz.so',
    logoImage: topazIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/topaz.svg',
    name: 'Topaz',
    tester: 'topaz',
  },
  {
    categories: [DappCategory.defi],
    description: 'Most popular and feature-rich DeFi DApp and AMM',
    link: 'https://aptos.pancakeswap.finance',
    logoImage: pancakeSwapIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/pancake.png',
    name: 'Pancake Swap',
    tester: 'pancakeswap',
  },
  {
    categories: [DappCategory.nfts],
    description: 'Names for the metaverse',
    link: 'https://aptosnames.com',
    logoImage: aptosNamesIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/aptosnameservice.jpeg',
    name: aptosNameServiceName,
    tester: 'aptosnames',
  },
  {
    categories: [DappCategory.defi],
    description: 'Lending, Borrowing and Leverage Trading DEX',
    link: 'https://ariesmarkets.xyz/',
    logoImage: ariesIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/Aries.png',
    name: 'Aries Markets',
    tester: 'ariesmarkets',
  },
  {
    categories: [DappCategory.defi],
    description: 'Safely exchange your favorite coins',
    link: 'https://liquidswap.com/#/',
    logoImage: liquidSwapIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/liquidswap.svg',
    name: 'Liquidswap',
    tester: 'liquidswap',
  },
  {
    categories: [DappCategory.defi],
    description: 'Cutting edge liquid staking on Aptos',
    link: 'https://stake.dittofinance.io/',
    logoImage: dittoIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/ditto.png',
    name: 'Ditto Finance',
    tester: 'dittofinance',
  },
  {
    categories: [DappCategory.defi],
    description: 'The first lending protocol on Aptos',
    link: 'https://Aptin.io',
    logoImage: aptinLabsIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/aptin.jpg',
    name: 'Aptin Labs',
    tester: 'aptin',
  },
  {
    categories: [DappCategory.defi],
    description: 'Token Swap Platform on APTOS',
    link: 'https://aptoswap.net',
    logoImage: aptosSwapIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/aptoswap.png',
    name: 'Aptoswap',
    tester: 'aptoswap',
  },
  {
    categories: [DappCategory.nfts],
    description: 'Next-gen Smart Trading NFT Marketplace',
    link: 'https://souffl3.com',
    logoImage: souffl3Icon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/souffl3.png',
    name: 'Souffl3',
    tester: 'souffl3',
  },
  {
    categories: [DappCategory.defi],
    description: 'Overcollateralized stablecoin and lending protocol',
    link: 'https://argo.fi',
    logoImage: argoIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/argo.png',
    name: 'Argo',
    tester: 'argo',
  },
  {
    categories: [DappCategory.defi],
    description: 'Trade spot & perpetuals with 0% slippage.',
    link: 'https://tsunami.finance',
    logoImage: tsunamiIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/tsunami.svg',
    name: 'Tsunami Finance',
    tester: 'tsunami',
  },
  {
    categories: [DappCategory.defi],
    description: 'The First Cross-Chain Lending Platform. Build on Aptos& Sui',
    link: 'https://www.abelfinance.xyz/#/markets',
    logoImage: ablelFinanceIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/abelfinance.png',
    name: 'Abel Finance',
    tester: 'abelfinance',
  },
  {
    categories: [DappCategory.defi],
    description: 'Stake on Aptos without locking your funds!',
    link: 'https://app.tortuga.finance',
    logoImage: tortugaIcon,
    logoUrl: 'https://cdn.martianwallet.xyz/seeker/dapps/tortuga.webp',
    name: 'Tortuga',
    tester: 'tortuga',
  },
  {
    categories: [DappCategory.defi],
    description: 'Swap',
    link: 'https://houstonswap.io/',
    logoImage: housetonSwapIcon,
    logoUrl:
      'https://houstonswap.io/wp-content/uploads/2022/09/cropped-token-circle-crop-180x180.png',
    name: 'HoustonSwap',
    tester: 'houstonswap',
  },
  {
    categories: [DappCategory.defi],
    description: 'Lending & Swap',
    link: 'https://app.kanalabs.io/',
    logoImage: kanaLabsIcon,
    logoUrl: 'https://app.kanalabs.io/logo192.png',
    name: 'Kana Labs',
    tester: 'kanalabs',
  },
  {
    categories: [DappCategory.defi],
    description: 'Swap',
    link: 'https://app.thala.fi/',
    logoImage: thalaIcon,
    logoUrl: 'https://app.thala.fi/apple-touch-icon.png',
    name: 'Thala Labs',
    tester: 'thala',
  },
  {
    categories: [DappCategory.nfts],
    description: 'NFT Marketplace',
    link: 'https://bluemove.net/',
    logoImage: blueMoveIcon,
    logoUrl: 'https://bluemove.net/BlueMove_main_logo_RGB-Blue_250.png',
    name: 'BlueMove',
    tester: 'bluemove',
  },
  {
    categories: [DappCategory.defi],
    description: 'Swap',
    link: 'https://baptswap.com/',
    logoImage: baptswapIcon,
    logoUrl: 'https://baptswap.com/HEAD_Positive.png',
    name: 'Baptswap',
    tester: 'baptswap',
  },
].map((dapp) => ({
  ...dapp,
  categories: dapp.categories.concat(DappCategory.all),
}));

dapps.sort((a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
});

interface ExploreTabs {
  dappTabs: DappCategory[];
  dapps: DApp[];
}

/**
 * iOS can't show NFT based dapps in the explore recomendations.
 * Android and other platforms can show everything.
 */
function getExploreTabs(): ExploreTabs {
  const isiOS = Platform.OS === 'ios';
  const allCategories = Object.values(DappCategory);
  const categories = allCategories.filter((c) => c !== DappCategory.all);
  const iOSTabs = categories.filter((c) => c !== DappCategory.nfts);

  return {
    dappTabs: isiOS ? iOSTabs : categories,
    dapps: isiOS ? [] : dapps,
  };
}

function getDappFromUrl(url: string) {
  const dapp = dapps.find((d) =>
    url.toLowerCase().includes(d.tester.toLowerCase()),
  );

  return {
    ...(dapp ?? {}),
    logoImage: dapp?.logoImage,
    logoUrl: getFavicon(url),
  };
}

export { DappCategory, getExploreTabs, getDappFromUrl, dapps as allDapps };
export type { DApp };
