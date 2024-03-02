// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

interface Props {
  seed?: number;
  size?: number;
}

export default function randomImage({
  seed = Math.floor(Math.random() * 1000000000),
  size = 600,
}: Props = {}): string {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}
