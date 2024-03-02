// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ApprovalResponseArgs } from '@petra/core/approval';
import makeContext from '@petra/core/hooks/makeContext';
import { DappInfo } from '@petra/core/types';

export interface ApprovalModalContextValue<
  TResponseArgs extends ApprovalResponseArgs = ApprovalResponseArgs,
> {
  dappInfo: DappInfo;
  handleApproval: (action: () => Promise<void>) => () => void;
  onApproved: (args: TResponseArgs) => void;
  onReject: () => void;
}

const [ApprovalModalContext, useGenericApprovalModalContext] =
  makeContext<ApprovalModalContextValue>('ApprovalModalContext');

const useApprovalModalContext = useGenericApprovalModalContext as <
  TResponseArgs extends ApprovalResponseArgs,
>() => ApprovalModalContextValue<TResponseArgs>;

export { ApprovalModalContext, useApprovalModalContext };
