// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { encodeQRCode, useScanner } from 'core/utils/scanner';

jest.mock('core/utils/helpers');

const mockEthCoinInfo = {
  info: {
    decimals: 8,
    name: 'Ethereum Coin',
    symbol: 'ETH',
    type: '0x1::ethereum_coin::EthereumCoin',
  },
};
const mockAptCoinInfo = {
  info: {
    decimals: 8,
    name: 'Aptos Coin',
    symbol: 'APT',
    type: '0x1::aptos_coin::AptosCoin',
  },
};
jest.mock('shared/constants', () => ({
  APTOS_COIN_INFO: {
    decimals: 8,
    name: 'Aptos Coin',
    symbol: 'APT',
    type: '0x1::aptos_coin::AptosCoin',
  },
}));

jest.mock('pages/Send/hooks/useAccountCoinResources', () => ({
  useAccountCoinResources: () => ({
    data: [mockEthCoinInfo, mockAptCoinInfo],
  }),
}));

describe('scanner', () => {
  const { useRedirectWithQRData } = useScanner();
  const addressTest =
    '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8';

  const encodedQrAddressTest = encodeQRCode(addressTest);

  const contactResult1 = {
    contact: {
      address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
    },
  };

  const contactResult2 = {
    coinInfo: {
      decimals: 8,
      name: 'Ethereum Coin',
      symbol: 'ETH',
      type: '0x1::ethereum_coin::EthereumCoin',
    },
    contact: {
      address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
    },
  };

  const contactResult3 = {
    amount: '2',
    coinInfo: {
      decimals: 8,
      name: 'Aptos Coin',
      symbol: 'APT',
      type: '0x1::aptos_coin::AptosCoin',
    },
    contact: {
      address:
        '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
    },
  };

  it('encodes Url for QR code', () => {
    expect(encodedQrAddressTest).toBe(
      'HTTPS://PETRA.APP/RECEIVE?ADDRESS=0XC548E1A9BE477F2DD3EC381DA1E000A3B1108D86C7F847F70FA54002DDCF72B8',
    );
    expect(encodeQRCode(addressTest, 'APT', '2')).toBe(
      'HTTPS://PETRA.APP/RECEIVE?ADDRESS=0XC548E1A9BE477F2DD3EC381DA1E000A3B1108D86C7F847F70FA54002DDCF72B8&SYM=APT&AMOUNT=2',
    );
  });

  it('returns correct redirection from decoded data', () => {
    expect(
      useRedirectWithQRData({
        address:
          '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
      }),
    ).toStrictEqual(['SendFlow2', contactResult1]);

    expect(
      useRedirectWithQRData({
        address:
          '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
        sym: 'ETH',
      }),
    ).toStrictEqual(['SendFlow3', contactResult2]);

    expect(
      useRedirectWithQRData({
        address:
          '0xc548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b8',
        amount: '2',
        sym: 'APT',
      }),
    ).toStrictEqual(['SendFlow4', contactResult3]);
  });
});
