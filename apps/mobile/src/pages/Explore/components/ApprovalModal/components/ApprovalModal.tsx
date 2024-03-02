// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  ApprovalRequestArgs,
  ApprovalResponseArgs,
  ApprovalResponseStatus,
} from '@petra/core/approval';
import ApprovalResponseError from '@petra/core/approval/error';
import { DappInfo } from '@petra/core/types';
import {
  AnalyticsEventTypeValues,
  dAppEvents,
} from '@petra/core/utils/analytics/events';

import {
  PetraBottomSheet,
  PetraBottomSheetBlurOverlay,
} from 'core/components/PetraBottomSheet';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { ApprovalModalContext } from '../contexts/ApprovalModalContext';
import ConnectionApprovalRequestBody from './ConnectionApprovalRequestBody';
import SignAndSubmitTransactionApprovalRequestBody from './SignAndSubmitTransactionApprovalRequestBody';
import SignMessageApprovalRequestBody from './SignMessageApprovalRequestBody';
import SignTransactionApprovalRequestBody from './SignTransactionApprovalRequestBody';

type ApprovalModalState = 'idle' | 'approving' | 'approved' | 'rejecting';

export interface ApprovalRequest {
  args: ApprovalRequestArgs;
  dappInfo: DappInfo;
  reject: (error: Error) => void;
  resolve: (args: ApprovalResponseArgs) => void;
}

interface ApprovalModalBodyProps {
  approvalRequest?: ApprovalRequest;
}

const ApprovalModalBody = memo(
  ({ approvalRequest }: ApprovalModalBodyProps) => {
    if (approvalRequest === undefined) {
      return null;
    }
    const { args } = approvalRequest;
    switch (args.type) {
      case 'connect':
        return <ConnectionApprovalRequestBody />;
      case 'signTransaction':
        return (
          <SignTransactionApprovalRequestBody {...args} type="transaction" />
        );
      case 'signMultiAgentTransaction':
        return (
          <SignTransactionApprovalRequestBody {...args} type="multiagent" />
        );
      case 'signAndSubmitTransaction':
        return <SignAndSubmitTransactionApprovalRequestBody {...args} />;
      case 'signMessage':
        return <SignMessageApprovalRequestBody {...args} />;
      default:
        return null;
    }
  },
);

export interface ApprovalModalHandle {
  request: (request: ApprovalRequest) => void;
}

export default forwardRef<ApprovalModalHandle>((_, ref) => {
  const [state, setState] = useState<ApprovalModalState>('idle');
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest>();
  const modalRef = useRef<BottomSheetModal>(null);
  const { trackEvent } = useTrackEvent();

  // ApprovalModal API accessible through the passed ref
  useImperativeHandle(
    ref,
    () => ({
      request(newApprovalRequest) {
        setState('idle');
        setApprovalRequest(newApprovalRequest);
        modalRef.current?.present();
      },
    }),
    [],
  );

  const handleDismissedAddMetric = (appReq: ApprovalRequest | undefined) => {
    if (appReq != null) {
      let eventType: null | AnalyticsEventTypeValues = null;
      switch (appReq.args.type) {
        case 'connect':
          eventType = dAppEvents.DISMISS_DAPP_CONNECTION;
          break;
        case 'signTransaction':
          eventType = dAppEvents.DISMISS_SIGN_TRANSACTION;
          break;
        case 'signMultiAgentTransaction':
          eventType = dAppEvents.DISMISS_SIGN_MULTI_AGENT_TRANSACTION;
          break;
        case 'signAndSubmitTransaction':
          eventType = dAppEvents.DISMISS_SIGN_AND_SUBMIT_TRANSACTION;
          break;
        case 'signMessage':
          eventType = dAppEvents.DISMISS_SIGN_MESSAGE;
          break;
        default:
          eventType = null;
      }

      if (eventType !== null) {
        void trackEvent({
          eventType,
          params: {
            dAppDomain: appReq.dappInfo.domain,
            dAppImageURI: appReq.dappInfo.imageURI,
            dAppName: appReq.dappInfo.name,
          },
        });
      }
    }
  };

  const approvalModalContextValue = useMemo(() => {
    if (approvalRequest === undefined) {
      return undefined;
    }

    const onApproved = (args: ApprovalResponseArgs) => {
      approvalRequest.resolve(args);
      setState('approved');
      modalRef.current?.dismiss();
    };

    const onReject = () => {
      setState('rejecting');
      modalRef.current?.dismiss();
    };

    // Handles approval async state
    const handleApproval = (callback: () => Promise<void>) => async () => {
      setState('approving');
      try {
        await callback();
      } catch (err) {
        Alert.alert(
          'Approval error',
          err instanceof Error ? err.message : JSON.stringify(err),
        );
      } finally {
        setState((prevState) =>
          prevState === 'approving' ? 'idle' : prevState,
        );
      }
    };

    return {
      dappInfo: approvalRequest.dappInfo,
      handleApproval,
      onApproved,
      onReject,
    };
  }, [approvalRequest, modalRef]);

  const onDismiss = () => {
    if (state === 'idle') {
      handleDismissedAddMetric(approvalRequest);
      approvalRequest?.reject(
        new ApprovalResponseError(ApprovalResponseStatus.Rejected),
      );
    } else if (state === 'rejecting') {
      approvalRequest?.reject(
        new ApprovalResponseError(ApprovalResponseStatus.Rejected),
      );
      setState('idle');
    }
  };

  return (
    <PetraBottomSheet
      modalRef={modalRef}
      onDismiss={onDismiss}
      isDismissable={state === 'idle'}
    >
      {state === 'approving' ? <PetraBottomSheetBlurOverlay /> : null}
      <ApprovalModalContext.Provider value={approvalModalContextValue}>
        <ApprovalModalBody approvalRequest={approvalRequest} />
      </ApprovalModalContext.Provider>
    </PetraBottomSheet>
  );
});
