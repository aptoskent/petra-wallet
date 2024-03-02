// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useNetworks } from '@petra/core/hooks/useNetworks';
import { TransactionPayload } from '@petra/core/serialization';

import { AptosClient, TxnBuilderTypes } from 'aptos';
import { useEffect, useState } from 'react';
import getEntryFunctionPayloadInfo, {
  EntryFunctionInfo,
  EntryFunctionPayloadInfo,
} from './entryFunction';
import fetchMultisigPayloadInfo, { MultisigPayloadInfo } from './multisig';
import getScriptPayloadInfo, { ScriptPayloadInfo } from './script';
import getSerializedPayloadInfo, { SerializedPayloadInfo } from './serialized';

export type {
  EntryFunctionInfo,
  EntryFunctionPayloadInfo,
  ScriptPayloadInfo,
  MultisigPayloadInfo,
  SerializedPayloadInfo,
};

export type PayloadInfo =
  | EntryFunctionPayloadInfo
  | ScriptPayloadInfo
  | MultisigPayloadInfo
  | SerializedPayloadInfo;

async function fetchPayloadInfo(
  aptosClient: AptosClient,
  payload: TransactionPayload | TxnBuilderTypes.MultiAgentRawTransaction,
) {
  const isJsonPayload = !(
    payload instanceof TxnBuilderTypes.TransactionPayload ||
    payload instanceof TxnBuilderTypes.MultiAgentRawTransaction
  );

  if (isJsonPayload) {
    if (payload.type === 'multisig_payload') {
      return fetchMultisigPayloadInfo(aptosClient, payload);
    }
    return getEntryFunctionPayloadInfo(payload);
  }

  if (payload instanceof TxnBuilderTypes.TransactionPayloadEntryFunction) {
    return getEntryFunctionPayloadInfo(payload);
  }

  if (payload instanceof TxnBuilderTypes.TransactionPayloadScript) {
    return getScriptPayloadInfo(payload);
  }

  return getSerializedPayloadInfo(payload);
}

interface UsePayloadInfoLoadingResult {
  data: undefined;
  error: undefined;
  isLoading: true;
}

interface UsePayloadInfoSuccessResult {
  data: PayloadInfo;
  error: undefined;
  isLoading: false;
}

interface UsePayloadInfoErrorResult {
  data: undefined;
  error: Error;
  isLoading: false;
}

type UsePayloadInfoResult =
  | UsePayloadInfoLoadingResult
  | UsePayloadInfoSuccessResult
  | UsePayloadInfoErrorResult;

export default function usePayloadInfo(
  payload: TransactionPayload | TxnBuilderTypes.MultiAgentRawTransaction,
) {
  const { aptosClient } = useNetworks();
  const [state, setState] = useState<UsePayloadInfoResult>({
    data: undefined,
    error: undefined,
    isLoading: true,
  });

  useEffect(() => {
    setState({
      data: undefined,
      error: undefined,
      isLoading: true,
    });
    fetchPayloadInfo(aptosClient, payload)
      .then((data) => {
        setState({
          data,
          error: undefined,
          isLoading: false,
        });
      })
      .catch((error) => {
        setState({
          data: undefined,
          error,
          isLoading: false,
        });
      });
  }, [aptosClient, payload]);

  return state;
}
