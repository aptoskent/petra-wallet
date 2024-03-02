// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import constate from 'constate';
import { useState } from 'react';

/**
 * Hook for prompt.
 */
export const [PromptProvider, usePrompt] = constate(() => {
  const [promptVisible, setPromptVisible] = useState<boolean>(false);
  const [promptContent, setPromptContent] = useState<JSX.Element | undefined>(
    undefined,
  );

  const showPrompt = (promptCont: JSX.Element | undefined) => {
    setPromptContent(promptCont);
    setPromptVisible(true);
  };

  const dismissPrompt = () => {
    setPromptContent(undefined);
    setPromptVisible(false);
  };

  return {
    dismissPrompt,
    promptContent,
    promptVisible,
    setPromptContent,
    setPromptVisible,
    showPrompt,
  };
});
