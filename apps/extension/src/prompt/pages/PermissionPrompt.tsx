// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import {
  ensureMultiAgentPayloadDeserialized,
  ensurePayloadDeserialized,
} from '@petra/core/serialization';
import TransactionSignatureRequestPrompt from 'prompt/components/TransactionSignatureRequestPrompt';
import { useApprovalRequestContext } from '../hooks';
import {
  ConnectRequestPrompt,
  TransactionApprovalPrompt,
  SignatureRequestPrompt,
} from '../components';

export default function PermissionsPrompt() {
  const {
    approvalRequest: { args },
  } = useApprovalRequestContext();

  switch (args.type) {
    case 'connect':
      return <ConnectRequestPrompt />;
    case 'signAndSubmitTransaction': {
      return (
        <TransactionApprovalPrompt
          payload={ensurePayloadDeserialized(args.payload)}
        />
      );
    }
    case 'signTransaction': {
      return (
        <TransactionSignatureRequestPrompt
          payload={ensurePayloadDeserialized(args.payload)}
          options={args.options}
        />
      );
    }
    case 'signMultiAgentTransaction': {
      return (
        <TransactionSignatureRequestPrompt
          payload={ensureMultiAgentPayloadDeserialized(args.payload)}
        />
      );
    }
    case 'signMessage':
      return (
        <SignatureRequestPrompt
          message={args.message}
          fullMessage={args.fullMessage}
        />
      );
    default:
      return null;
  }
}
