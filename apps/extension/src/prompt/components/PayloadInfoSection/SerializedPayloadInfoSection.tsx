// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { SerializedPayloadInfo } from '../usePayloadInfo';
import { PayloadInfoLine } from './shared';

export interface SerializedPayloadInfoSectionProps {
  info: SerializedPayloadInfo;
}

export default function SerializedPayloadInfoSection({
  info: { serializedValue },
}: SerializedPayloadInfoSectionProps) {
  return (
    <VStack alignItems="stretch">
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Type" />}
        value={<FormattedMessage defaultMessage="Serialized" />}
      />
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Serialized value" />}
        value={serializedValue}
      />
    </VStack>
  );
}
