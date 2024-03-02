// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosPriceInfo } from '@petra/core/hooks/useCoinGecko';

const currentSystemCurrency = 'usd';

function numberWithCommas(x: string): string {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// assume the string can only have 1 decimal
function handleFormatWithDecimal(rawString: string): string {
  const stringAsFloat = parseFloat(rawString).toFixed(2);
  return `$${numberWithCommas(stringAsFloat)}`;
}

// receives
function handleFormatIntegerString(rawString: string): string {
  // make sure to handle integer with trailing period
  const integerPart = rawString.split('.')[0];

  return `$${numberWithCommas(`${integerPart}.00`)}`;
}

// ALL ZEROS IN STRING
const regex = /^0*$/;
function treatAsInteger(rawString: string): boolean {
  // if there is no period, it's definitely an integer
  if (!rawString.includes('.')) {
    return true;
  }

  // if the last character in the string is a period, ok to treat as integer
  // ex: 123. => true
  if (rawString[rawString.length - 1] === '.') {
    return true;
  }

  // if splitting on the '.' in the string gives a value for the second string that is
  // all zeros, ok to treat as integer.
  // By this point, we know that the string includes a period and just one period.
  if (regex.test(rawString.split('.')[1])) {
    return true;
  }

  return false;
}
function formatUsd(rawString: string): string {
  if (rawString.length === 0) {
    return '$0.00';
  }

  // calling parseFloat on 12345.00 => 12345
  // calling parseFloat(12345.00).toFixed(2) => 12345.00
  if (treatAsInteger(rawString)) {
    return handleFormatIntegerString(rawString);
  }

  return handleFormatWithDecimal(rawString);
}

// with a rawString, return a value that is good to display
// function will accept strings like: 1, 1.0, 0.1, 1000, 10000.00001, 1999.,

// validations to be applied to the raw text (NOT HERE)
// it cannot start with a zero
// if it starts with a period, a zero should be prepended
// can only have 1 period

export function formatCurrencyRawString(rawString: string): string {
  switch (currentSystemCurrency) {
    case 'usd':
    default:
      return formatUsd(rawString);
  }
}

export function formatAptRawString(rawString: string): string {
  // make sure that the raw string can't arrive with a . as the first character
  if (rawString.length === 0) {
    return '0';
  }

  const splitRawString = rawString.split('.');
  if (splitRawString.length === 1) {
    return numberWithCommas(rawString);
  }

  return `${numberWithCommas(splitRawString[0])}.${splitRawString[1]}`;
}

export function trimLeadingZeros(str: string): string {
  if (str === '') return str;

  if (str[0] === '.') {
    return `0${str}`;
  }

  return str.replace(/^0+(?!\.|$)/, '');
}

// creates the raw text
export function scrubUserEntry(
  rawString: string,
  isPeriodRemoval: boolean,
  isApt: boolean = false,
): string {
  // bypass the other checks if removing a period
  if (isPeriodRemoval) {
    return rawString.slice(0, rawString.length - 1);
  }

  if (rawString.length === 0) {
    return '';
  }

  if (rawString.length === 1 && rawString[0] === '.') {
    return '0.';
  }

  // don't allow duplicate periods
  // only allow numbers and period
  const match = rawString.match(/\d*\.?\d*/);
  const matchedString = match ? match[0] : '';

  // if no decimal, return the aptString
  if (!matchedString.includes('.')) {
    return trimLeadingZeros(matchedString);
  }

  // if there is a decimal, but splitting produces a length of 1, then it's the last character
  if (matchedString.split('.').length === 1) {
    return trimLeadingZeros(matchedString);
  }

  const matchedStringTwoParts = matchedString.split('.');
  const sliceAmount = isApt ? 8 : 2;
  return `${trimLeadingZeros(
    matchedStringTwoParts[0],
  )}.${matchedStringTwoParts[1].slice(0, sliceAmount)}`;
}

export function calculateAptStringFromCurrency(
  aptosPriceInfo: AptosPriceInfo,
  newValidCurrencyRawString: string,
): string {
  // need to have a different experience if the price info is not set
  if (aptosPriceInfo?.currentPrice === undefined) {
    return '';
  }

  if (newValidCurrencyRawString.length === 0) {
    return '';
  }

  const newAptValidRawString = `${
    parseFloat(newValidCurrencyRawString) /
    parseFloat(aptosPriceInfo?.currentPrice)
  }`;
  return scrubUserEntry(newAptValidRawString, false, true);
}

export function calculateCurrencyStringFromApt(
  aptosPriceInfo: AptosPriceInfo,
  newValidAptRawString: string,
): string {
  // need to have a different experience if the price info is not set
  if (aptosPriceInfo?.currentPrice === undefined) {
    return '';
  }

  if (newValidAptRawString.length === 0) {
    // if the change in text led to no more
    return '';
  }

  const aptosPrice = parseFloat(aptosPriceInfo?.currentPrice);
  const aptAsFloat = parseFloat(newValidAptRawString);
  const newCurrencyValidRawString: string = `${aptosPrice * aptAsFloat}`;
  return scrubUserEntry(newCurrencyValidRawString, false);
}

interface NewSwitchStrings {
  newAptString: string;
  newCurrencyString: string;
}
export function handleSwitchToCurrency(
  aptRawString: string,
  currencyRawString: string,
  aptosPriceInfo: AptosPriceInfo | null | undefined,
): NewSwitchStrings {
  if (aptRawString.length === 0 || currencyRawString.length === 0) {
    return { newAptString: '', newCurrencyString: '' };
  }

  if (
    (aptRawString.length === 1 && aptRawString[0] === '.') ||
    (currencyRawString.length === 1 && currencyRawString[0] === '.')
  ) {
    return { newAptString: '', newCurrencyString: '' };
  }
  // when switching to USD
  // 1. the source of truth for the USD string needs to be truncated '43.5678' => '43.57'
  // 2. the APT source of truth needs to be updated based on this truncated value
  let newAptString: string;
  const newCurrencyString = parseFloat(currencyRawString).toFixed(2);

  const newAptCalculated = `${
    parseFloat(currencyRawString) /
    parseFloat(aptosPriceInfo?.currentPrice ?? '0')
  }`;
  const newAptSplit = newAptCalculated.split('.');

  if (newAptCalculated.includes('.')) {
    if (newAptSplit.length === 1) {
      // the period was the last thing in the string
      newAptString = newAptCalculated;
    } else {
      const aptString = `${newAptSplit[0]}.${newAptSplit[1].slice(0, 8)}`;
      newAptString = aptString;
    }
  } else {
    newAptString = newAptCalculated;
  }

  return { newAptString, newCurrencyString };
}

export function generateStringFromBigInt(total: bigint) {
  let newTotal: bigint = total;
  if (newTotal < 0) {
    // negative amount possible
    newTotal *= BigInt(-1);
  }
  const stringifiedTotalBalance: string = newTotal.toString();
  if (stringifiedTotalBalance.length <= 8) {
    return `0.${stringifiedTotalBalance}`;
  }
  const periodIndex = stringifiedTotalBalance.length - 8;
  return `${stringifiedTotalBalance.slice(
    0,
    periodIndex,
  )}.${stringifiedTotalBalance.slice(periodIndex)}`;
}

const eightZeros = '00000000';
export function convertStringToBigIntableStringWithOcta(str: string): string {
  if (str.includes('.')) {
    const splitString = str.split('.');
    // if . is the last character, add 8 zeros
    if (splitString.length === 1) {
      return `${str}${eightZeros}`;
    }
    // if the second value in the split array is already 8 characters long
    // return the first part and second part
    if (splitString[1].length === 8) {
      return `${splitString[0]}${splitString[1]}`;
    }
    // fill in the rest of the array with zeros
    const zerosToAdd = 8 - splitString[1].length;
    const zerosString = new Array(zerosToAdd).fill(0).join('');
    return `${splitString[0]}${splitString[1]}${zerosString}`;
  }
  return `${str}${eightZeros}`;
}

// current = 1.0
// next = 1.
export function shouldRemovePeriod(
  strCurrent: string,
  strNext: string,
): boolean {
  return (
    strCurrent.length > strNext.length && strNext[strNext.length - 1] === '.'
  );
}
