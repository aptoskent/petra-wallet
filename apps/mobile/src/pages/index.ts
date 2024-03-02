// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Activity } from './Activity';
import AddAccountOptions from './Onboarding/Shared/AddAccountOptions';
import Assets from './Assets/Assets';
import AppLaunch from './Onboarding/AppLaunch';
import {
  CoinDetails,
  CoinsList,
  CoinsListHeader,
  StakingHeader,
  NFTDetails,
  NFTsList,
  NFTsListHeader,
  PendingNFTsReceived,
  PendingNFTsSent,
} from './Assets';
import { Buy } from './Buy';
import Explore from './Explore';
import ImportWalletOptions from './Onboarding/ImportWallet/ImportWalletOptions';
import ImportWalletPasswordCreation from './Onboarding/Shared/ImportWalletPasswordCreation';
import ImportPrivateKey from './Onboarding/ImportWallet/ImportPrivateKey';
import ImportMnemonic from './Onboarding/ImportWallet/ImportMnemonic';
import { KeychainLogin, PasswordLogin } from './Login';
import Settings from './Settings/SettingsMain';
import OnboardingInstruction from './Onboarding/Shared/OnboardingInstruction';
import {
  I_SelectContact,
  II_SelectCoin,
  III_EnterAmount,
  IV_ConfirmSend,
  V_SendSuccess,
} from './Send';
import SignUpPasswordEntry from './Onboarding/Signup/SignUpPasswordEntry';
import SignUpMnemonicDisplay from './Onboarding/Signup/SignUpMnemonicDisplay';
import SignUpMnemonicEntry from './Onboarding/Signup/SignUpMnemonicEntry';
import ChooseAccountName from './Onboarding/Shared/ChooseAccountName';
import Network from './Settings/Network';
import ManageAccount from './Settings/ManageAccount';
import PrivateKey from './Settings/PrivateKey';
import SecretRecoveryPhrase from './Settings/SecretRecoveryPhrase';
import EditAccountName from './Settings/EditAccountName';
import SecurityPrivacy from './Settings/SecurityPrivacy';
import ConnectedApps from './Settings/ConnectedApps';
import DirectTransferToken from './Settings/DirectTransferToken';
import ChangePassword from './Settings/ChangePassword';
import CongratsFinish from './Onboarding/Shared/CongratsFinish';
import CongratsFinishAddAccount from './Onboarding/Shared/CongratsFinishAddAccount';
import CongratsFinishSignUp from './Onboarding/Shared/CongratsFinishSignUp';

export {
  Activity,
  AddAccountOptions,
  AppLaunch,
  Assets,
  Buy,
  ChangePassword,
  ConnectedApps,
  CoinDetails,
  CoinsList,
  CoinsListHeader,
  DirectTransferToken,
  EditAccountName,
  Explore,
  I_SelectContact,
  II_SelectCoin,
  III_EnterAmount,
  IV_ConfirmSend,
  V_SendSuccess,
  ImportWalletOptions,
  ImportWalletPasswordCreation,
  ImportPrivateKey,
  ImportMnemonic,
  PasswordLogin,
  KeychainLogin,
  ManageAccount,
  NFTDetails,
  Network,
  NFTsList,
  NFTsListHeader,
  PendingNFTsReceived,
  PendingNFTsSent,
  PrivateKey,
  OnboardingInstruction,
  SecurityPrivacy,
  CongratsFinish,
  CongratsFinishAddAccount,
  CongratsFinishSignUp,
  SecretRecoveryPhrase,
  Settings,
  SignUpPasswordEntry,
  SignUpMnemonicDisplay,
  StakingHeader,
  ChooseAccountName,
  SignUpMnemonicEntry,
};
