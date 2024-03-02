// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import RNFS from 'react-native-fs';
import Device from '../../util/device';

let entryScript: string | undefined;

// Cached getter for the entry script
export default async function getEntryScript() {
  if (entryScript === undefined || entryScript.length === 0) {
    entryScript = Device.isIos()
      ? await RNFS.readFile(`${RNFS.MainBundlePath}/inpage.js`, 'utf8')
      : await RNFS.readFileAssets('inpage.js');
  }
  return entryScript;
}
