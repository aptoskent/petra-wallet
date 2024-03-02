// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ApprovalClient, ApprovalResponseStatus } from '../approval';
import ApprovalResponseError from '../approval/error';
import { Storage } from '../storage';
import { DappInfo, PersistentState } from '../types';
import PermissionService from '../utils/permissions';
import { PetraApiError, PetraApiErrors } from './error';
import PetraApiRequestHandler from './handler';
import { makePetraApiResponse, PetraApiRequest } from './types';

/**
 * Petra API server for handling Petra API requests
 */
export default class PetraApiServer {
  private readonly permissionService: PermissionService;

  constructor(
    private readonly persistentStorage: Storage<PersistentState>,
    private readonly approvalClient: ApprovalClient,
  ) {
    this.permissionService = new PermissionService(persistentStorage);
  }

  /**
   * Handle a single request coming from a dapp
   * @param dappInfo info of the dapp originating the request
   * @param request request to handle
   */
  async handleRequest(dappInfo: DappInfo, request: PetraApiRequest) {
    const handler = new PetraApiRequestHandler(
      dappInfo,
      this.permissionService,
      this.approvalClient,
      this.persistentStorage,
    );

    try {
      const methodBody: (...args: any[]) => Promise<any> =
        handler[request.method];
      const result = await methodBody.call(handler, ...request.args);
      return makePetraApiResponse(request.id, result);
    } catch (error) {
      // Send back PetraApiErrors as-is
      if (error instanceof PetraApiError) {
        return makePetraApiResponse(request.id, error);
      }

      // Convert ApprovalResponseErrors to PetraApiErrors
      if (error instanceof ApprovalResponseError) {
        const dappError =
          error.status === ApprovalResponseStatus.Rejected
            ? PetraApiErrors.USER_REJECTION
            : PetraApiErrors.TIME_OUT;
        return makePetraApiResponse(request.id, dappError);
      }

      // Internal unexpected error.
      // We log it in the context of the server (hidden from the dapp) for debugging purposes
      // and send back a generic internal error.

      // eslint-disable-next-line no-console
      console.error(error);
      return makePetraApiResponse(request.id, PetraApiErrors.INTERNAL_ERROR);
    }
  }
}
