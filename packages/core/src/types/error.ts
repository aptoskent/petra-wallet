// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export default class ExtendableError extends Error {
  constructor(message?: string) {
    super(message);
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
