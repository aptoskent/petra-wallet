// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export default function isDomainBlockListed(
  domain: string,
  currentlyBlockedSites: Set<string> | undefined,
): boolean {
  if (currentlyBlockedSites === undefined) {
    // by default, return blocked if we don't know
    // statsig cache on device should mean that this is never hit
    return true;
  }
  const stringsToTest = [];
  // test the domains with https:// and www.
  stringsToTest.push(domain.slice(0));

  let domainDupe = domain.slice(0);
  domainDupe = domainDupe.replace(/(https?:\/\/)?(www\.)?/, '');

  const shortenedDomain = domainDupe.split('/')[0];
  stringsToTest.push(shortenedDomain.slice(0));

  // create subdomain parts
  // hello.there.you.person.com => ['hello','there','you','person','com']
  let arrayedDomain = shortenedDomain.split('.');
  while (arrayedDomain.length > 2) {
    stringsToTest.push(arrayedDomain.slice(1).join('.'));
    arrayedDomain = arrayedDomain.slice(1);
  }

  // constant lookup for the final array allows for quickly going through a long list
  return stringsToTest.some((stringDomain: string) =>
    currentlyBlockedSites.has(stringDomain),
  );
}
