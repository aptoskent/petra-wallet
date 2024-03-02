// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
export default class AppScreen {
  private selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  /**
   * Wait for screen to be visible
   *
   * @param {boolean} isShown
   */
  async waitForIsShown(isShown = true): Promise<boolean | void> {
    return $(this.selector).waitForDisplayed({
      reverse: !isShown,
    });
  }

  async isDisplayed(): Promise<boolean> {
    return $(this.selector).isDisplayed();
  }

  static async clickBackButton() {
    $('~button-back').click();
  }
}
