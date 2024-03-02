// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { OS } from './os';

/**
 * Contains a few different variants of browsers
 */
export enum BrowserVariant {
  BRAVE = 'Brave',
  CHROME = 'Chrome',
  EDGE = 'Edge',
  EXPLORER = 'Explorer',
  FIREFOX = 'Firefox',
  KIWI = 'Kiwi',
  OPERA = 'Opera',
  SAFARI = 'Safari',
}

declare const InstallTrigger: any;

export function isOpera(): boolean {
  return (
    (!!(window as any).opr && !!(window as any).opr.addons) ||
    !!(window as any).opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0
  );
}

export function isFirefox(): boolean {
  return typeof InstallTrigger !== 'undefined';
}

export function isSafari(): boolean {
  return (
    /constructor/i.test((window as any).HTMLElement) ||
    ((p): boolean => p.toString() === '[object SafariRemoteNotification]')(
      !(window as any).safari || (window as any).safari.pushNotification,
    )
  );
}

export function isIE(): boolean {
  return /* @cc_on!@ */ false || !!(window as any).document.documentMode;
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function isChrome(): boolean {
  return !!window.chrome;
}

export function isBrave(): boolean {
  return (window as any).navigator.brave;
}

interface GetBrowserParams {
  os: OS | null;
}

/**
 * Get the client's browser
 */
export function getBrowser({ os }: GetBrowserParams): Browser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (isOpera()) {
    return BrowserVariant.OPERA;
  }
  if (isFirefox()) {
    return BrowserVariant.FIREFOX;
  }
  if (isSafari()) {
    return BrowserVariant.SAFARI;
  }
  if (isBrave()) {
    return BrowserVariant.BRAVE;
  }
  if (isChrome()) {
    // Kiwi uses chromium under the hood
    if (os && os === OS.ANDROID) {
      return BrowserVariant.KIWI;
    }
    return BrowserVariant.CHROME;
  }
  return null;
}

/**
 * Browser class
 */
export default class Browser {
  static isDev() {
    return process.env.NODE_ENV !== 'production';
  }

  public static runtime() {
    if (typeof chrome === 'undefined') {
      return null;
    }
    return chrome.runtime;
  }

  public static persistentStorage() {
    if (typeof chrome === 'undefined') {
      return null;
    }
    return chrome.storage.local;
  }

  public static sessionStorage() {
    if (typeof chrome === 'undefined') {
      return null;
    }
    // chrome.storage.session is still waiting to get into the @types/chrome
    return (chrome.storage as any).session;
  }

  public static tabs() {
    if (typeof chrome === 'undefined') {
      return null;
    }
    return chrome.tabs;
  }

  public static redirect(url: string) {
    if (typeof chrome === 'undefined') {
      window.location.assign(url);
    } else {
      chrome.tabs.update({ url });
    }
  }
}
