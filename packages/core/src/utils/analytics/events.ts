// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { MaybeHexString } from 'aptos';
import BuyProvider from '../../types/buy';

interface EventSchema {
  [eventType: string]: {
    action: string;
    category: string;
    label?: string;
  };
}

const eventSchemaTypeCheck = <T extends EventSchema>(o: T) => o;

/**
 * @summary Should be tied to a page or module
 */
export const analyticsCategories = Object.freeze({
  ACCOUNT: 'Account',
  BUY: 'Buy',
  COIN: 'Coin',
  COLLECTIBLES: 'Collectibles',
  DAPP: 'DApp',
  DEVELOPMENT: 'Development',
  FAUCET: 'Faucet',
  REDIRECT: 'Redirect',
  STAKING: 'Staking',
  TRANSACTION: 'Transaction',
} as const);

/**
 *     /\                            | |
 *    /  \   ___ ___ ___  _   _ _ __ | |_
 *   / /\ \ / __/ __/ _ \| | | | '_ \| __|
 *  / ____ \ (_| (_| (_) | |_| | | | | |_
 * /_/    \_\___\___\___/ \__,_|_| |_|\__|
 *
 * Account Analytics Events
 */

const accountActions = Object.freeze({
  CREATE_ACCOUNT: 'Create account',
  IMPORT_ACCOUNT: 'Import account',
  LOGIN_WITH_PRIVATE_KEY: 'Login with private key',
  REMOVE_ACCOUNT: 'Remove account',
  SIGN_OUT: 'Sign out',
  SWITCH_ACCOUNT: 'Switch account',
} as const);

const accountLabels = Object.freeze({
  CREATE_ACCOUNT: 'Create account',
  IMPORT_ACCOUNT: 'Import account',
  LOGIN_WITH_PRIVATE_KEY: 'Login',
  REMOVE_ACCOUNT: 'Remove account',
  SIGN_OUT: 'Sign out',
  SWITCH_ACCOUNT: 'Switch account',
} as const);

export const loginEvents = eventSchemaTypeCheck({
  ERROR_LOGIN_WITH_PRIVATE_KEY: {
    action:
      `${accountActions.LOGIN_WITH_PRIVATE_KEY} - invalid private key` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.LOGIN_WITH_PRIVATE_KEY} error` as const,
  },
  LOGIN_WITH_PRIVATE_KEY: {
    action: accountActions.LOGIN_WITH_PRIVATE_KEY,
    category: analyticsCategories.ACCOUNT,
    label: accountLabels.LOGIN_WITH_PRIVATE_KEY,
  },
} as const);

export const createAccountEvents = eventSchemaTypeCheck({
  CREATE_ACCOUNT: {
    action: accountActions.CREATE_ACCOUNT,
    category: analyticsCategories.ACCOUNT,
    label: accountLabels.CREATE_ACCOUNT,
  },
  ERROR_CREATE_ACCOUNT: {
    action:
      `${accountActions.CREATE_ACCOUNT} - unable to create account` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.CREATE_ACCOUNT} error` as const,
  },
} as const);

export const importAccountEvents = eventSchemaTypeCheck({
  ACCOUNT_ALREADY_IMPORTED: {
    action: `${accountActions.IMPORT_ACCOUNT} - already imported` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountActions.IMPORT_ACCOUNT} - already imported` as const,
  },
  ERROR_IMPORT_MNEMONIC_ACCOUNT: {
    action:
      `${accountActions.IMPORT_ACCOUNT} - unable to import mnemonic` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.IMPORT_ACCOUNT} mnemonic error` as const,
  },
  ERROR_IMPORT_PK_ACCOUNT: {
    action:
      `${accountActions.IMPORT_ACCOUNT} - unable to import private key` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.IMPORT_ACCOUNT} private key error` as const,
  },
  IMPORT_MNEMONIC_ACCOUNT: {
    action: `${accountActions.IMPORT_ACCOUNT} - mnemonic` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.IMPORT_ACCOUNT} mnemonic` as const,
  },
  IMPORT_PK_ACCOUNT: {
    action: `${accountActions.IMPORT_ACCOUNT} - private key` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.IMPORT_ACCOUNT} private key` as const,
  },
} as const);

export const switchAccountEvents = eventSchemaTypeCheck({
  ERROR_SWITCHING_ACCOUNT: {
    action:
      `${accountActions.SWITCH_ACCOUNT} - unable to switch account` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.SWITCH_ACCOUNT} error` as const,
  },
  SWITCH_ACCOUNT: {
    action: accountActions.SWITCH_ACCOUNT,
    category: analyticsCategories.ACCOUNT,
    label: accountLabels.SWITCH_ACCOUNT,
  },
} as const);

export const removeAccountEvents = eventSchemaTypeCheck({
  ERROR_REMOVE_ACCOUNT: {
    action:
      `${accountActions.REMOVE_ACCOUNT} - unable to remove account` as const,
    category: analyticsCategories.ACCOUNT,
    label: `${accountLabels.REMOVE_ACCOUNT} error` as const,
  },
  REMOVE_ACCOUNT: {
    action: accountActions.REMOVE_ACCOUNT,
    category: analyticsCategories.ACCOUNT,
    label: accountLabels.REMOVE_ACCOUNT,
  },
});

export const signOutEvents = eventSchemaTypeCheck({
  SIGN_OUT: {
    action: accountActions.SIGN_OUT,
    category: analyticsCategories.ACCOUNT,
    label: accountLabels.SIGN_OUT,
  },
} as const);

export const accountEvents = eventSchemaTypeCheck({
  ...loginEvents,
  ...createAccountEvents,
  ...signOutEvents,
  ...switchAccountEvents,
  ...importAccountEvents,
  ...removeAccountEvents,
} as const);

export interface AccountEventParams {
  address?: MaybeHexString;
  isAddAccount?: boolean;
}

/**
 * Development Analytics Events - tracking related to implementation not a specific user function
 */

const developmentActions = Object.freeze({
  FUNCTION_NOT_FOUND: 'Function not found',
} as const);
export const developmentEvents = eventSchemaTypeCheck({
  FUNCTION_NOT_FOUND: {
    action: developmentActions.FUNCTION_NOT_FOUND,
    category: analyticsCategories.DEVELOPMENT,
    label: developmentActions.FUNCTION_NOT_FOUND,
  },
});

/**
 *  _______                  __         __
 * |  ___  |                | |(_)     | |
 * | |   | | ___  ____ ____ | |_______ | | __
 * | |   | |/   \/   \|    \| | |   _ \| |/ /
 * | |___| |  ()_| ()_| ()  | | |  / \ |   <
 * |_______|\___/\___/|  __/|_|_|_|  |_|_|\_\
 *                    |_|
 * Deeplink Analytics Events
 */
export interface DeeplinkEventParams {
  error?: string;
  url?: string;
}

const deeplinkActions = Object.freeze({
  READ_ADDRESS: 'Read qr code address',
  READ_QR_CODE: 'Read qr code',
  REDIRECT_EXPLORE: 'Redirect Explore',
  REDIRECT_RENFIELD: 'Redirect Renfield',
  REDIRECT_SEND: 'Redirect Send',
  SCAN_CODE: 'Scan code',
  SHOW_ADDRESS_QR_CODE: 'Show address QR code',
} as const);

const deeplinklabels = Object.freeze({
  REDIRECT_EXPLORE: 'Redirect explore',
  REDIRECT_RENFIELD: 'Redirect renfield',
  REDIRECT_SEND: 'Redirect send',
  SCAN_CODE: 'Scan code',
  SHOW_ADDRESS_QR_CODE: 'Show address QR code',
} as const);

export const deeplinkEvents = eventSchemaTypeCheck({
  ERROR_READ_ADDRESS: {
    action: `${deeplinkActions.READ_ADDRESS}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.REDIRECT_SEND} error` as const,
  },
  ERROR_READ_QR_CODE: {
    action: `${deeplinkActions.READ_QR_CODE}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.REDIRECT_SEND} error` as const,
  },
  ERROR_REDIRECT_RENFIELD: {
    action: `${deeplinkActions.REDIRECT_RENFIELD}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.REDIRECT_RENFIELD} error` as const,
  },
  ERROR_REDIRECT_SEND: {
    action: `${deeplinkActions.REDIRECT_SEND}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.REDIRECT_SEND} error` as const,
  },
  REDIRECT_EXPLORE: {
    action: `${deeplinkActions.REDIRECT_EXPLORE}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.REDIRECT_EXPLORE}` as const,
  },
  REDIRECT_RENFIELD: {
    action: `${deeplinkActions.REDIRECT_RENFIELD}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.REDIRECT_RENFIELD}` as const,
  },
  REDIRECT_SEND: {
    action: `${deeplinkActions.REDIRECT_SEND}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.REDIRECT_SEND}` as const,
  },
  SCAN_CODE: {
    action: `${deeplinkActions.SCAN_CODE}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.SCAN_CODE}` as const,
  },
  SHOW_ADDRESS_QR_CODE: {
    action: `${deeplinkActions.SHOW_ADDRESS_QR_CODE}` as const,
    category: analyticsCategories.REDIRECT,
    label: `${deeplinklabels.SHOW_ADDRESS_QR_CODE}` as const,
  },
} as const);

/**
 *    _____     _
 *  / ____|    (_)
 * | |     ___  _ _ __
 * | |    / _ \| | '_ \
 * | |___| (_) | | | | |
 *  \_____\___/|_|_| |_|
 *
 * Coin Analytics Events
 */

const coinActions = Object.freeze({
  COIN_GECKO_FETCH: 'Coin gecko fetch',
  SWAP_COIN: 'Swap coin',
  TRANSFER_COIN: 'Transfer coin',
} as const);

const coinLabels = Object.freeze({
  ERROR_COIN_GECKO: 'Coin gecko error',
  SWAP_COIN: 'Swap coin',
  TRANSFER_APTOS_COIN: 'Transfer Aptos coin',
  TRANSFER_COIN: 'Transfer coin',
} as const);

export const coinEvents = eventSchemaTypeCheck({
  ERROR_COIN_GECKO_FETCH: {
    action: coinActions.COIN_GECKO_FETCH,
    category: analyticsCategories.COIN,
    label: coinLabels.ERROR_COIN_GECKO,
  },
  ERROR_HIPPO_TRADE_AGGREGATOR: {
    action: `${coinActions.SWAP_COIN} - unable to transfer coin` as const,
    category: analyticsCategories.COIN,
    label: `${coinLabels.SWAP_COIN} error` as const,
  },
  ERROR_TRANSFER_APTOS_COIN: {
    action: `${coinActions.TRANSFER_COIN} - unable to transfer coin` as const,
    category: analyticsCategories.COIN,
    label: `${coinLabels.TRANSFER_APTOS_COIN} error` as const,
  },
  ERROR_TRANSFER_COIN: {
    action: `${coinActions.TRANSFER_COIN} - unable to transfer coin` as const,
    category: analyticsCategories.COIN,
    label: `${coinLabels.TRANSFER_COIN} error` as const,
  },
  TRANSFER_APTOS_COIN: {
    action: coinActions.TRANSFER_COIN,
    category: analyticsCategories.COIN,
    label: coinLabels.TRANSFER_APTOS_COIN,
  },
  TRANSFER_COIN: {
    action: coinActions.TRANSFER_COIN,
    category: analyticsCategories.COIN,
    label: coinLabels.TRANSFER_COIN,
  },
} as const);

export interface CoinEventParams {
  amount?: string;
  coinType?: string;
  fromAddress?: MaybeHexString;
  toAddress?: MaybeHexString;
  transactionDurationShown?: string;
}

/**
 *    _____      _ _           _   _ _     _
 *  / ____|    | | |         | | (_) |   | |
 *  | |     ___ | | | ___  ___| |_ _| |__ | | ___  ___
 *  | |    / _ \| | |/ _ \/ __| __| | '_ \| |/ _ \/ __|
 *  | |___| (_) | | |  __/ (__| |_| | |_) | |  __/\__ \
 *   \_____\___/|_|_|\___|\___|\__|_|_.__/|_|\___||___/
 *
 * Collectibles Analytics Events
 */

const collectiblesActions = Object.freeze({
  CLAIM_TOKEN: 'Transfer token',
  CREATE_TOKEN: 'Create token',
  OFFER_TOKEN: 'Offer token',
} as const);

const collectiblesLabels = Object.freeze({
  CLAIM_NFT: 'Claim NFT',
  CLAIM_TOKEN: 'Claim token',
  CREATE_NFT: 'Create NFT',
  CREATE_TOKEN: 'Create token',
  OFFER_NFT: 'Offer NFT',
  OFFER_TOKEN: 'Offer token',
} as const);

export const collectiblesEvents = eventSchemaTypeCheck({
  CLAIM_NFT: {
    action: collectiblesActions.CLAIM_TOKEN,
    category: analyticsCategories.COLLECTIBLES,
    label: collectiblesLabels.CLAIM_NFT,
  },
  CLAIM_TOKEN: {
    action: collectiblesActions.CLAIM_TOKEN,
    category: analyticsCategories.COLLECTIBLES,
    label: collectiblesLabels.CLAIM_TOKEN,
  },
  CREATE_NFT: {
    action: collectiblesActions.CREATE_TOKEN,
    category: analyticsCategories.COLLECTIBLES,
    label: collectiblesLabels.CREATE_NFT,
  },
  CREATE_TOKEN: {
    action: collectiblesActions.CREATE_TOKEN,
    category: analyticsCategories.COLLECTIBLES,
    label: collectiblesLabels.CREATE_TOKEN,
  },
  ERROR_CLAIM_TOKEN: {
    action:
      `${collectiblesActions.CLAIM_TOKEN} - unable to claim token` as const,
    category: analyticsCategories.COLLECTIBLES,
    label: `${collectiblesLabels.CLAIM_TOKEN} error` as const,
  },
  OFFER_NFT: {
    action: collectiblesActions.OFFER_TOKEN,
    category: analyticsCategories.COLLECTIBLES,
    label: collectiblesLabels.OFFER_NFT,
  },
  OFFER_TOKEN: {
    action: collectiblesActions.OFFER_TOKEN,
    category: analyticsCategories.COLLECTIBLES,
    label: collectiblesLabels.OFFER_TOKEN,
  },
} as const);

export interface CollectibleEventParams {
  amount?: string;
  collectionName?: string;
  description?: string;
  fromAddress?: MaybeHexString;
  name?: string;
  toAddress?: MaybeHexString;
  uri?: string;
}

/**
 *
 * Staking Analytics Events
 */

const stakingActions = Object.freeze({
  ADVANCED_MODE_TOGGLED: 'Toggle advanced mode',
  FIRST_TIME_STAKE_BANNER: 'View first time stake',
  NAVIGATE_TO_BUY: 'Navigate to buy',
  PRESS_FAQ_BUTTON: 'FAQ pressed',
  STAKE_ERROR: 'Stake error',
  STAKE_POOL_SELECTED: 'Selected stake pool',
  STAKE_SUCCESS: 'Stake success',
  UNKNOWN_STAKING_EVENT: 'Unknown staking event',
  UNSTAKE_ERROR: 'Unstake error',
  UNSTAKE_SUCCESS: 'Unstake success',
  VIEW_STAKING_TERM: 'View staking term',
  WITHDRAW_ERROR: 'Withdraw error',
  WITHDRAW_SUCCESS: 'Withdraw success',
} as const);

export const stakingEvents = eventSchemaTypeCheck({
  ADVANCED_MODE_TOGGLED: {
    action: stakingActions.ADVANCED_MODE_TOGGLED,
    category: analyticsCategories.STAKING,
    label: stakingActions.ADVANCED_MODE_TOGGLED,
  },
  FIRST_TIME_STAKE_BANNER: {
    action: stakingActions.FIRST_TIME_STAKE_BANNER,
    category: analyticsCategories.STAKING,
    label: stakingActions.FIRST_TIME_STAKE_BANNER,
  },
  NAVIGATE_TO_BUY: {
    action: stakingActions.NAVIGATE_TO_BUY,
    category: analyticsCategories.STAKING,
    label: stakingActions.NAVIGATE_TO_BUY,
  },
  PRESS_FAQ_BUTTON: {
    action: stakingActions.PRESS_FAQ_BUTTON,
    category: analyticsCategories.STAKING,
    label: stakingActions.PRESS_FAQ_BUTTON,
  },
  STAKE_ERROR: {
    action: stakingActions.STAKE_ERROR,
    category: analyticsCategories.STAKING,
    label: stakingActions.STAKE_ERROR,
  },
  STAKE_POOL_SELECTED: {
    action: stakingActions.STAKE_POOL_SELECTED,
    category: analyticsCategories.STAKING,
    label: stakingActions.STAKE_POOL_SELECTED,
  },
  STAKE_SUCCESS: {
    action: stakingActions.STAKE_SUCCESS,
    category: analyticsCategories.STAKING,
    label: stakingActions.STAKE_SUCCESS,
  },
  UNKNOWN_STAKING_EVENT: {
    action: stakingActions.UNKNOWN_STAKING_EVENT,
    category: analyticsCategories.STAKING,
    label: stakingActions.UNKNOWN_STAKING_EVENT,
  },
  UNSTAKE_ERROR: {
    action: stakingActions.UNSTAKE_ERROR,
    category: analyticsCategories.STAKING,
    label: stakingActions.UNSTAKE_ERROR,
  },
  UNSTAKE_SUCCESS: {
    action: stakingActions.UNSTAKE_SUCCESS,
    category: analyticsCategories.STAKING,
    label: stakingActions.UNSTAKE_SUCCESS,
  },
  VIEW_STAKING_TERM: {
    action: stakingActions.VIEW_STAKING_TERM,
    category: analyticsCategories.STAKING,
    label: stakingActions.VIEW_STAKING_TERM,
  },
  WITHDRAW_ERROR: {
    action: stakingActions.WITHDRAW_ERROR,
    category: analyticsCategories.STAKING,
    label: stakingActions.WITHDRAW_ERROR,
  },
  WITHDRAW_SUCCESS: {
    action: stakingActions.WITHDRAW_SUCCESS,
    category: analyticsCategories.STAKING,
    label: stakingActions.WITHDRAW_SUCCESS,
  },
} as const);

export interface StakingEventParams {
  hasMinimumToStake?: boolean;
  selectStakePoolMode?: 'advanced' | 'simple';
  stakingScreen?:
    | 'first time stake banner'
    | 'enter stake amount'
    | 'stake details'
    | 'stake list'
    | 'terminal'
    | 'unstake calculator'
    | 'select stake pool'
    | 'confirm stake';
  stakingTerm?: string;
  unknownStakingEvent?: string;
  validatorSelectionRank?: number;
  validatorTotalOptions?: number;
}

/**
 *   ______                   _
 * |  ____|                 | |
 * | |__ __ _ _   _  ___ ___| |_
 * |  __/ _` | | | |/ __/ _ \ __|
 * | | | (_| | |_| | (_|  __/ |_
 * |_|  \__,_|\__,_|\___\___|\__|
 *
 * Faucet Analytics Events
 */

const faucetActions = Object.freeze({
  CLICK_FAUCET: 'Click faucet',
} as const);

export const faucetEvents = eventSchemaTypeCheck({
  ERROR_RECEIVE_FAUCET: {
    action: `${faucetActions.CLICK_FAUCET} - unable to query faucet` as const,
    category: analyticsCategories.FAUCET,
    label: `${faucetActions.CLICK_FAUCET} error` as const,
  },
  RECEIVE_FAUCET: {
    action: faucetActions.CLICK_FAUCET,
    category: analyticsCategories.FAUCET,
    label: faucetActions.CLICK_FAUCET,
  },
} as const);

export interface FaucetEventParams {
  address?: MaybeHexString;
  amount?: string;
}

/**
 * Buy Analytics Events
 */
const buyActions = Object.freeze({
  FETCH_BUY_PROVIDERS: 'Fetch buy providers',
  OPEN_WINDOW: 'Open Buy window',
} as const);

export const buyEvents = eventSchemaTypeCheck({
  ERROR_BUY: {
    action: `${buyActions.OPEN_WINDOW} - unable to get buy url` as const,
    category: analyticsCategories.FAUCET,
    label: `${buyActions.OPEN_WINDOW} error` as const,
  },
  ERROR_FETCH_BUY_PROVIDERS: {
    action:
      `${buyActions.FETCH_BUY_PROVIDERS} - fetch providers failed` as const,
    category: analyticsCategories.BUY,
    label: `${buyActions.FETCH_BUY_PROVIDERS} error` as const,
  },
  ERROR_OPEN_BUY_URL: {
    action: `${buyActions.OPEN_WINDOW} - unable to open buy URL` as const,
    category: analyticsCategories.BUY,
    label: `${buyActions.OPEN_WINDOW} error` as const,
  },
  FETCH_BUY_PROVIDERS: {
    action: `${buyActions.FETCH_BUY_PROVIDERS}` as const,
    category: analyticsCategories.BUY,
    label: `${buyActions.FETCH_BUY_PROVIDERS} success` as const,
  },
  OPEN_BUY_OPTION: {
    action: buyActions.OPEN_WINDOW,
    category: analyticsCategories.BUY,
    label: buyActions.OPEN_WINDOW,
  },
} as const);

export interface BuyEventParams {
  provider?: BuyProvider | string;
}

/**
 *      _
 *     | |   /\
 *   __| |  /  \   _ __  _ __
 *  / _` | / /\ \ | '_ \| '_ \
 * | (_| |/ ____ \| |_) | |_) |
 *  \__,_/_/    \_\ .__/| .__/
 *                | |   | |
 *                |_|   |_|
 *
 * dApp Analytics Events
 */

const dAppLabels = Object.freeze({
  DAPP_CONNECTION: 'Connect to dApp',
  SIGN_AND_SUBMIT_TRANSACTION: 'Sign and submit transaction',
  SIGN_MESSAGE: 'Sign message',
  SIGN_MULTI_AGENT_TRANSACTION: 'Sign multi agent transaction',
  SIGN_TRANSACTION: 'Sign transaction',
} as const);

const dAppActions = Object.freeze({
  APPROVE_DAPP_CONNECTION: 'Approve dApp connection',
  APPROVE_SIGN_AND_SUBMIT_TRANSACTION: 'Approve sign and submit transaction',
  APPROVE_SIGN_MESSAGE: 'Approve sign message',
  APPROVE_SIGN_MULTI_AGENT_TRANSACTION: 'Approve sign multi agent transaction',
  APPROVE_SIGN_TRANSACTION: 'Approve sign transaction',
  BLOCKED_DAPP_CONNECTION: 'Blocked dApp connection',
  BLOCKED_SIGN_AND_SUBMIT_TRANSACTION: 'Blocked sign and submit transaction',
  BLOCKED_SIGN_MESSAGE: 'Blocked sign message',
  BLOCKED_SIGN_MULTI_AGENT_TRANSACTION: 'Blocked sign multi agent transaction',
  BLOCKED_SIGN_TRANSACTION: 'Blocked sign transaction',
  DISMISS_DAPP_CONNECTION: 'Dismiss dApp connection',
  DISMISS_SIGN_AND_SUBMIT_TRANSACTION: 'Dismiss sign and submit transaction',
  DISMISS_SIGN_MESSAGE: 'Dismiss sign message',
  DISMISS_SIGN_MULTI_AGENT_TRANSACTION: 'Dismiss sign multi agent transaction',
  DISMISS_SIGN_TRANSACTION: 'Dismiss sign transaction',
  REJECT_DAPP_CONNECTION: 'Reject dApp connection',
  REJECT_SIGN_AND_SUBMIT_TRANSACTION: 'Reject sign and submit transaction',
  REJECT_SIGN_MESSAGE: 'Reject sign message',
  REJECT_SIGN_MULTI_AGENT_TRANSACTION: 'Reject sign multi agent transaction',
  REJECT_SIGN_TRANSACTION: 'Reject sign transaction',
} as const);

export const dAppEvents = eventSchemaTypeCheck({
  APPROVE_DAPP_CONNECTION: {
    action: dAppActions.APPROVE_DAPP_CONNECTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.DAPP_CONNECTION,
  },
  APPROVE_SIGN_AND_SUBMIT_TRANSACTION: {
    action: dAppActions.APPROVE_SIGN_AND_SUBMIT_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_AND_SUBMIT_TRANSACTION,
  },
  APPROVE_SIGN_MESSAGE: {
    action: dAppActions.APPROVE_SIGN_MESSAGE,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_MESSAGE,
  },
  APPROVE_SIGN_MULTI_AGENT_TRANSACTION: {
    action: dAppActions.APPROVE_SIGN_MULTI_AGENT_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_MULTI_AGENT_TRANSACTION,
  },
  APPROVE_SIGN_TRANSACTION: {
    action: dAppActions.APPROVE_SIGN_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_TRANSACTION,
  },
  BLOCKED_DAPP_CONNECTION: {
    action: dAppActions.BLOCKED_DAPP_CONNECTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.DAPP_CONNECTION,
  },
  BLOCKED_SIGN_AND_SUBMIT_TRANSACTION: {
    action: dAppActions.BLOCKED_SIGN_AND_SUBMIT_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_AND_SUBMIT_TRANSACTION,
  },
  BLOCKED_SIGN_MESSAGE: {
    action: dAppActions.BLOCKED_SIGN_MESSAGE,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_MESSAGE,
  },
  BLOCKED_SIGN_MULTI_AGENT_TRANSACTION: {
    action: dAppActions.BLOCKED_SIGN_MULTI_AGENT_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_MULTI_AGENT_TRANSACTION,
  },
  BLOCKED_SIGN_TRANSACTION: {
    action: dAppActions.BLOCKED_SIGN_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: dAppLabels.SIGN_TRANSACTION,
  },
  DISMISS_DAPP_CONNECTION: {
    action: `${dAppActions.DISMISS_DAPP_CONNECTION}` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.DAPP_CONNECTION} dismissed` as const,
  },
  DISMISS_SIGN_AND_SUBMIT_TRANSACTION: {
    action:
      `${dAppActions.DISMISS_SIGN_AND_SUBMIT_TRANSACTION} - dismissed sign and submit` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_AND_SUBMIT_TRANSACTION} dismissal` as const,
  },
  DISMISS_SIGN_MESSAGE: {
    action: `${dAppActions.DISMISS_SIGN_MESSAGE}` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_MESSAGE} dismissal` as const,
  },
  DISMISS_SIGN_MULTI_AGENT_TRANSACTION: {
    action: `${dAppActions.DISMISS_SIGN_MULTI_AGENT_TRANSACTION}` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_TRANSACTION} dismissal` as const,
  },
  DISMISS_SIGN_TRANSACTION: {
    action: dAppActions.DISMISS_SIGN_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_TRANSACTION} dismissal`,
  },
  ERROR_APPROVE_DAPP_CONNECTION: {
    action:
      `${dAppActions.APPROVE_DAPP_CONNECTION} - unable to approve` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.DAPP_CONNECTION} error` as const,
  },
  ERROR_APPROVE_SIGN_AND_SUBMIT_TRANSACTION: {
    action:
      `${dAppActions.APPROVE_SIGN_AND_SUBMIT_TRANSACTION} - unable to approve` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_AND_SUBMIT_TRANSACTION} error` as const,
  },
  ERROR_APPROVE_SIGN_MESSAGE: {
    action: `${dAppActions.APPROVE_SIGN_MESSAGE} - unable to approve` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_MESSAGE} error` as const,
  },
  ERROR_APPROVE_SIGN_MULTI_AGENT_TRANSACTION: {
    action:
      `${dAppActions.APPROVE_SIGN_TRANSACTION} - unable to approve` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_TRANSACTION} error` as const,
  },
  ERROR_APPROVE_SIGN_TRANSACTION: {
    action:
      `${dAppActions.APPROVE_SIGN_MULTI_AGENT_TRANSACTION} - unable to approve` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_MULTI_AGENT_TRANSACTION} error` as const,
  },
  REJECT_DAPP_CONNECTION: {
    action: `${dAppActions.REJECT_DAPP_CONNECTION}` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.DAPP_CONNECTION} rejection` as const,
  },
  REJECT_SIGN_AND_SUBMIT_TRANSACTION: {
    action:
      `${dAppActions.REJECT_SIGN_AND_SUBMIT_TRANSACTION} - rejected sign and submit` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_AND_SUBMIT_TRANSACTION} rejection` as const,
  },
  REJECT_SIGN_MESSAGE: {
    action: `${dAppActions.REJECT_SIGN_MESSAGE}` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_MESSAGE} rejection` as const,
  },
  REJECT_SIGN_MULTI_AGENT_TRANSACTION: {
    action: `${dAppActions.REJECT_SIGN_MULTI_AGENT_TRANSACTION}` as const,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_TRANSACTION} rejection` as const,
  },
  REJECT_SIGN_TRANSACTION: {
    action: dAppActions.REJECT_SIGN_TRANSACTION,
    category: analyticsCategories.DAPP,
    label: `${dAppLabels.SIGN_TRANSACTION} rejection`,
  },
} as const);

export type DAppEventParams = {
  dAppDomain?: string;
  dAppImageURI?: string;
  dAppName?: string;
};

/**
 *
 *    _____                           _
 *  / ____|                         | |
 * | |  __  ___ _ __   ___ _ __ __ _| |
 * | | |_ |/ _ \ '_ \ / _ \ '__/ _` | |
 * | |__| |  __/ | | |  __/ | | (_| | |
 *  \_____|\___|_| |_|\___|_|  \__,_|_|
 *
 * General Analytics Events
 */

export interface GeneralEventParams {
  error?: string;
  network?: string;
  txnHash?: string;
}

export type CombinedEventParams = Omit<
  AccountEventParams &
    BuyEventParams &
    CoinEventParams &
    CollectibleEventParams &
    FaucetEventParams &
    DAppEventParams &
    DeeplinkEventParams &
    GeneralEventParams &
    StakingEventParams,
  'omit'
>;

export type CombinedEventParamsKeys = keyof CombinedEventParams;
export type CombinedEventParamsValues =
  CombinedEventParams[keyof CombinedEventParams];

export const analyticsEvent = Object.freeze({
  ...accountEvents,
  ...buyEvents,
  ...collectiblesEvents,
  ...coinEvents,
  ...faucetEvents,
  ...dAppEvents,
  ...deeplinkEvents,
  ...developmentEvents,
  ...stakingEvents,
} as const);

export type AnalyticsEventType = typeof analyticsEvent;
export type AnalyticsEventTypeKeys = keyof typeof analyticsEvent;
export type AnalyticsEventTypeValues =
  (typeof analyticsEvent)[AnalyticsEventTypeKeys];
