// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import isDomainBlockListed from '../isDomainBlocklisted';

describe('checkDomain', () => {
  it('handles undefined for blocked list', () => {
    const domain = 'https://www.hello.com';
    const blockList = undefined;
    // expect true because before the config has loaded, we want to default to
    // kicking user out
    expect(isDomainBlockListed(domain, blockList)).toEqual(true);
  });

  it('handles empty blocklist', () => {
    const domain = 'https://www.hello.com';
    const blockList = new Set([]);
    // expect false - dynamic config is returned and there is nothing in it
    expect(isDomainBlockListed(domain, blockList)).toEqual(false);
  });

  it('handles blocking a site with just the domain ', () => {
    const domain = 'https://www.hello.com';
    const domain2 = 'https://hello.com';
    const blockList = new Set(['hello.com']);

    // expect false - dynamic config is returned and there is nothing in it
    expect(isDomainBlockListed(domain, blockList)).toEqual(true);
    expect(isDomainBlockListed(domain2, blockList)).toEqual(true);
  });

  it('handles blocking subdomains by blocking the domain', () => {
    const domain = 'https://www.whatever.hello.com';
    const domain2 = 'https://whatever.hello.com';
    const blockList = new Set(['hello.com']);

    // expect false - dynamic config is returned and there is nothing in it
    expect(isDomainBlockListed(domain, blockList)).toEqual(true);
    expect(isDomainBlockListed(domain2, blockList)).toEqual(true);
  });

  it('handles blocking subdomains by blocking the subdomain explicitly', () => {
    const domain = 'https://www.whatever.hello.com';
    const domain2 = 'https://whatever.hello.com';
    const blockList = new Set(['whatever.hello.com']);

    // expect false - dynamic config is returned and there is nothing in it
    expect(isDomainBlockListed(domain, blockList)).toEqual(true);
    expect(isDomainBlockListed(domain2, blockList)).toEqual(true);
  });

  it('handles properly allowing non-blocked sites', () => {
    const domain = 'https://www.goodbye.com';
    const domain2 = 'https://whatever.goodbye.com';
    const blockList = new Set(['whatever.hello.com', 'hello.com']);

    // expect false - dynamic config is returned and there is nothing in it
    expect(isDomainBlockListed(domain, blockList)).toEqual(false);
    expect(isDomainBlockListed(domain2, blockList)).toEqual(false);
  });

  it('no false positives', () => {
    const domain = 'https://www.hello.topaz.com';
    const blockList = new Set(['hello.com']);

    expect(isDomainBlockListed(domain, blockList)).toEqual(false);
  });
});
