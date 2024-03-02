// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

async function sequentialMap<T, K>(
  arr: T[],
  fn: (item: T) => Promise<K>,
): Promise<K[]> {
  const result: K[] = [];
  // eslint-disable-next-line no-await-in-loop
  for (const item of arr) result.push(await fn(item));
  return result;
}

const PromiseHelpers = {
  sequentialMap,
};

export default PromiseHelpers;
