// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  AptosClient,
  BCS,
  type MaybeHexString,
  TxnBuilderTypes,
  Types,
} from 'aptos';
import {
  aptosAccountCoinTransferFunctionName,
  aptosAccountCreateAccountViaTransferFunctionName,
  aptosAccountNamespace,
  aptosCoinStructTag,
} from '../constants';
import { JsonPayload } from '../serialization';
import { getServerTime } from '../utils/server-time';

export interface TransactionOptions {
  expirationSecondsFromNow?: number;
  expirationTimestamp?: number;
  gasUnitPrice?: number;
  maxGasAmount?: number;
  sender?: string;
  sequenceNumber?: number | bigint;
}

export const defaultExpirationSecondsFromNow = 90;

const {
  AccountAddress,
  ChainId,
  EntryFunction,
  RawTransaction,
  StructTag,
  TransactionPayloadEntryFunction,
  TypeTagStruct,
} = TxnBuilderTypes;

export async function encodeEntryFunctionPayload(
  aptosClient: AptosClient,
  payload: Types.EntryFunctionPayload,
) {
  // The following values are not used to encode the payload, but are required to
  // produce a valid raw transaction. Since the transaction is discarded, we don't care
  // of putting valid values here. Note: providing a truthy value to `gas_unit_price`
  // and `sequence_number` prevents additional queries within the transaction builder
  const mockSenderAddress = '';
  const mockOptions = {
    gas_unit_price: '0',
    sequence_number: '0',
  };
  const encodedTxn = await aptosClient.generateTransaction(
    mockSenderAddress,
    payload,
    mockOptions,
  );
  return encodedTxn.payload as TxnBuilderTypes.TransactionPayloadEntryFunction;
}

export async function encodePayload(
  aptosClient: AptosClient,
  payload: JsonPayload,
) {
  if (payload.type === 'multisig_payload') {
    const multisigAddress = TxnBuilderTypes.AccountAddress.fromHex(
      payload.multisig_address,
    );

    let multisigPayload: TxnBuilderTypes.MultiSigTransactionPayload | undefined;
    if (payload.transaction_payload !== undefined) {
      const wrappedPayload = await encodeEntryFunctionPayload(
        aptosClient,
        payload.transaction_payload,
      );
      multisigPayload = new TxnBuilderTypes.MultiSigTransactionPayload(
        wrappedPayload.value,
      );
    }

    const multisig = new TxnBuilderTypes.MultiSig(
      multisigAddress,
      multisigPayload,
    );
    return new TxnBuilderTypes.TransactionPayloadMultisig(multisig);
  }

  return encodeEntryFunctionPayload(aptosClient, payload);
}

export function buildRawTransactionFromBCSPayload(
  senderAddress: MaybeHexString,
  sequenceNumber: number | bigint,
  chainId: number,
  payload: TxnBuilderTypes.TransactionPayload,
  options?: Omit<TransactionOptions, 'sender' | 'sequenceNumber'>,
) {
  let expirationTimestamp = options?.expirationTimestamp;
  if (!expirationTimestamp) {
    const expirationSecondsFromNow =
      options?.expirationSecondsFromNow ?? defaultExpirationSecondsFromNow;
    expirationTimestamp =
      Math.floor(getServerTime() / 1000) + expirationSecondsFromNow;
  }

  return new RawTransaction(
    AccountAddress.fromHex(senderAddress),
    BigInt(sequenceNumber),
    payload,
    // Note: using value 0 as flag for automatic estimation when submitting
    BigInt(options?.maxGasAmount ?? 0),
    BigInt(options?.gasUnitPrice ?? 0),
    BigInt(expirationTimestamp),
    new ChainId(Number(chainId)),
  );
}

interface BuildCoinTransferPayloadProps {
  amount: bigint;
  recipient: MaybeHexString;
  structTag?: string;
}

/**
 * Create a coin transfer transaction payload
 * @param recipient recipient address
 * @param amount amount of coins to transfer
 * @param structTag struct tag of the coin to be sent
 */
export function buildCoinTransferPayload({
  amount,
  recipient,
  structTag = aptosCoinStructTag,
}: BuildCoinTransferPayloadProps) {
  const typeArgs = [new TypeTagStruct(StructTag.fromString(structTag))];

  const encodedArgs = [
    BCS.bcsToBytes(AccountAddress.fromHex(recipient)),
    BCS.bcsSerializeUint64(BigInt(amount)),
  ];

  const entryFunction = EntryFunction.natural(
    aptosAccountNamespace,
    aptosAccountCoinTransferFunctionName,
    typeArgs,
    encodedArgs,
  );
  return new TransactionPayloadEntryFunction(entryFunction);
}

interface BuildAccountTransferPayloadProps {
  amount: bigint;
  recipient: MaybeHexString;
}

/**
 * Create an account coin transfer transaction payload.
 * This differs from 0x1::coin::transfer in that
 * it creates the recipient account if it doesn't exist
 * @param recipient recipient address
 * @param amount amount of coins to transfer
 */
export function buildAccountTransferPayload({
  amount,
  recipient,
}: BuildAccountTransferPayloadProps) {
  const encodedArgs = [
    BCS.bcsToBytes(AccountAddress.fromHex(recipient)),
    BCS.bcsSerializeUint64(BigInt(amount)),
  ];

  const entryFunction = EntryFunction.natural(
    aptosAccountNamespace,
    aptosAccountCreateAccountViaTransferFunctionName,
    [],
    encodedArgs,
  );
  return new TransactionPayloadEntryFunction(entryFunction);
}
