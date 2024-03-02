// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MultisigPayloadInfo } from '../usePayloadInfo';
import EntryFunctionInfoSection from './EntryFunctionInfoSection';
import { PayloadInfoLine } from './shared';

export interface MultisigPayloadInfoSectionProps {
  info: MultisigPayloadInfo;
}

export default function MultisigPayloadInfoSection({
  info: { entryFunction, multisigAddress },
}: MultisigPayloadInfoSectionProps) {
  return (
    <VStack alignItems="stretch">
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Type" />}
        value={<FormattedMessage defaultMessage="Multisig" />}
      />
      <PayloadInfoLine
        name={<FormattedMessage defaultMessage="Multisig address" />}
        value={multisigAddress}
      />
      <EntryFunctionInfoSection info={entryFunction} />
    </VStack>
  );
}
