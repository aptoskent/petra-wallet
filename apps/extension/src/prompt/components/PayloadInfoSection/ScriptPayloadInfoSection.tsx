// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ScriptPayloadInfo } from '../usePayloadInfo';
import { PayloadInfoLine } from './shared';

export interface ScriptPayloadInfoSectionProps {
  info: ScriptPayloadInfo;
}

export default function ScriptPayloadInfoSection({
  info: { args, serializedCode, typeArgs },
}: ScriptPayloadInfoSectionProps) {
  return (
    <VStack alignItems="stretch">
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Type" />}
        value={<FormattedMessage defaultMessage="Script" />}
      />
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Code" />}
        value={serializedCode}
      />
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Types Args" />}
        value={JSON.stringify(typeArgs)}
      />
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Args" />}
        value={JSON.stringify(args)}
      />
    </VStack>
  );
}
