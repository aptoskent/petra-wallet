// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { EntryFunctionPayloadInfo } from '../usePayloadInfo';
import EntryFunctionInfoSection from './EntryFunctionInfoSection';
import { PayloadInfoLine } from './shared';

export interface EntryFunctionPayloadInfoSectionProps {
  info: EntryFunctionPayloadInfo;
}

export default function EntryFunctionPayloadInfoSection({
  info: { value },
}: EntryFunctionPayloadInfoSectionProps) {
  return (
    <VStack alignItems="stretch">
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Type" />}
        value={<FormattedMessage defaultMessage="Entry function" />}
      />
      <EntryFunctionInfoSection info={value} />
    </VStack>
  );
}
