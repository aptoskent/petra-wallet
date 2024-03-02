// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { RawCoinInfo as CoinInfo } from '@manahippo/coin-list';

/*
  Add commas to numbers
  @param {string} num - the string of a number with decimals
  @return {string} the string of number with commas
*/
export const numToGrouped = (num: string) => {
  const parts = num.split('.');

  const [wholePart, fractionalPart] = parts;

  const wholePartWithDecimals = wholePart
    .split('')
    .map((digit, index) => {
      const revertIndex = wholePart.length - index;
      if ((revertIndex - 1) % 3 === 0 && revertIndex !== 1) {
        return `${digit},`;
      }
      return digit;
    })
    .join('');

  // no decimals
  if (!fractionalPart) {
    return wholePartWithDecimals;
  }

  // has decimals
  return [wholePartWithDecimals, fractionalPart].join('.');
};

/*
  Return the string of number with correct decimals
  @param {string} value - the string of a number with decimals
  @param {number} maxDecimals - the maximum accepted decimals for the number
  @return {string} the string of number with correct number of decimals
*/
export const cutDecimals = (value: string, maxDecimals: number | undefined) => {
  const parts = value.split('.');

  const [wholePart, decimalPart] = parts;
  const decimalsLength = decimalPart?.length || 0;

  if (typeof maxDecimals !== 'number' || decimalsLength <= maxDecimals) {
    return value;
  }

  if (/^[\d]+\.$/.test(value)) {
    return value.replace('.', '');
  }

  return [wholePart, decimalPart.slice(0, maxDecimals)].join('.');
};

/*
  Return the string of number without scientific notations or exponent (123e8 -> '12300000000')
  @param {number} x - the number with sciencetific notations
  @return {string} the string of number without scientific notation
*/
export const parseScientificNotation = (x: number) => {
  // return x if greater than 0 because x.toString will take care of the scientific exponent
  if (Math.abs(x) >= 1.0) return x.toString();

  const scientificPart = parseInt(x.toString().split('e-')[1], 10);

  // no scientific exponent, return string x
  if (!scientificPart) return x.toString();

  const y = Math.abs(x) * 10 ** (scientificPart - 1);

  // create a string of zeroes from scientificPart part
  const zeroes = new Array(scientificPart).join('0');

  // positive
  if (x > 0) {
    return `0.${zeroes}${y.toString().substring(2)}`;
  }

  // negative
  return `-0.${zeroes}${y.toString().substring(2)}`;
};

/*
  Return the string of number with correct decimals, comma separated and no scientific notation
  @param {number} amount - the amount to be formatted
  @param {number} decimals - the maximum number of decimals
  @return {string} the string of number
*/
export const numberGroupFormat = (amount: number, decimals = 2) =>
  numToGrouped(cutDecimals(parseScientificNotation(amount), decimals));

const coinFormatter = (
  amount?: number | null,
  coinInfo?: CoinInfo | null,
): string => {
  if (typeof amount !== 'number' || amount < 0 || !coinInfo) {
    return '';
  }

  const { decimals } = coinInfo;
  return numberGroupFormat(amount, decimals);
};

export default coinFormatter;
