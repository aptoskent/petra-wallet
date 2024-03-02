// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { NestedKeyOfI18N } from '@petra/core/types/nestedKeyOf';
import mock from './mock.json';

export type I18NStrings = NestedKeyOfI18N<typeof STRING_FILES>;

export const STRING_FILES = {
  mock,
};
