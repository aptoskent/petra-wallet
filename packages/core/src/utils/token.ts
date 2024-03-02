// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { sha3_256 } from '@noble/hashes/sha3';
import {
  type MaybeHexString,
  type Types,
  HexString,
  TxnBuilderTypes,
  TokenTypes,
} from 'aptos';
import { aptosNamesEndpoint } from './names';
import { MetadataJson } from '../types/tokenMetadata';
// region Token ID

export function getTokenDataId({
  collection,
  creator,
  name,
}: TokenTypes.TokenDataId) {
  return `${creator}::${collection}::${name}`;
}

export async function getTokenDataIdHash(tokenDataId: TokenTypes.TokenDataId) {
  const encodedInput = new TextEncoder().encode(getTokenDataId(tokenDataId));
  const hashBuffer = crypto.subtle
    ? await crypto.subtle.digest('SHA-256', encodedInput)
    : sha3_256.create().update(encodedInput).digest();
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// endregion

// region Token Metadata

const badAptosNameUriPattern = /^https:\/\/aptosnames.com\/name\/([^/]+)$/;
const missingWwwAptosNameUriPattern =
  /^https:\/\/aptosnames.com\/api(?:\/[^/]+)?\/v\d+\/metadata\/([^/]+)/;
const aptosNftUriPattern = /^https:\/\/aptoslabs\.com\/nft_images\//;
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
const ipfsProtocol = 'ipfs://';
const ipfsBaseUri = 'https://cloudflare-ipfs.com/ipfs/';

export function fixBadAptosUri(uri: string) {
  const match =
    uri.match(badAptosNameUriPattern) ??
    uri.match(missingWwwAptosNameUriPattern);
  return match ? `${aptosNamesEndpoint}/v1/metadata/${match[1]}` : uri;
}

function isImageUri(uri: string) {
  const ext = uri.split(/[#?]/)[0].split('.').pop()?.trim();
  return ext !== undefined && imageExtensions.includes(ext);
}

function isAptosNftImage(uri: string) {
  return uri.match(aptosNftUriPattern) !== null;
}

function fixIpfs(uri: string) {
  // Try to infer metadata type from the uri itself
  if (uri && uri.startsWith(ipfsProtocol)) {
    return uri.replace(ipfsProtocol, ipfsBaseUri);
  }
  return uri;
}

export async function getTokenMetadata(name: string, uri: string) {
  let resolvedUri = uri;
  let isImage = false;

  if (uri.startsWith(ipfsProtocol)) {
    resolvedUri = fixIpfs(uri);
  } else if (isAptosNftImage(resolvedUri) || isImageUri(resolvedUri)) {
    isImage = true;
  }

  if (!isImage) {
    // Actually query metadata, and determine type from the result
    const response = await axios.get<MetadataJson>(resolvedUri);
    const contentType = response.headers['content-type'];
    isImage = contentType !== undefined && contentType?.includes('image/');
    if (!isImage) {
      // The response content is not an image, assuming it's a valid metadata json
      return { ...response.data, image: fixIpfs(response.data.image) };
    }
  }
  return { image: resolvedUri, name };
}

// endregion

interface GenerateOfferPayloadV1Props {
  amount: number;
  recipientAddress: MaybeHexString;
  tokenData: {
    collection: string;
    creator: string;
    name: string;
    propertyVersion?: number;
  };
}

export function generateOfferPayloadV1({
  amount,
  recipientAddress,
  tokenData,
}: GenerateOfferPayloadV1Props) {
  return {
    arguments: [
      recipientAddress,
      tokenData.creator,
      tokenData.collection,
      tokenData.name,
      tokenData.propertyVersion || 0,
      amount,
    ],
    function: '0x3::token_transfers::offer_script',
    type_arguments: [],
  };
}

export interface GenerateDirectTransferPayloadV2Props {
  recipientAddress: string;
  tokenAddress: string;
}

export function generateDirectTransferPayloadV2({
  recipientAddress,
  tokenAddress,
}: GenerateDirectTransferPayloadV2Props) {
  const payload: Types.EntryFunctionPayload = {
    arguments: [
      HexString.ensure(tokenAddress),
      HexString.ensure(recipientAddress ?? tokenAddress),
    ],
    function: '0x1::object::transfer',
    type_arguments: ['0x4::token::Token'],
  };
  return payload;
}

export interface GenerateDirectTransferPayloadV1Props {
  amount: number;
  collectionName: string;
  creator: string;
  propertyVersion: number;
  recipientAddress: string;
  tokenName: string;
}

const {
  Script,
  TransactionArgumentAddress,
  TransactionArgumentU8Vector,
  TransactionArgumentU64,
} = TxnBuilderTypes;
// ecosystem/typescript/sdk/src/move_scripts/token_transfer_with_opt_in
const TOKEN_TRANSFER_OPT_IN =
  'a11ceb0b0500000006010004020408030c0a05161d073339086c400000010100020700010307000104030100010504020007060c0508000800030503010801000405080008000304060c0801050306737472696e6705746f6b656e06537472696e6707546f6b656e4964136372656174655f746f6b656e5f69645f726177087472616e73666572000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000030000010c0b010b020b030b0411000c070b000b070b050b06110102';

export function generateDirectTransferPayloadV1({
  amount,
  collectionName,
  creator,
  propertyVersion,
  recipientAddress,
  tokenName,
}: GenerateDirectTransferPayloadV1Props) {
  return new TxnBuilderTypes.TransactionPayloadScript(
    new Script(
      new HexString(TOKEN_TRANSFER_OPT_IN).toUint8Array(),
      [],
      recipientAddress
        ? [
            new TransactionArgumentAddress(
              TxnBuilderTypes.AccountAddress.fromHex(creator),
            ),
            new TransactionArgumentU8Vector(
              new TextEncoder().encode(collectionName),
            ),
            new TransactionArgumentU8Vector(
              new TextEncoder().encode(tokenName),
            ),
            new TransactionArgumentU64(BigInt(propertyVersion)),
            new TransactionArgumentAddress(
              TxnBuilderTypes.AccountAddress.fromHex(recipientAddress),
            ),
            new TransactionArgumentU64(BigInt(amount)),
          ]
        : [],
    ),
  );
}
