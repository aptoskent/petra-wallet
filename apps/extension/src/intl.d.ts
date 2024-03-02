// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import messages from 'lang/en.json';

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof typeof messages;
    }

    interface IntlConfig {
      locale: 'en' | 'zh';
    }
  }
}
