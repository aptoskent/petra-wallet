// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';

function normalizeName(name: string) {
  return name.toLowerCase().replace(/(\.apt)+$/, '');
}

export class AptosName {
  #name: string;

  constructor(name: string) {
    this.#name = normalizeName(name);
  }

  toString(): string {
    return `${this.#name}.apt`;
  }

  noSuffix(): string {
    return this.#name;
  }
}

interface NameFromAddressResult {
  address?: string | null;
}

interface AddressFromNameResult {
  name?: string | null;
}

export const aptosNamesEndpoint = 'https://www.aptosnames.com/api';

export async function getAddressFromName(name: AptosName, network: string) {
  try {
    const response = await axios.get<NameFromAddressResult>(
      `${aptosNamesEndpoint}/${network.toLowerCase()}/v1/address/${name.noSuffix()}`,
    );
    return response.data?.address ? response.data.address : undefined;
  } catch (err) {
    return undefined;
  }
}

export async function getNameFromAddress(
  address: string,
  network: string,
): Promise<AptosName | undefined> {
  try {
    const response = await axios.get<AddressFromNameResult>(
      `${aptosNamesEndpoint}/${network.toLowerCase()}/v1/name/${address}`,
    );
    return response.data?.name ? new AptosName(response.data.name) : undefined;
  } catch (err) {
    return undefined;
  }
}
