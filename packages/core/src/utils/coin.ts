// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  AptosAccount,
  AptosClient,
  HexString,
  MaybeHexString,
  TxnBuilderTypes,
} from 'aptos';
import numbro from 'numbro';
import { CoinInfoData, DefaultNetworks, defaultNetworks } from '../types';
import {
  buildRawTransactionFromBCSPayload,
  TransactionOptions,
} from '../transactions/build';
import { getSequenceNumber } from '../queries/account';

export const APTOS_UNIT = 'APT' as const;
export const OCTA_UNIT = 'OCTA' as const;
export const PLURAL_OCTA_UNIT = `${OCTA_UNIT}S` as const;
export const OCTA_NUMBER: number = 8 as const;
export const OCTA_NEGATIVE_EXPONENT = 10 ** -OCTA_NUMBER;
export const OCTA_POSITIVE_EXPONENT = 10 ** OCTA_NUMBER;

const {
  EntryFunction,
  StructTag,
  TransactionPayloadEntryFunction,
  TypeTagStruct,
} = TxnBuilderTypes;

interface GenerateUnitStringParams {
  isLowercase: boolean;
  unitType: string;
  usePlural: boolean;
  value?: bigint;
}

/**
 * Generates the unit string for a coin (ie. APT | OCTA)
 * Can be configured to add an "S" if usePluralUnit is true
 */
const generateUnitString = ({
  isLowercase,
  unitType = APTOS_UNIT,
  usePlural,
  value,
}: GenerateUnitStringParams) => {
  let result: GenerateUnitStringParams['unitType'] | typeof PLURAL_OCTA_UNIT =
    unitType;
  if (usePlural && value !== BigInt(1) && value !== BigInt(0)) {
    switch (unitType) {
      case 'APT':
        result = unitType;
        break;
      case 'OCTA':
        result = `${unitType}S`;
        break;
      default:
        result = unitType;
        break;
    }
  }
  return isLowercase ? result.toLowerCase() : result;
};

const amountPattern = /^([0-9]*)?(?:\.([0-9]*))?$/;

export const getAmountIntegralFractional = (text: string) => {
  const sanitizedText = text.replace(',', '').replace('$', '');
  const match = sanitizedText.match(amountPattern);
  if (match === null) {
    return null;
  }

  const integral = match[1];
  const fractional = match[2];

  return { fractional, integral };
};

export interface SplitNumber {
  fractional?: string;
  integral?: string;
}

export function formatSplitNumber({ fractional, integral }: SplitNumber) {
  const formattedIntegral = numbro(integral ?? '0').format('0,0');
  const formattedFractional = fractional !== undefined ? `.${fractional}` : '';
  return `${formattedIntegral}${formattedFractional}`;
}

/**
 * Generates numeral format based on number of decimals
 * brackets (ie. [0000]) indicates format always rounds to the nearest number
 * with that format
 */
const generateNumeralFormat = (decimals: number) => {
  switch (decimals) {
    case 0:
      return '0,0';
    case 2:
      return '0,0.[00]';
    case 4:
      return '0,0.[0000]';
    case 8:
      return '0,0.[00000000]';
    default: {
      let decimalsString = '';
      for (let x = 0; x < decimals; x += 1) {
        decimalsString += '0';
      }
      return `0,0.[${decimalsString}]`;
    }
  }
};

interface NumeralTransformerParams {
  format: ReturnType<typeof generateNumeralFormat>;
  multiplier: number;
  value: bigint;
}

function zeroPad(number: bigint, decimals: number) {
  const zero = decimals - number.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + number;
}

const numeralTransformer = ({
  format,
  multiplier,
  value,
}: NumeralTransformerParams) => {
  const isNegative = value < BigInt(0);
  const positiveValue = isNegative ? value * BigInt(-1) : value;

  const inverseMultiplier = Math.ceil(multiplier ** -1);
  const integral = positiveValue / BigInt(inverseMultiplier);
  const fractional = positiveValue % BigInt(inverseMultiplier);
  const paddedFractional = zeroPad(
    fractional,
    inverseMultiplier.toString().length - 1,
  );

  const number = numbro(
    `${isNegative ? '-' : ''}${integral}.${paddedFractional}`,
  );
  return number.format(format);
};

interface FormatCoinOptions {
  decimals?: number;
  includeUnit?: boolean;
  isLowercase?: boolean;
  isNonNegative?: boolean;
  multiplier?: number;
  paramUnitType?: string;
  returnUnitType?: string;
  usePlural?: boolean;
}

export const aptToOcta = (apt: number) => apt * OCTA_POSITIVE_EXPONENT;

/**
 * Used for formatting all Aptos coins in different units, like OCTA (10^-8 APT)
 * can be easily extended in the future to include custom coins
 * @param {Number} value The value that a coin has
 * @param {FormatCoinParams} opts Specify custom properties for formatting the coin
 */
export const formatCoin = (
  value: bigint | number | undefined,
  opts: FormatCoinOptions = {},
) => {
  if (opts.isNonNegative && value && value < 0) {
    throw new Error('Value cannot be negative');
  }
  const coinValue = typeof value === 'bigint' ? value : BigInt(value ?? 0);
  const {
    decimals = value && value < OCTA_POSITIVE_EXPONENT ? 8 : 4,
    includeUnit = true,
    multiplier = OCTA_NEGATIVE_EXPONENT,
    returnUnitType = 'APT',
    paramUnitType = 'OCTA',
    usePlural = true,
    isLowercase = false,
  } = opts;
  const numeralFormat = generateNumeralFormat(decimals);

  // Format the numeral
  let transformedNumeral: string;
  if (returnUnitType === paramUnitType) {
    transformedNumeral = numeralTransformer({
      format: numeralFormat,
      multiplier: 1,
      value: coinValue,
    });
  } else {
    transformedNumeral = numeralTransformer({
      format: numeralFormat,
      multiplier,
      value: coinValue,
    });
  }

  // add units
  let units: string | null = null;
  if (includeUnit) {
    units = generateUnitString({
      isLowercase,
      unitType: returnUnitType,
      usePlural,
      value: coinValue,
    });
  }

  const result = includeUnit
    ? `${transformedNumeral} ${units}`
    : transformedNumeral;
  return result;
};

interface FormatAmountOptions {
  decimals?: number;
  prefix?: boolean;
  suffix?: boolean;
}

export function formatAmount(
  amount: number | bigint,
  coinInfo?: CoinInfoData,
  options?: FormatAmountOptions,
) {
  const { decimals, prefix } = {
    decimals: coinInfo?.decimals ?? 8,
    prefix: true,
    ...options,
  };

  const amountSign = amount > 0 ? '+' : '-';
  const amountAbs = amount > 0 ? amount : -amount;
  const multiplier = coinInfo?.decimals ? 10 ** -coinInfo.decimals : 1;
  const amountPrefix = prefix ? amountSign : '';
  const amountSuffix =
    coinInfo?.symbol && options?.suffix !== false ? ` ${coinInfo.symbol}` : '';
  const formattedAmount = formatCoin(amountAbs, {
    decimals,
    includeUnit: false,
    multiplier,
  });

  return `${amountPrefix}${formattedAmount}${amountSuffix}`;
}

interface SplitStringAmountProps {
  amount?: string;
  decimals: number;
}

/**
 * This is a critical function. It does some string manipulation
 * on the amount given to return the right bigint value with
 * decimals.
 */
export function splitStringAmount({
  amount,
  decimals,
}: SplitStringAmountProps) {
  if (decimals === undefined) {
    return {
      amountBigIntWithDecimals: BigInt(0),
      amountString: '0',
    };
  }

  const amountString = amount?.replace(/[^0-9.]/g, '') ?? '0';
  const amountIntegral = amountString.split('.')[0];
  const amountFractional = amountString.split('.')[1] ?? '';
  // This includes the decimals for the coin (ie. this would be Octa for APT)
  const amountBigIntWithDecimals = BigInt(
    `${amountIntegral}${amountFractional
      .substring(0, decimals)
      .padEnd(decimals, '0')}`,
  );

  return {
    amountBigIntWithDecimals,
    amountString,
  };
}

interface RegisterCoinProps {
  coinStructTag: string;
}

/**
 * Generates Entry Function Payload for registering a coin for a user's account
 */
export function generateRegisterCoinPayload({
  coinStructTag,
}: RegisterCoinProps) {
  let typeArgs: TxnBuilderTypes.TypeTag[] = [];
  typeArgs = [new TypeTagStruct(StructTag.fromString(coinStructTag))];

  const entryFunction = EntryFunction.natural(
    '0x1::managed_coin',
    'register',
    typeArgs,
    [],
  );

  const payload = new TransactionPayloadEntryFunction(entryFunction);
  return payload;
}

interface SubmitRegisterCoinTransactionProps {
  aptosAccount: AptosAccount;
  aptosClient: AptosClient;
  chainId?: number;
  coinStructTag: string;
  sequenceNumber?: bigint;
  txnOptions: TransactionOptions;
}

/**
 * Sign and submit a transaction to register a coin for a user's account
 */
export async function signAndSubmitRegisterCoinTransaction({
  aptosAccount,
  aptosClient,
  chainId,
  coinStructTag,
  sequenceNumber,
  txnOptions,
}: SubmitRegisterCoinTransactionProps) {
  const payload = generateRegisterCoinPayload({ coinStructTag });

  let rawTxnSequenceNumber: bigint;
  let rawTxnChainId: number;

  if (sequenceNumber && chainId) {
    rawTxnSequenceNumber = sequenceNumber;
    rawTxnChainId = chainId;
  } else {
    const [tempSequenceNumber, tempChainId] = await Promise.all([
      getSequenceNumber({ address: aptosAccount.address(), aptosClient }),
      aptosClient.getChainId(),
    ]);
    rawTxnSequenceNumber = tempSequenceNumber;
    rawTxnChainId = tempChainId;
  }

  const rawTxn = await buildRawTransactionFromBCSPayload(
    aptosAccount.address(),
    rawTxnSequenceNumber,
    rawTxnChainId,
    payload,
    txnOptions,
  );

  const signedTxnBytes = await aptosClient.signTransaction(
    aptosAccount,
    rawTxn,
  );
  const submitTxn = await aptosClient.submitTransaction(signedTxnBytes);
  const result = await aptosClient.waitForTransactionWithResult(submitTxn.hash);

  return result;
}

interface GetCoinStructTypeProps {
  address: string;
  coinName: string;
  symbol: string;
}

export const getCoinStructType = ({
  address,
  coinName,
  symbol,
}: GetCoinStructTypeProps) => `${address}::${coinName}::${symbol}` as const;

interface MintMoonCoinProps {
  amount: number | bigint;
  coinModuleAccountAddress: string;
  coinModuleAccountPrivateKey: MaybeHexString;
  coinName: string;
  mintRecipient: string;
  symbol: string;
}

/**
 * Mint MoonCoin to recipient account. Submits txn to chain.
 */
export const mintCoin = async ({
  amount,
  coinModuleAccountAddress,
  coinModuleAccountPrivateKey,
  coinName,
  mintRecipient,
  symbol,
}: MintMoonCoinProps) => {
  const creatorAccount = new AptosAccount(
    new HexString(coinModuleAccountPrivateKey.toString()).toUint8Array(),
  );

  const aptosClient = new AptosClient(
    defaultNetworks[DefaultNetworks.Testnet].nodeUrl,
  );
  const sequenceNumber = await getSequenceNumber({
    address: coinModuleAccountAddress,
    aptosClient,
  });
  const rawTxn = await aptosClient.generateTransaction(
    coinModuleAccountAddress,
    {
      arguments: [mintRecipient, amount],
      function: '0x1::managed_coin::mint',
      type_arguments: [
        getCoinStructType({
          address: coinModuleAccountAddress,
          coinName,
          symbol,
        }),
      ],
    },
    {
      sequence_number: sequenceNumber.toString(),
    },
  );

  const bcsTxn = await aptosClient.signTransaction(creatorAccount, rawTxn);

  const { hash } = await aptosClient.submitTransaction(bcsTxn);
  await aptosClient.waitForTransactionWithResult(hash);
};
