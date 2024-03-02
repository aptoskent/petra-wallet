// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Text } from '@chakra-ui/react';
import React from 'react';

export interface PayloadInfoLineProps {
  name: string | JSX.Element;
  value: string | JSX.Element;
}

export function PayloadInfoLine({ name, value }: PayloadInfoLineProps) {
  return (
    <Text fontSize="sm" lineHeight="20px">
      <b>{name}:</b> {value}
    </Text>
  );
}
