// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { PayloadInfo } from '../usePayloadInfo';
import EntryFunctionPayloadInfoSection from './EntryFunctionPayloadInfoSection';
import MultisigPayloadInfoSection from './MultisigPayloadInfoSection';
import ScriptPayloadInfoSection from './ScriptPayloadInfoSection';
import SerializedPayloadInfoSection from './SerializedPayloadInfoSection';

export interface PayloadInfoSectionProps {
  info: PayloadInfo;
}

export default function PayloadInfoSection({ info }: PayloadInfoSectionProps) {
  switch (info.type) {
    case 'entryFunction':
      return <EntryFunctionPayloadInfoSection info={info} />;
    case 'multisig':
      return <MultisigPayloadInfoSection info={info} />;
    case 'script':
      return <ScriptPayloadInfoSection info={info} />;
    case 'serialized':
    default:
      return <SerializedPayloadInfoSection info={info} />;
  }
}
