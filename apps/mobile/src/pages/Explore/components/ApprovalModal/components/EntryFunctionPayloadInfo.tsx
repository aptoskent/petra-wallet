// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import collapseHexString from '@petra/core/utils/hex';
import React from 'react';
import { i18nmock } from 'strings';
import { EntryFunctionPayloadInfo as Info } from '../hooks';
import ListRow from './ListRow';

export interface EntryFunctionPayloadInfoProps {
  info: Info;
}

export default function EntryFunctionPayloadInfo({
  info: { functionId },
}: EntryFunctionPayloadInfoProps) {
  const { address, moduleName, name } = functionId;
  const collapsedAddress = collapseHexString(address, 6);
  return (
    <ListRow
      title={i18nmock('approvalModal:signTransaction.function')}
      value={`${collapsedAddress}::${moduleName}::${name}`}
    />
  );
}
