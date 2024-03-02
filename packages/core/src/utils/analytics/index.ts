// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { wordlist } from '@scure/bip39/wordlists/english';

const WORDLIST = new Set(wordlist);
const REDACTED = '[redacted]';

function filterKeys(input: string) {
  return input
    .replace(/(0x)?[0-9a-f]{64}/gi, REDACTED)
    .replace(/\{("\d{1,2}":\d{1,3},?){32,64}\}/g, `"${REDACTED}"`);
}

function filterMnemonicPhrases(input: string) {
  return input.replace(/(?:[a-z]+\s+){11,}[a-z]+/gi, (match) => {
    let didRedact = false;
    const words = match.split(/\s+/);
    const mnemonicLength = 12;
    for (let i = 0; i <= words.length - mnemonicLength; i += 1) {
      if (
        words
          .slice(i, i + mnemonicLength)
          .every((word) => WORDLIST.has(word.toLowerCase()))
      ) {
        didRedact = true;
        words.splice(i, mnemonicLength, REDACTED);
      }
    }

    if (didRedact) {
      return words.join(' ');
    }

    return match;
  });
}

export default function filterAnalyticsEvent(event: unknown) {
  const filtered = [filterKeys, filterMnemonicPhrases].reduce(
    (acc, x) => x(acc),
    JSON.stringify(event),
  );
  return JSON.parse(filtered);
}
