// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { mainBgColor } from '@petra/core/colors';
import WalletLayout from 'core/layouts/WalletLayout';
import NewExtensionBody from 'core/components/NewExtensionBody';
import Browser, { isMobile } from '@petra/core/utils/browser';
/**
 * First screen that is shown to the user when they download the extension
 */
function NoWallet() {
  const shouldShowOnboarding =
    !Browser.isDev() && !window.location.pathname.includes('onboarding');

  useEffect(() => {
    if (isMobile() || !shouldShowOnboarding) {
      return;
    }

    async function openOnboarding() {
      const { id: extensionId } = chrome.runtime;
      const tabs = await chrome.tabs.query({});
      const existingTab = tabs.find((tab) => {
        const url = tab.url ? new URL(tab.url) : undefined;
        return (
          url?.hostname === extensionId && url?.pathname === '/onboarding.html'
        );
      });

      if (existingTab?.id != null) {
        await chrome.tabs.update(existingTab.id, { active: true });
      } else {
        // open separate tab for desktop onboarding
        await chrome.tabs.create({
          url: 'onboarding.html',
        });
      }
    }

    openOnboarding();
    // Make sure the popup never opens
    window.close();
  }, [shouldShowOnboarding]);

  return (
    <WalletLayout
      hasWalletFooter={false}
      hasWalletHeader={false}
      bgColor={mainBgColor}
      borderRadius={shouldShowOnboarding ? '2rem' : ''}
    >
      <Box p={6} width="100%" height="100%" paddingTop={8}>
        <NewExtensionBody />
      </Box>
    </WalletLayout>
  );
}

export default NoWallet;
