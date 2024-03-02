// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { NestedKeyOfI18N } from '@petra/core/types/nestedKeyOf';
import activity from './activity.json';
import approvalModal from './approvalModal.json';
import assets from './assets.json';
import gen from './general.json';
import onboard from './onboarding.json';
import send from './send.json';
import settings from './settings.json';
import a11y from './a11y.json';
import stake from './stake.json';
import { I18NStrings as I18NStringsMock } from './files.mock';

export const STRING_FILES = {
  a11y,
  activity,
  approvalModal,
  assets,
  general: gen,
  onboarding: onboard,
  send,
  settings,
  stake,
};

export type I18NStrings =
  | NestedKeyOfI18N<typeof STRING_FILES>
  | I18NStringsMock;
