// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable import/prefer-default-export */

import { I18NStrings, STRING_FILES } from './files';

// temp function that will get replaced by i18n
export const i18nmock = (string: I18NStrings) => {
  // breaks 'general:something.continue' into ["general", "something.continue"]
  const splitString = string.split(':');

  // fileName = "general"
  const fileName: string = splitString[0];
  // rest = ""something.continue" => ["something","continue"]
  const parts = splitString[1].split('.');

  // gets string file from json
  const stringFile: any = (STRING_FILES as any)[fileName];

  let currentObj: any = stringFile;
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    currentObj = currentObj[part];
    if (currentObj === undefined) {
      // eslint-disable-next-line no-console
      console.warn(`Couldn't resolve i18n string "${string}"`);
      return parts[parts.length - 1];
    }
  }
  return currentObj;
};

export type I18nKey = Parameters<typeof i18nmock>[0];
