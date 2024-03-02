// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { EntryFunctionInfo } from '../usePayloadInfo';
import { PayloadInfoLine } from './shared';

export interface EntryFunctionInfoSectionProps {
  info: EntryFunctionInfo;
}

export default function EntryFunctionInfoSection({
  info: { args, functionId, typeArgs },
}: EntryFunctionInfoSectionProps) {
  const serializedFunctionId = [
    functionId.moduleAddress,
    functionId.moduleName,
    functionId.functionName,
  ].join('::');

  return (
    <VStack alignItems="stretch">
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Function" />}
        value={serializedFunctionId}
      />
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Type Args" />}
        value={`[${typeArgs.join(', ')}]`}
      />
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Args" />}
        value={`[${args.join(', ')}]`}
      />
    </VStack>
  );
}
