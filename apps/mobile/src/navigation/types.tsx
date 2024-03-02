// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { TransactionOptions } from '@petra/core/transactions';
import type { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CoinInfoWithMetadata } from 'pages/Send/hooks/useAccountCoinResources';
import { Contact } from 'core/hooks/useRecentContacts';
import { TokenData } from '@petra/core/types';
import { StakeStates, Stake } from '@petra/core/queries/useStaking';
import { ActivityEvent } from '@petra/core/activity/types';
import { RawCoinInfoWithLogo } from 'pages/Assets/shared';
import { DappCategory } from 'pages/Explore/data/DappListSource';
import { PetraStakingInfo } from '@petra/core/queries/staking/types';

export type AppLaunchStackParamList = {
  AppLaunch: undefined;
  ImportStack?: { privateKey: string | undefined };
  SignupStack: undefined;
  Welcome: undefined;
};

export type ChooseAccountNameProps = {
  confirmedPassword?: string;
  fromRoute?: string;
  isAddAccount?: boolean;
  mnemonic?: string;
  privateKey?: string;
};

export type ImportStackParamList = {
  ImportMnemonic: { isAddAccount?: boolean };
  ImportOptions: undefined;
  ImportPrivateKey: { isAddAccount?: boolean };
  ImportWalletChooseAccountName: ChooseAccountNameProps;
  ImportWalletCongratsFinish: ChooseAccountNameProps & {
    accountName?: string;
  };
  ImportWalletPasswordCreation: {
    isAddAccount?: boolean;
    mnemonic: string | undefined;
    privateKey: string | undefined;
  };
};

export type LoginStackParamList = {
  Login: undefined;
};

type TabParamListKeys = keyof TabParamList;
type TabParamListValues = TabParamList[TabParamListKeys];

export type RootAuthenticatedStackParamList = {
  ActivityDetail: { event: ActivityEvent };
  AddAccountImportMnemonic: { isAddAccount: boolean };
  AddAccountOptions: undefined;
  AddAccountPrivateKey: { isAddAccount: boolean };
  AssetsBlock: undefined;
  AssetsRoot:
    | undefined
    | { params: TabParamListValues; screen: TabParamListKeys };
  Buy: undefined;
  ChangePassword: undefined;
  CoinDetails: { coinType: string };
  CoinsList: { allCoins: RawCoinInfoWithLogo[] };
  ConnectedApps: undefined;
  DirectTransferToken: undefined;
  EditAccountName: undefined;
  HelpSupport: undefined;
  ImportWalletChooseAccountName: { isAddAccount: boolean };
  ImportWalletCongratsFinish: { isAddAccount: boolean };
  ImportWalletPasswordCreation: {
    isAddAccount?: boolean;
    mnemonic: string | undefined;
    privateKey: string | undefined;
  };
  ManageAccount: { needsAuthentication: boolean };
  NFTDetails: {
    token: TokenData;
  };
  NFTsBlock: undefined;
  NFTsList: { address?: string; isNames?: boolean } | undefined;
  Network: undefined;
  PendingNFTs: undefined;
  PrivateKey: undefined;
  Reauthenticate: { children?: JSX.Element };
  Scanner: undefined;
  SecretRecoveryPhrase: undefined;
  SecurityPrivacy: undefined;
  SendFlow1: undefined;
  SendFlow2: { contact: Contact };
  SendFlow3: { coinInfo: CoinInfoWithMetadata; contact: Contact };
  SendFlow4: {
    amount: string;
    coinInfo: CoinInfoWithMetadata;
    contact: Contact;
    txnOptions?: TransactionOptions;
  };
  SendFlow5: {
    amount: string;
    coinInfo: CoinInfoWithMetadata;
    transactionDuration: number;
    usdAmount: number;
  };
  SettingList: undefined;
  Settings: undefined;
  SignUpChooseAccountName: ChooseAccountNameProps;
  SignUpCongratsFinish: ChooseAccountNameProps & {
    accountName?: string;
  };
  SignUpMnemonicDisplay: { confirmedPassword: string; isAddAccount?: boolean };
  SignUpMnemonicEntry: {
    confirmedPassword: string;
    isAddAccount?: boolean;
    mnemonic: string;
  };
  StakeFlowConfirmStake: {
    amount: string;
    info: PetraStakingInfo;
  };
  StakeFlowEnterAmount: undefined;
  StakeFlowEnterUnstakeAmount: {
    address: string;
    lockedUntilTimestamp: number;
    stake: Stake;
  };
  StakeFlowFAQ: undefined;
  StakeFlowSelectPool: {
    amount: string;
  };
  StakeFlowStaking: undefined;
  StakeFlowStakingDetails: {
    stake: Stake;
    state: StakeStates;
  };

  // TODO: Consider making `type` an enum value. This depends
  // on if the terminal screen gets its state from hooks or
  // from the caller. If it's from hooks, than an enum would be
  // better. If it's from the caller, than this gives us
  // a bit more type safety.
  StakeFlowTerminal:
    | { amount: string; type: 'stake-success' }
    | { message?: string; type: 'stake-error' }
    | { amount: string; lockedUntilTimestamp: number; type: 'unstake-success' }
    | { amount: string; type: 'withdraw-success' }
    | { message?: string; type: 'error' };
  ViewOnExplorer: undefined;
};

export type SignupStackParamList = {
  SignUpChooseAccountName: ChooseAccountNameProps;
  SignUpCongratsFinish: ChooseAccountNameProps & {
    accountName?: string;
    isAddAccount?: boolean;
  };
  SignUpMnemonicDisplay: { confirmedPassword: string; isAddAccount?: boolean };
  SignUpMnemonicEntry: {
    confirmedPassword: string;
    isAddAccount?: boolean;
    mnemonic: string;
  };
  Signup: undefined;
};

export type AppLaunchStackScreenProps<T extends keyof AppLaunchStackParamList> =
  StackScreenProps<AppLaunchStackParamList, T>;

export type ImportStackScreenProps<T extends keyof ImportStackParamList> =
  StackScreenProps<ImportStackParamList, T>;

export type RootAuthenticatedStackScreenProps<
  T extends keyof RootAuthenticatedStackParamList,
> = StackScreenProps<RootAuthenticatedStackParamList, T>;

export type SignupStackScreenProps<T extends keyof SignupStackParamList> =
  StackScreenProps<SignupStackParamList, T>;

export type TabParamList = {
  Activity: undefined;
  Assets: undefined;
  Explore: { activeTab: DappCategory; link?: string } | undefined;
};

// Assets Tabs are nested inside the RootAuthenticatedStack
// https://reactnavigation.org/docs/typescript/#nesting-navigators
export type AssetsTabsScreenProps<T extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    RootAuthenticatedStackScreenProps<keyof RootAuthenticatedStackParamList>
  >;

type CombineTypes = RootAuthenticatedStackParamList &
  ImportStackParamList &
  SignupStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends CombineTypes {}
  }
}
