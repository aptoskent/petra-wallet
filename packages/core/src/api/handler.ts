// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AptosClient } from 'aptos';
import {
  DappInfo,
  defaultCustomNetworks,
  defaultNetworkName,
  defaultNetworks,
  PersistentState,
  PublicAccount,
} from '../types';
import { SignMessagePayload, SignMessageResponse } from './types';
import {
  ApprovalClient,
  SignAndSubmitTransactionResponseArgs,
  SignMessageResponseArgs,
  SignTransactionResponseArgs,
} from '../approval';
import { Storage } from '../storage';
import { TransactionOptions } from '../transactions';
import PermissionService from '../utils/permissions';
import { PetraApiErrors } from './error';
import {
  SerializedMultiAgentPayload,
  SerializedPayload,
} from '../serialization';

type PersistentStorage = Storage<PersistentState>;

/**
 * Used by `PetraApiServer` to handle Petra API requests.
 * Each instance should handle a single request.
 */
export default class PetraApiRequestHandler {
  constructor(
    private readonly dappInfo: DappInfo,
    private readonly permissionService: PermissionService,
    private readonly approvalClient: ApprovalClient,
    private readonly persistentStorage: PersistentStorage,
  ) {}

  private async getActiveAccount() {
    const { activeAccountAddress, activeAccountPublicKey } =
      await this.persistentStorage.get([
        'activeAccountAddress',
        'activeAccountPublicKey',
      ]);
    return activeAccountAddress !== undefined &&
      activeAccountPublicKey !== undefined
      ? ({
          address: activeAccountAddress,
          publicKey: activeAccountPublicKey,
        } as PublicAccount)
      : undefined;
  }

  private async getActiveNetwork() {
    const { activeNetworkName, customNetworks } =
      await this.persistentStorage.get(['activeNetworkName', 'customNetworks']);

    const networks = {
      ...defaultNetworks,
      ...(customNetworks ?? defaultCustomNetworks),
    };
    return networks[activeNetworkName ?? defaultNetworkName];
  }

  /**
   * Return the active account, or throw if not connected to dapp
   * @throws {PetraApiErrors.UNAUTHORIZED} if the active account is not connected to the dapp
   */
  private async ensureAccountConnected() {
    const account = await this.getActiveAccount();
    const isAllowed =
      account !== undefined &&
      (await this.permissionService.isDomainAllowed(
        this.dappInfo.domain,
        account.address,
      ));
    if (!isAllowed) {
      throw PetraApiErrors.UNAUTHORIZED;
    }
    return account;
  }

  /**
   * Request the user to connect the active account to the dapp
   * @throws {PetraApiErrors.NO_ACCOUNTS} if no active account is available
   * @throws {PetraApiErrors.USER_REJECTION} if the request was rejected
   * @throws {PetraApiErrors.TIME_OUT} if the request timed out
   */
  async connect() {
    const account = await this.getActiveAccount();
    const isAllowed = account
      ? await this.permissionService.isDomainAllowed(
          this.dappInfo.domain,
          account.address,
        )
      : false;

    const connectRequest: Promise<any> = !isAllowed
      ? this.approvalClient.request(this.dappInfo, {
          type: 'connect',
        })
      : Promise.resolve();

    // Check for backward compatibility, ideally should be removed
    if (account === undefined) {
      throw PetraApiErrors.NO_ACCOUNTS;
    }

    if (connectRequest) {
      await connectRequest;
      await this.permissionService.addDomain(
        this.dappInfo.domain,
        account.address,
      );
    }

    return account;
  }

  /**
   * Disconnect the active account from the dapp
   * @throws {PetraApiErrors.UNAUTHORIZED} if the active account is not connected to the dapp
   */
  async disconnect() {
    const { address } = await this.ensureAccountConnected();
    await this.permissionService.removeDomain(this.dappInfo.domain, address);
  }

  /**
   * Check if the active account is connected to the dapp
   */
  async isConnected() {
    const account = await this.getActiveAccount();
    return (
      account !== undefined &&
      this.permissionService.isDomainAllowed(
        this.dappInfo.domain,
        account.address,
      )
    );
  }

  /**
   * Get the active public account
   * @throws {PetraApiErrors.UNAUTHORIZED} if the active account is not connected to the dapp
   */
  async getAccount() {
    return this.ensureAccountConnected();
  }

  /**
   * Get the active network
   * @throws {PetraApiErrors.UNAUTHORIZED} if the active account is not connected to the dapp
   */
  async getNetwork() {
    await this.ensureAccountConnected();
    const { name, nodeUrl } = await this.getActiveNetwork();
    const aptosClient = new AptosClient(nodeUrl);
    const chainId = (await aptosClient.getChainId()).toString();
    return { chainId, name, url: nodeUrl };
  }

  /**
   * Create a signed transaction from a payload
   * @throws {PetraApiErrors.UNAUTHORIZED} if the active account is not connected to the dapp
   * @throws {PetraApiErrors.USER_REJECTION} if the request was rejected
   * @throws {PetraApiErrors.TIME_OUT} if the request timed out
   */
  async signTransaction(
    payload: SerializedPayload,
    options?: TransactionOptions,
  ) {
    await this.ensureAccountConnected();
    const { signedTxnHex } = (await this.approvalClient.request(this.dappInfo, {
      options,
      payload,
      type: 'signTransaction',
    })) as SignTransactionResponseArgs;
    return signedTxnHex;
  }

  /**
   * Create a signed transaction from a multi agent transaction payload
   * @throws {PetraApiErrors.UNAUTHORIZED} if the active account is not connected to the dapp
   * @throws {PetraApiErrors.USER_REJECTION} if the request was rejected
   * @throws {PetraApiErrors.TIME_OUT} if the request timed out
   */
  async signMultiAgentTransaction(payload: SerializedMultiAgentPayload) {
    await this.ensureAccountConnected();
    const { signedTxnHex } = (await this.approvalClient.request(this.dappInfo, {
      payload,
      type: 'signMultiAgentTransaction',
    })) as SignTransactionResponseArgs;
    return signedTxnHex;
  }

  /**
   * Create and submit a signed transaction from a payload
   * @throws {PetraApiErrors.UNAUTHORIZED} if the active account is not connected to the dapp
   * @throws {PetraApiErrors.USER_REJECTION} if the request was rejected
   * @throws {PetraApiErrors.TIME_OUT} if the request timed out
   */
  async signAndSubmitTransaction(payload: SerializedPayload) {
    await this.ensureAccountConnected();
    const { userTxn } = (await this.approvalClient.request(this.dappInfo, {
      payload,
      type: 'signAndSubmitTransaction',
    })) as SignAndSubmitTransactionResponseArgs;
    return userTxn;
  }

  async signMessage({
    address = false,
    application = false,
    chainId: withChainId = false,
    message,
    nonce,
  }: SignMessagePayload): Promise<SignMessageResponse> {
    const { address: accountAddress } = await this.ensureAccountConnected();

    const prefix = 'APTOS';

    const { nodeUrl } = await this.getActiveNetwork();
    const aptosClient = new AptosClient(nodeUrl);
    const chainId = await aptosClient.getChainId();

    let fullMessage = prefix;

    if (address) {
      fullMessage += `\naddress: ${accountAddress}`;
    }

    if (application) {
      fullMessage += `\napplication: ${this.dappInfo.domain}`;
    }

    if (withChainId) {
      fullMessage += `\nchainId: ${chainId}`;
    }

    fullMessage += `\nmessage: ${message}`;
    fullMessage += `\nnonce: ${nonce}`;

    const { signature } = (await this.approvalClient.request(this.dappInfo, {
      fullMessage,
      message,
      type: 'signMessage',
    })) as SignMessageResponseArgs;

    return {
      address: accountAddress,
      application: this.dappInfo.domain,
      chainId,
      fullMessage,
      message,
      nonce,
      prefix,
      signature,
    };
  }
}

export type HandlerMethodName =
  | 'connect'
  | 'disconnect'
  | 'isConnected'
  | 'getAccount'
  | 'getNetwork'
  | 'signTransaction'
  | 'signMultiAgentTransaction'
  | 'signAndSubmitTransaction'
  | 'signMessage';

export type HandlerMethodArgs<MethodName extends HandlerMethodName> =
  Parameters<PetraApiRequestHandler[MethodName]>;
export type HandlerMethodReturnType<MethodName extends HandlerMethodName> =
  Awaited<ReturnType<PetraApiRequestHandler[MethodName]>>;
