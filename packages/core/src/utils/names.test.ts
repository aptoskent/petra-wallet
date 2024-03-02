// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { AptosName, getAddressFromName, getNameFromAddress } from './names';

jest.mock('axios');
const mockAxios = jest.mocked(axios, { shallow: false });

describe(AptosName, () => {
  it('normalizes the input', () => {
    const name = new AptosName('CAPS.apt');
    expect(name.toString()).toBe('caps.apt');
  });

  it('can be rendered via string interpolation', () => {
    const name = new AptosName('foobar.apt');
    expect(`name: ${name}`).toBe('name: foobar.apt');
  });

  it('prevents situations with duplicate suffixes', () => {
    const name = new AptosName('dupe.apt.apt');
    expect(name.toString()).toBe('dupe.apt');
    expect(name.noSuffix()).toBe('dupe');
  });
});

describe(getAddressFromName, () => {
  it('returns an address given a name', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { address: '0x1' } });
    const name = new AptosName('root');
    expect(await getAddressFromName(name, 'mainnet')).toBe('0x1');
  });
});

describe(getNameFromAddress, () => {
  it('returns a name given an address', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { name: 'root' } });
    expect((await getNameFromAddress('0x1', 'mainnet'))!.toString()).toBe(
      'root.apt',
    );
  });
});
