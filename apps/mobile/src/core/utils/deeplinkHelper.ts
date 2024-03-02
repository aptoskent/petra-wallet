// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export const getPathname = (pathname: string) => {
  let count = 0;
  pathname.split('').forEach((c: string) => {
    if (c === '/') {
      count += 1;
    }
  });
  return `/${pathname.slice(count)}`;
};

export const getPath = (pathRaw: string): string =>
  pathRaw.slice(0, 5) === 'PETRA' ? pathRaw.toLocaleLowerCase() : pathRaw;
