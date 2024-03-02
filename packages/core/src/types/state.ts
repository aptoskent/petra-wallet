// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { KeyDerivationAlgorithm } from '../utils/keyDerivation';
import type { Accounts, EncryptedAccounts } from './account';
import type { ApprovalRequest } from '../approval';
import type { FeatureConfig } from './featureConfig';
import type { Networks } from './network';
import type { Permissions } from './permission';

export interface PersistentState {
  activeAccountAddress: string | undefined;
  activeAccountPublicKey: string | undefined;
  activeNetworkChainId: string | undefined;
  activeNetworkName: string | undefined;
  activeNetworkRpcUrl: string | undefined;
  approvalRequest: ApprovalRequest | undefined;
  aptDisplayByAccount: { [key: string]: string };
  aptosWalletPermissions: Permissions | undefined;
  autolockTimer: number | undefined;
  customNetworks: Networks | undefined;
  encryptedAccounts: EncryptedAccounts | undefined;
  encryptedStateVersion: number;
  featureConfig: FeatureConfig;
  hasBiometricPassword: boolean;
  hiddenTokens: { [key: string]: { [key: string]: boolean } };
  keyDerivationAlgorithm: KeyDerivationAlgorithm | undefined;
  keychainVersion: number;
  salt: string | undefined;
}

export interface SessionState {
  accounts: Accounts | undefined;
  encryptionKey: string | undefined;
}
