// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export interface SignMessagePayload {
  address?: boolean;
  application?: boolean;
  chainId?: boolean;
  message: string;
  nonce: string;
}

export interface SignMessageResponse {
  address: string;
  application: string;
  chainId: number;
  fullMessage: string;
  message: string;
  nonce: string;
  prefix: string;
  signature: string;
}
