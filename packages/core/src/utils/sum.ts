// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export default function sum<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((acc, item) => acc + fn(item), 0);
}
