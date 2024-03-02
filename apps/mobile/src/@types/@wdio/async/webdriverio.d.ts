// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
declare function $(selector: string | Function): WebdriverIO.Element;

/**
 * find multiple elements on the page.
 */
declare function $$(selector: string | Function): WebdriverIO.ElementArray;

declare module '@wdio/async' {
  export = WebdriverIO;
}
