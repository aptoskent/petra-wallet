// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useFlag } from '@petra/core/flags';
import ActivityOld from './ActivityOld';
import ActivityNew from './ActivityNew';

export default function Activity() {
  return useFlag('new-activity') ? <ActivityNew /> : <ActivityOld />;
}
