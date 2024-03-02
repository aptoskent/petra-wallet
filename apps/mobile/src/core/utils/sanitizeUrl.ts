// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export default function sanitizeUrl(rawUrl: string) {
  const protocol = /^https?:\/\//;
  let newSanitizedUrl = rawUrl;
  if (!protocol.test(newSanitizedUrl)) {
    newSanitizedUrl = `https://${newSanitizedUrl}`;
  }
  return new URL(newSanitizedUrl);
}
