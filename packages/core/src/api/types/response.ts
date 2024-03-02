// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { PetraApiError } from '../error';
import type { HandlerMethodName, HandlerMethodReturnType } from '../handler';

export interface BasePetraApiResponse {
  id: string;
  type: 'response';
}

export type PetraApiSuccessResponse = {
  error: undefined;
  result: HandlerMethodReturnType<HandlerMethodName>;
} & BasePetraApiResponse;

export type PetraApiErrorResponse = {
  error: PetraApiError;
  result: undefined;
} & BasePetraApiResponse;

export type PetraApiResponse = PetraApiSuccessResponse | PetraApiErrorResponse;

export function makePetraApiResponse<TMethodName extends HandlerMethodName>(
  id: string,
  resultOrError: HandlerMethodReturnType<TMethodName> | PetraApiError,
): PetraApiResponse {
  const isError = resultOrError instanceof PetraApiError;
  return {
    id,
    type: 'response',
    ...(isError
      ? { error: resultOrError, result: undefined }
      : { error: undefined, result: resultOrError }),
  };
}

/**
 * Check if an object is a PetraApiResponse
 */
export function isPetraApiResponse(
  data?: PetraApiResponse,
): data is PetraApiResponse {
  return (
    data !== undefined &&
    data.type === 'response' &&
    data.id !== undefined &&
    data.id.length > 0
  );
}
