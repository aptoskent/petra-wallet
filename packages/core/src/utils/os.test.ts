// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

import { OS, getOS } from './os';

describe(getOS, () => {
  describe('when window is defined', () => {
    let platform: jest.SpyInstance;
    let userAgent: jest.SpyInstance;

    beforeEach(() => {
      platform = jest.spyOn(window.navigator, 'platform', 'get');
      userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('android', () => {
      userAgent.mockReturnValue(`Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) 
        AppleWebKit/535.19 (KHTML, like Gecko) 
        Chrome/18.0.1025.133 Mobile Safari/535.19`);
      expect(getOS()).toBe(OS.ANDROID);
    });

    test('ios', () => {
      platform.mockReturnValue('iPad');
      expect(getOS()).toBe(OS.IOS);
    });

    test('linux', () => {
      platform.mockReturnValue('Linux x86_64');
      expect(getOS()).toBe(OS.LINUX);
    });

    test('mac', () => {
      platform.mockReturnValue('Macintosh');
      expect(getOS()).toBe(OS.MAC);
    });

    test('windows', () => {
      platform.mockReturnValue('Win64');
      expect(getOS()).toBe(OS.WINDOWS);
    });
  });

  describe('when window is not defined', () => {
    it('returns null', () => {
      expect(getOS()).toBe(null);
    });
  });
});
