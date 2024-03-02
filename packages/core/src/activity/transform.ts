// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable max-classes-per-file */

import { normalizeTimestamp } from '../transactions';
import { CoinInfoData } from '../types';
import { AptosName } from '../utils/names';
import type {
  ActivityEvent,
  BaseEvent,
  GasEvent,
  SendTokenEvent,
  ReceiveTokenEvent,
  SendTokenOfferEvent,
  ReceiveTokenOfferEvent,
  MintTokenEvent,
  AptosIdentity,
  SwapCoinEventBase,
  SendCoinEventBase,
  ReceiveCoinEventBase,
  StakeEventBase,
} from './types';

// TODO: Update these types when the schema is finalized.
type IndexerPetraActivity = {
  account_address: string;
  coin_activities: IndexerCoinActivity[];
  delegated_staking_activities: IndexerStakeActivity[];
  token_activities: IndexerTokenActivity[];
  transaction_version: bigint;
};

type IndexerCoinActivity = {
  activity_type: string;
  amount: any;
  aptos_names: { domain: string }[];
  block_height: any;
  coin_info?: {
    coin_type: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  coin_type: string;
  entry_function_id_str?: string | null;
  event_account_address: string;
  event_creation_number: any;
  event_sequence_number: any;
  is_gas_fee: boolean;
  is_transaction_success: boolean;
  transaction_timestamp: any;
  transaction_version: any;
};

type IndexerTokenActivity = {
  aptos_names_owner: { domain: string }[];
  aptos_names_to: { domain: string }[];
  coin_amount?: any | null;
  coin_type?: string | null;
  collection_data_id_hash: string;
  collection_name: string;
  creator_address: string;
  current_token_data: {
    metadata_uri: string;
  };
  event_account_address: string;
  event_creation_number: any;
  event_sequence_number: any;
  from_address?: string | null;
  name: string;
  property_version: any;
  to_address?: string | null;
  token_amount: any;
  token_data_id_hash: string;
  transaction_timestamp: any;
  transaction_version: any;
  transfer_type: string;
};

type IndexerStakeActivity = {
  amount: string;
  delegator_address: string;
  event_index: number;
  event_type: string;
  pool_address: string;
  transaction_version: number;
};

export class GasNotFoundError extends Error {}
export class DepositWithdrawalMismatchError extends Error {}

function aptosIdentityFromActivity(
  activity: IndexerCoinActivity,
): AptosIdentity {
  return {
    address: activity.event_account_address,
    name: activity.aptos_names[0]?.domain
      ? new AptosName(activity.aptos_names[0].domain)
      : undefined,
  };
}

function toAptosIdentityFromActivity(
  activity: IndexerTokenActivity,
): AptosIdentity | undefined {
  if (!activity.to_address) {
    return undefined;
  }
  return {
    address: activity.to_address,
    name: activity.aptos_names_to[0]?.domain
      ? new AptosName(activity.aptos_names_to[0].domain)
      : undefined,
  };
}

function ownerAptosIdentityFromActivity(
  activity: IndexerTokenActivity,
): AptosIdentity | undefined {
  if (!activity.from_address) {
    return undefined;
  }
  return {
    address: activity.from_address,
    name: activity.aptos_names_owner[0]?.domain
      ? new AptosName(activity.aptos_names_owner[0].domain)
      : undefined,
  };
}

function separateCoinDepositsWithdrawals(
  coinActivities: IndexerCoinActivity[],
) {
  const deposits = [];
  const withdrawals = [];

  for (const coinActivity of coinActivities) {
    if (coinActivity.activity_type === '0x1::coin::DepositEvent') {
      deposits.push(coinActivity);
    } else if (coinActivity.activity_type === '0x1::coin::WithdrawEvent') {
      withdrawals.push(coinActivity);
    }
  }

  // TODO: Refactor to better handle multiple deposits/withdrawals matching.
  deposits.sort((a, b) => a.amount - b.amount);
  withdrawals.sort((a, b) => a.amount - b.amount);
  return [deposits, withdrawals];
}

function separateTokenDepositsWithdrawals(
  tokenActivities: IndexerTokenActivity[],
) {
  const deposits = [];
  const withdrawals = [];

  for (const tokenActivity of tokenActivities) {
    if (tokenActivity.transfer_type === '0x3::token::DepositEvent') {
      deposits.push(tokenActivity);
    } else if (tokenActivity.transfer_type === '0x3::token::WithdrawEvent') {
      withdrawals.push(tokenActivity);
    }
  }

  return [deposits, withdrawals];
}

function isCoinSwap(petraActivity: IndexerPetraActivity) {
  const coinTypes = new Set(
    petraActivity.coin_activities.map((ca) => ca.coin_type),
  );
  return (
    coinTypes.size > 1 &&
    petraActivity.coin_activities.every(
      (ca) => ca.event_account_address === petraActivity.account_address,
    )
  );
}

function processCoinInfo(
  activity: IndexerCoinActivity,
): CoinInfoData | undefined {
  const { coin_info: coinInfo } = activity;

  if (coinInfo) {
    return {
      decimals: coinInfo.decimals,
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      type: coinInfo.coin_type,
    };
  }

  return undefined;
}

function processCoinSwap(petraActivity: IndexerPetraActivity) {
  const result = [];
  const [deposits, withdrawals] = separateCoinDepositsWithdrawals(
    petraActivity.coin_activities,
  );

  if (deposits.length !== withdrawals.length) {
    throw new DepositWithdrawalMismatchError(
      'only one-for-one coin swaps are supported',
    );
  }

  for (let i = 0; i < deposits.length; i += 1) {
    const deposit = deposits[i];
    const withdrawal = withdrawals[i];
    const swapEvent: SwapCoinEventBase = {
      _type: 'swap',
      amount: BigInt(withdrawal.amount),
      coin: withdrawal.coin_type,
      coinInfo: processCoinInfo(withdrawal),
      swapAmount: BigInt(deposit.amount),
      swapCoin: deposit.coin_type,
    };

    result.push(swapEvent);
  }

  return result;
}

function processCoinTransfer(petraActivity: IndexerPetraActivity) {
  const result = [];
  const [deposits, withdrawals] = separateCoinDepositsWithdrawals(
    petraActivity.coin_activities,
  );

  for (let i = 0; i < deposits.length; i += 1) {
    const deposit = deposits[i];

    // TODO: Refactor to better handle multiple deposits/withdrawals matching.
    // will need to handle multiple withdrawals for a single deposit and vice / versa
    const withdrawal = withdrawals.filter(
      (w) => w.coin_type === deposit.coin_type,
    )[0];

    if (withdrawal === undefined) {
      throw new DepositWithdrawalMismatchError(
        'no matching withdrawal for deposit',
      );
    }

    if (withdrawal.event_account_address === petraActivity.account_address) {
      const sendEvent: SendCoinEventBase = {
        _type: 'send',
        amount: BigInt(deposit.amount),
        coin: withdrawal.coin_type,
        coinInfo: processCoinInfo(withdrawal),
        receiver: aptosIdentityFromActivity(deposit),
      };
      result.push(sendEvent);
    } else if (
      deposit.event_account_address === petraActivity.account_address
    ) {
      const receiveEvent: ReceiveCoinEventBase = {
        _type: 'receive',
        amount: BigInt(deposit.amount),
        coin: deposit.coin_type,
        coinInfo: processCoinInfo(deposit),
        sender: aptosIdentityFromActivity(withdrawal),
      };
      result.push(receiveEvent);
    } else {
      // Skip unrelated coin_activities.
    }
  }

  return result;
}

function transformCoinActivities(petraActivity: IndexerPetraActivity) {
  const result: Array<Partial<ActivityEvent>> = [];

  if (isCoinSwap(petraActivity)) {
    result.push(...processCoinSwap(petraActivity));
  } else {
    result.push(...processCoinTransfer(petraActivity));
  }

  return result;
}

function processMintToken(petraActivity: IndexerPetraActivity) {
  const result: Array<Partial<ActivityEvent>> = [];

  for (const tokenActivity of petraActivity.token_activities) {
    if (tokenActivity.transfer_type === '0x3::token::MintTokenEvent') {
      result.push({
        _type: 'mint_token',
        amount: BigInt(tokenActivity.token_amount),
        collection: tokenActivity.collection_name,
        minter: ownerAptosIdentityFromActivity(tokenActivity),
        name: tokenActivity.name,
        uri: tokenActivity.current_token_data.metadata_uri,
      } as Partial<MintTokenEvent>);
    }
  }

  return result;
}

function processIndirectTokenTransfer(petraActivity: IndexerPetraActivity) {
  const result: Array<Partial<ActivityEvent>> = [];

  for (const tokenActivity of petraActivity.token_activities) {
    if (
      tokenActivity.transfer_type === '0x3::token_transfers::TokenClaimEvent'
    ) {
      if (tokenActivity.to_address === petraActivity.account_address) {
        result.push({
          _type: 'receive_token',
          collection: tokenActivity.collection_name,
          name: tokenActivity.name,
          sender: ownerAptosIdentityFromActivity(tokenActivity),
          uri: tokenActivity.current_token_data.metadata_uri,
        } as Partial<ReceiveTokenEvent>);
      } else if (tokenActivity.from_address === petraActivity.account_address) {
        result.push({
          _type: 'send_token',
          collection: tokenActivity.collection_name,
          name: tokenActivity.name,
          receiver: toAptosIdentityFromActivity(tokenActivity),
          uri: tokenActivity.current_token_data.metadata_uri,
        } as Partial<SendTokenEvent>);
      }
    } else if (
      tokenActivity.transfer_type === '0x3::token_transfers::TokenOfferEvent'
    ) {
      if (tokenActivity.to_address === petraActivity.account_address) {
        result.push({
          _type: 'receive_token_offer',
          collection: tokenActivity.collection_name,
          name: tokenActivity.name,
          sender: ownerAptosIdentityFromActivity(tokenActivity),
          uri: tokenActivity.current_token_data.metadata_uri,
        } as Partial<ReceiveTokenOfferEvent>);
      } else if (tokenActivity.from_address === petraActivity.account_address) {
        result.push({
          _type: 'send_token_offer',
          collection: tokenActivity.collection_name,
          name: tokenActivity.name,
          receiver: toAptosIdentityFromActivity(tokenActivity),
          uri: tokenActivity.current_token_data.metadata_uri,
        } as Partial<SendTokenOfferEvent>);
      }
    }
  }

  return result;
}

function processTokenTransfer(petraActivity: IndexerPetraActivity) {
  const result = [];
  const [deposits, withdrawals] = separateTokenDepositsWithdrawals(
    petraActivity.token_activities,
  );

  // Not a transfer between 2 parties, but could be from a marketplace
  if (deposits.length !== withdrawals.length) {
    for (const deposit of deposits) {
      if (deposit.event_account_address === petraActivity.account_address) {
        result.push({
          _type: 'receive_token',
          collection: deposit.collection_name,
          name: deposit.name,
          sender: null,
          uri: deposit.current_token_data.metadata_uri,
        } as Partial<ReceiveTokenEvent>);
      }
    }

    if (result.length) {
      return result;
    }

    throw new DepositWithdrawalMismatchError(
      'deposits must have corresponding withdrawals',
    );
  }

  // Handling Direct Transfers
  for (let i = 0; i < deposits.length; i += 1) {
    const deposit = deposits[i];
    const withdrawal = withdrawals[i];

    if (deposit.token_data_id_hash !== withdrawal.token_data_id_hash) {
      throw new DepositWithdrawalMismatchError('token hashes do not match');
    }

    if (deposit.event_account_address === petraActivity.account_address) {
      result.push({
        _type: 'receive_token',
        collection: deposit.collection_name,
        name: deposit.name,
        sender: ownerAptosIdentityFromActivity(withdrawal),
        uri: deposit.current_token_data.metadata_uri,
      } as Partial<ReceiveTokenEvent>);
    } else if (
      withdrawal.event_account_address === petraActivity.account_address
    ) {
      result.push({
        _type: 'send_token',
        collection: withdrawal.collection_name,
        name: withdrawal.name,
        receiver: toAptosIdentityFromActivity(deposit),
        uri: withdrawal.current_token_data.metadata_uri,
      } as Partial<SendTokenEvent>);
    } else {
      // Skip unrelated token_activities.
    }
  }

  return result;
}

function transformTokenActivities(petraActivity: IndexerPetraActivity) {
  const result: Array<Partial<ActivityEvent>> = [];

  if (
    petraActivity.token_activities.some(
      (ta) =>
        ta.transfer_type === '0x3::token_transfers::TokenClaimEvent' ||
        ta.transfer_type === '0x3::token_transfers::TokenOfferEvent',
    )
  ) {
    result.push(...processIndirectTokenTransfer(petraActivity));
  } else if (
    petraActivity.token_activities.some(
      (ta) => ta.transfer_type === '0x3::token::MintTokenEvent',
    )
  ) {
    result.push(...processMintToken(petraActivity));
  } else {
    result.push(...processTokenTransfer(petraActivity));
  }

  return result;
}

function transformStakeActivities(petraActivity: IndexerPetraActivity) {
  const result: Array<Partial<ActivityEvent>> = [];

  type Total = number;
  type PoolAddress = string;
  const totalWithdrawn: Record<PoolAddress, Total> = {};

  petraActivity.delegated_staking_activities.forEach((ta) => {
    const type = ta.event_type;

    let eventType: StakeEventBase['_type'];
    switch (type) {
      case '0x1::delegation_pool::AddStakeEvent':
        eventType = 'add-stake';
        break;
      case '0x1::delegation_pool::UnlockStakeEvent':
        eventType = 'unstake';
        break;
      case '0x1::delegation_pool::WithdrawStakeEvent':
        eventType = 'withdraw-stake';
        break;
      default:
        return;
    }

    // Withdraw events are broken up into chunks, we want to combine them
    // into a single event for users.
    if (eventType === 'withdraw-stake') {
      totalWithdrawn[ta.pool_address] =
        (totalWithdrawn[ta.pool_address] || 0) + Number(ta.amount);
      return;
    }

    const event: StakeEventBase = {
      _type: eventType,
      amount: Number(ta.amount).toString(),
      pool: ta.pool_address,
    };
    result.push(event);
  });

  Object.keys(totalWithdrawn).forEach((poolAddress) => {
    const event: StakeEventBase = {
      _type: 'withdraw-stake',
      amount: totalWithdrawn[poolAddress].toString(),
      pool: poolAddress,
    };
    result.push(event);
  });

  return result;
}

export function transformPetraActivity(
  petraActivity: IndexerPetraActivity,
): ActivityEvent[] {
  const gasEvent = petraActivity.coin_activities.find(
    (item) => item.activity_type === '0x1::aptos_coin::GasFeeEvent',
  );

  if (gasEvent === undefined) {
    throw new GasNotFoundError('this should never happen');
  }

  const coinActivities = transformCoinActivities(petraActivity);
  const tokenActivities = transformTokenActivities(petraActivity);
  const stakeActivities = transformStakeActivities(petraActivity);

  const hasStakeActivities = stakeActivities.length > 0;

  const result = [
    // Staking fires duplicate coin activities which we want to ignore.
    ...(hasStakeActivities ? [] : coinActivities),
    ...stakeActivities,
    ...tokenActivities,
  ];

  if (
    result.length === 0 &&
    gasEvent.event_account_address === petraActivity.account_address
  ) {
    // Emit a GasEvent when there were no other balance changes.
    result.push({
      _type: 'gas',
    } as Partial<GasEvent>);
  }

  const baseEvent: BaseEvent = {
    account: petraActivity.account_address,
    eventIndex: 0,
    gas: BigInt(gasEvent.amount),
    success: gasEvent.is_transaction_success,
    timestamp: new Date(normalizeTimestamp(gasEvent.transaction_timestamp)),
    version: BigInt(gasEvent.transaction_version),
  };

  for (let i = 0; i < result.length; i += 1) {
    baseEvent.eventIndex = i;
    Object.assign(result[i], baseEvent);
  }

  return result as ActivityEvent[];
}
