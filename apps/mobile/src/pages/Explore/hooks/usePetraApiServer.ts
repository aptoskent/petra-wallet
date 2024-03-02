// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { isPetraApiRequest, PetraApiServer } from '@petra/core/api';
import { useAppStorage } from '@petra/core/hooks/useStorage';
import { DappInfo } from '@petra/core/types';
import { RefObject, useMemo, useState } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { ApprovalModalHandle } from '../components/ApprovalModal';
import useModalApprovalClient from './useModalApprovalClient';

function safeParseJSON(serialized: string) {
  try {
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
}

interface UsePetraApiServerProps {
  approvalModalRef: RefObject<ApprovalModalHandle>;
  webViewRef: RefObject<WebView>;
}

export default function usePetraApiServer({
  approvalModalRef,
  webViewRef,
}: UsePetraApiServerProps) {
  const { persistentStorage } = useAppStorage();
  const approvalClient = useModalApprovalClient(approvalModalRef);
  const [dappInfo, setDappInfo] = useState<DappInfo>();

  const petraApiServer = useMemo(
    () => new PetraApiServer(persistentStorage, approvalClient),
    [persistentStorage, approvalClient],
  );

  async function handleRequest(event: WebViewMessageEvent) {
    const request = safeParseJSON(event.nativeEvent.data);
    if (dappInfo === undefined || !isPetraApiRequest(request)) {
      return;
    }

    const response = await petraApiServer.handleRequest(dappInfo, request);
    webViewRef.current?.injectJavaScript(
      `window.postMessage(${JSON.stringify(response)});`,
    );
  }

  return {
    handleRequest,
    setDappInfo,
  };
}
