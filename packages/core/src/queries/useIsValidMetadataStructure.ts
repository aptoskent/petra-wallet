// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { useQuery } from 'react-query';
import { MetadataJson } from '../types/tokenMetadata';

export const isValidMetadataStructureQueryKey = 'isValidMetadataStructure';

export const getIsValidMetadataStructure = async (uri: string) => {
  try {
    const { data } = await axios.get<MetadataJson>(uri);
    if (
      !(
        data.description &&
        data.image &&
        data.name &&
        data.properties &&
        data.seller_fee_basis_points &&
        data.symbol
      )
    ) {
      return false;
    }

    if (
      !(
        data.properties.category &&
        data.properties.creators &&
        data.properties.files
      )
    ) {
      return false;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const creator of data.properties.creators) {
      if (!(creator.address && creator.share)) {
        return false;
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const file of data.properties.files) {
      if (!(file.type && file.uri)) {
        return false;
      }
    }

    return true;
  } catch (err) {
    return false;
  }
};

export const useIsValidMetadataStructure = (uri: string) =>
  useQuery([isValidMetadataStructureQueryKey, uri], async () =>
    getIsValidMetadataStructure(uri),
  );
