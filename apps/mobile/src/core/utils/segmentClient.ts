// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { createClient } from '@segment/analytics-react-native';
// @ts-ignore cannot find module
import {
  REACT_APP_MOBILE_SEGMENT_WRITE_KEY,
  REACT_APP_DISABLE_SEGMENT,
} from '@env';

export default createClient({
  trackAppLifecycleEvents: true,
  // when REACT_APP_DISABLE_SEGMENT is true in ci/cd test, omit the segment write key
  // to prevent sending logs to segment
  // @ts-ignore
  writeKey:
    REACT_APP_DISABLE_SEGMENT === 'true'
      ? null
      : REACT_APP_MOBILE_SEGMENT_WRITE_KEY,
});
