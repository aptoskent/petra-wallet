// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/**
 * Move VM status codes that describe an error in the VM
 * @see https://github.com/move-language/move/blob/3f862abe908ab09710342f1b1cc79b8961ea8a1b/language/move-core/types/src/vm_status.rs#L418
 */
export enum MoveStatusCode {
  FUNCTION_RESOLUTION_FAILURE = 1091,
  GAS_UNIT_PRICE_ABOVE_MAX_BOUND = 16,
  GAS_UNIT_PRICE_BELOW_MIN_BOUND = 15,
  INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE = 5,
  MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS = 14,
  MAX_GAS_UNITS_EXCEEDS_MAX_GAS_UNITS_BOUND = 13,
  OUT_OF_GAS = 4002,
  SEQUENCE_NUMBER_TOO_OLD = 3,
}

export enum MoveStatusCodeText {
  FUNCTION_RESOLUTION_FAILURE = 'Function does not exist',
  GAS_UNIT_PRICE_ABOVE_MAX_BOUND = 'Gas unit price submitted with the transaction is above the maximum gas price set in the VM.',
  GAS_UNIT_PRICE_BELOW_MIN_BOUND = 'Gas unit price submitted with transaction is below minimum gas price set in the VM.',
  INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE = 'Insufficient balance to pay minimum transaction fee',
  MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS = 'Max gas units submitted with transaction are not enough to cover the intrinsic cost of the transaction',
  MAX_GAS_UNITS_EXCEEDS_MAX_GAS_UNITS_BOUND = 'Max gas units submitted with transaction exceeds max gas units bound in VM',
  NUMBER_OF_TYPE_ARGUMENTS_MISMATCH = 'Execution failed with incorrect number of type arguments',
  OUT_OF_GAS = 'Out of gas',
  SEQUENCE_NUMBER_TOO_OLD = 'Sequence number is too old',
}

/**
 * Note: using key of status code as identifier, as simulations don't return a `vm_status_code`
 */
export type MoveStatusCodeKey = keyof typeof MoveStatusCode;

/**
 * Move misc error message pattern returned as transaction VM status
 * @see `explain_vm_status` at https://github.com/aptos-labs/aptos-core/blob/main/api/types/src/convert.rs
 */
const miscErrorPattern = /^Transaction Executed and Committed with Error (.+)$/;

/**
 * Move VM error pattern returned in an `AptosError`
 * @see {@link AptosError}
 * @see `create_internal` at https://github.com/aptos-labs/aptos-core/blob/main/api/src/transactions.rs
 */
const vmErrorPattern = /^Invalid transaction: Type: Validation Code: (.+)$/;

/**
 * Indicates a VM error
 */
export class MoveVmError extends Error {
  constructor(
    readonly statusCodeKey?: MoveStatusCodeKey,
    readonly statusCode = statusCodeKey && MoveStatusCode[statusCodeKey],
  ) {
    super();
    this.name = 'MoveVmError';
    Object.setPrototypeOf(this, MoveVmError.prototype);
    this.message =
      statusCodeKey ??
      (statusCode && MoveStatusCode[statusCode]) ??
      'Generic error';
  }
}

/**
 * Parse status code from the VM status of a transaction
 * @param vmStatus status of a transaction
 */
export function parseMoveMiscError(vmStatus: string) {
  const match = vmStatus.match(miscErrorPattern);
  return match !== null ? (match[1] as MoveStatusCodeKey) : undefined;
}

/**
 * Parse status code from an `AptosError`
 * @param errorMsg error message returned from the API
 */
export function parseMoveVmError(errorMsg: string) {
  const match = errorMsg.match(vmErrorPattern);
  return match !== null ? (match[1] as MoveStatusCodeKey) : undefined;
}
