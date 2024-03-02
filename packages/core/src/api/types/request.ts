// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import type { HandlerMethodName, HandlerMethodArgs } from '../handler';

export interface PetraApiRequest {
  args: HandlerMethodArgs<HandlerMethodName>;
  id: string;
  method: HandlerMethodName;
  type: 'request';
}

export function makePetraApiRequest<TMethodName extends HandlerMethodName>(
  id: string,
  method: TMethodName,
  args: HandlerMethodArgs<TMethodName>,
): PetraApiRequest {
  return {
    args,
    id,
    method,
    type: 'request',
  };
}

/**
 * Check if an object is a PetraApiRequest
 */
export function isPetraApiRequest(
  data?: PetraApiRequest,
): data is PetraApiRequest {
  return (
    data !== undefined &&
    data.type === 'request' &&
    data.id !== undefined &&
    data.id.length >= 0 &&
    data.method !== undefined &&
    data.args !== undefined
  );
}
