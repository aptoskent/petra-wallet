// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  formatAptRawString,
  formatCurrencyRawString,
  scrubUserEntry,
  trimLeadingZeros,
} from '../enterStakeUtils';

describe('formatCurrencyRawString', () => {
  it('handles an empty string', () => {
    const emptyString: string = '';
    const expectedFormatting = '$0.00';
    expect(formatCurrencyRawString(emptyString)).toEqual(expectedFormatting);
  });

  it('handles zeros gracefully', () => {
    const userValue: string = '0.';
    const userValue2: string = '0.0';
    const userValue3: string = '0.000000';

    const expectedFormatting = '$0.00';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
    expect(formatCurrencyRawString(userValue2)).toEqual(expectedFormatting);
    expect(formatCurrencyRawString(userValue3)).toEqual(expectedFormatting);
  });

  it('handles only integers', () => {
    const userValue: string = '12345';
    const expectedFormatting = '$12,345.00';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
  });

  it('handles a decimal place', () => {
    const userValue: string = '123.45';
    const expectedFormatting = '$123.45';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
  });

  it('rounds a decimal place to the nearest hundreths', () => {
    const userValue: string = '123.45444';
    const expectedFormatting = '$123.45';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
  });

  it('handles decimals with only 1 digit after the decimal', () => {
    const userValue: string = '5123.4';
    const expectedFormatting = '$5,123.40';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
  });

  it('handles decimals no additional digits', () => {
    const userValue: string = '123.';
    const expectedFormatting = '$123.00';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
  });

  it('handles decimals with just zero after', () => {
    const userValue: string = '123.0';
    const userValue2: string = '123.00';
    const userValue3: string = '123.000000';

    const expectedFormatting = '$123.00';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
    expect(formatCurrencyRawString(userValue2)).toEqual(expectedFormatting);
    expect(formatCurrencyRawString(userValue3)).toEqual(expectedFormatting);
  });

  it('properly rounds a decimal place to the nearest hundreths', () => {
    const userValue: string = '1999.99999';
    const expectedFormatting = '$2,000.00';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
  });

  it('handles large numbers with decimals', () => {
    const userValue: string = '123456789.123456789';
    const expectedFormatting = '$123,456,789.12';
    expect(formatCurrencyRawString(userValue)).toEqual(expectedFormatting);
  });
});

describe('formatAptRawString', () => {
  it('handles empty string', () => {
    const emptyString = '';
    const expectedOutput = '0';
    expect(formatAptRawString(emptyString)).toEqual(expectedOutput);
  });
});

describe('scrubUserEntry', () => {
  it('handles an empty string', () => {
    const emptyString = '';
    const expectedOutput = '';
    expect(scrubUserEntry(emptyString, false)).toEqual(expectedOutput);
  });

  it('handles a period', () => {
    const string = '.';
    const expectedOutput = '0.';
    expect(scrubUserEntry(string, false)).toEqual(expectedOutput);
  });

  it('handles multiple leading zeros', () => {
    const string = '000.';
    const expectedOutput = '0.';
    expect(scrubUserEntry(string, false)).toEqual(expectedOutput);
  });

  it('handles zero with period', () => {
    const string = '0.';
    const expectedOutput = '0.';
    expect(scrubUserEntry(string, false)).toEqual(expectedOutput);
  });

  it('handles trimming multiple leading zeros', () => {
    const string = '01';
    const string2 = '00001';
    const string3 = '00001.0000';
    const string4 = '000.';
    const expectedOutput = '1';
    const expectedOutput2 = '1';
    const expectedOutput3a = '1.00';
    const expectedOutput3b = '1.0000';
    const expectedOutput4 = '0.';
    expect(scrubUserEntry(string, false)).toEqual(expectedOutput);
    expect(scrubUserEntry(string2, false)).toEqual(expectedOutput2);
    expect(scrubUserEntry(string3, false)).toEqual(expectedOutput3a);
    expect(scrubUserEntry(string3, false, true)).toEqual(expectedOutput3b);
    expect(scrubUserEntry(string4, false)).toEqual(expectedOutput4);
  });
});
describe('trimLeadingZeros', () => {
  it('an empty string', () => {
    const string = '';
    const expected = '';
    expect(trimLeadingZeros(string)).toEqual(expected);
  });

  it('handles a string that is a single zero', () => {
    const string = '0';
    const expected = '0';
    expect(trimLeadingZeros(string)).toEqual(expected);
  });

  it('handles a string that starts with a period', () => {
    const string = '.';
    const expected = '0.';
    expect(trimLeadingZeros(string)).toEqual(expected);
  });

  it('handles a string with zeros and periods', () => {
    const string = '.0';
    const expected = '0.0';
    expect(trimLeadingZeros(string)).toEqual(expected);
  });

  it('handles a string with zeros and periods', () => {
    const string = '.000';
    const expected = '0.000';
    expect(trimLeadingZeros(string)).toEqual(expected);
  });
  it('handles a string with trailing zeros', () => {
    const string = '0000.0000';
    const expected = '0.0000';
    expect(trimLeadingZeros(string)).toEqual(expected);
  });
});
