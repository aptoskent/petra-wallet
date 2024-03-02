// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// region By status

import { AptosName } from '../utils/names';
import { CoinInfoData } from './resource';

export interface BaseConfirmedActivityItem {
  amount: bigint;
  coinInfo?: CoinInfoData;
  creationNum: number;
  sequenceNum: number;
  status: 'success' | 'failed';
  timestamp: number;
  txnVersion: bigint;
}

export interface UnconfirmedActivityItem {
  expirationTimestamp: number;
  status: 'pending' | 'expired';
  txnHash: string;
}

// endregion

// region By type

export type CoinEventActivityItem = BaseConfirmedActivityItem & {
  type: 'coinEvent';
};

export type CoinTransferActivityItem = BaseConfirmedActivityItem & {
  recipient: string;
  recipientName?: AptosName;
  sender: string;
  senderName?: AptosName;
  type: 'coinTransfer';
};

export type GasFeeActivityItem = BaseConfirmedActivityItem & {
  type: 'gasFee';
};

// endregion

export function isConfirmedActivityItem(
  item: ActivityItem,
): item is ConfirmedActivityItem {
  return item.status === 'success' || item.status === 'failed';
}

export type ConfirmedActivityItem =
  | CoinEventActivityItem
  | CoinTransferActivityItem
  | GasFeeActivityItem;
export type ActivityItem = ConfirmedActivityItem | UnconfirmedActivityItem;
