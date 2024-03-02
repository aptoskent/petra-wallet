// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
export type MetaDataJsonCategory = 'image' | 'video' | 'audio' | 'vr' | 'html';

export type MetadataJsonAttribute = {
  trait_type: string;
  value: string;
};

export type MetadataJsonCollection = {
  family: string;
  name: string;
};

export type MetadataJsonFile = {
  cdn?: boolean;
  type: string;
  uri: string;
};

export type MetadataJsonCreator = {
  address: string;
  share: number;
  verified: boolean;
};

export type MetadataJsonProperties = {
  category: MetaDataJsonCategory;
  creators: MetadataJsonCreator[];
  files: MetadataJsonFile[];
};

export type ImageFileType = '.png' | '.jpeg' | '.jpg' | '.gif';

export type MetadataJson = {
  animation_url?: string;
  attributes?: MetadataJsonAttribute[];
  collection?: MetadataJsonCollection;
  description?: string;
  external_url?: string;
  image: string;
  name: string;
  properties?: MetadataJsonProperties;
  seller_fee_basis_points?: number;
  symbol?: string;
};

export interface TokenAttributes {
  description?: string;
  imageUri?: string;
  metadata?: MetadataJson;
  name: string;
  supply?: number;
  uri: string;
}
