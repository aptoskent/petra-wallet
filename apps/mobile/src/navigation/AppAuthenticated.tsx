// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { customColors } from '@petra/core/colors';
import { PetraBottomSheetModal } from 'core/components';
import BackgroundAppOverlay from 'core/components/BackgroundAppOverlay';
import { useDeeplink } from 'core/providers/DeeplinkProvider';
import { useTheme } from 'core/providers/ThemeProvider';
import ActivityDetail from 'pages/Activity/ActivityDetail';
import { CoinsList, CoinDetails, NFTsList, NFTDetails } from 'pages/Assets';
import { Buy } from 'pages/Buy';
import ImportMnemonic from 'pages/Onboarding/ImportWallet/ImportMnemonic';
import ImportPrivateKey from 'pages/Onboarding/ImportWallet/ImportPrivateKey';
import AddAccountOptions from 'pages/Onboarding/Shared/AddAccountOptions';
import ChooseAccountName from 'pages/Onboarding/Shared/ChooseAccountName';
import CongratsFinishAddAccount from 'pages/Onboarding/Shared/CongratsFinishAddAccount';
import ImportWalletPasswordCreation from 'pages/Onboarding/Shared/ImportWalletPasswordCreation';
import SignUpMnemonicDisplay from 'pages/Onboarding/Signup/SignUpMnemonicDisplay';
import SignUpMnemonicEntry from 'pages/Onboarding/Signup/SignUpMnemonicEntry';
import {
  Scanner,
  I_SelectContact,
  II_SelectCoin,
  III_EnterAmount,
  IV_ConfirmSend,
  V_SendSuccess,
} from 'pages/Send';
import ChangePassword from 'pages/Settings/ChangePassword';
import ConnectedApps from 'pages/Settings/ConnectedApps';
import DirectTransferToken from 'pages/Settings/DirectTransferToken';
import EditAccountName from 'pages/Settings/EditAccountName';
import ManageAccount from 'pages/Settings/ManageAccount';
import Network from 'pages/Settings/Network';
import PrivateKey from 'pages/Settings/PrivateKey';
import SecretRecoveryPhrase from 'pages/Settings/SecretRecoveryPhrase';
import SecurityPrivacy from 'pages/Settings/SecurityPrivacy';
import Settings from 'pages/Settings/SettingsMain';
import { i18nmock } from 'strings';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'react-native';
import { HeaderBackButtonProps } from '@react-navigation/elements';
import DeeplinkRedirectHandler from 'core/components/DeeplinkRedirectHandler';
import EnterStakeAmountContainer from 'pages/Stake/Views/EnterStakeAmount';
import EnterUnstakeAmountContainer from 'pages/Stake/Views/EnterUnstakeAmount';
import SelectStakePool from 'pages/Stake/Views/SelectStakePool';
import ConfirmStake from 'pages/Stake/Views/ConfirmStake';
import StakeFAQ from 'pages/Stake/Views/FAQ';
import Staking from 'pages/Stake/Views/Staking';
import StakingDetails from 'pages/Stake/Views/StakingDetails';
import StakingFAQButton from 'pages/Stake/Components/StakingFAQButton';
import StakeTerminalScreen from 'pages/Stake/Views/Terminal';
import {
  CombinedEventParams,
  stakingEvents,
} from '@petra/core/utils/analytics/events';
import useTrackEvent from 'core/hooks/useTrackEvent';
import PendingNftsTabScreen from './PendingNftsTabScreen';
import {
  coinListHeader,
  stakingHeader,
  nftListHeader,
} from './NavigationHeaders';
import HomeTabsScreen from './HomeTabsScreen';
import { RootAuthenticatedStackScreenProps } from './types';
import {
  RootAuthenticatedStack,
  defaultBackButton,
  handleAndroidCentering,
  defaultSkipButton,
} from './Root';
import NetworkBannerWrapper from './NetworkBannerWrapper';

function StakeFAQButton({
  navigation,
  screen,
}: {
  navigation: any;
  screen: CombinedEventParams['stakingScreen'];
}) {
  const { trackEvent } = useTrackEvent();

  return (
    <StakingFAQButton
      onPress={() => {
        void trackEvent({
          eventType: stakingEvents.PRESS_FAQ_BUTTON,
          params: {
            stakingScreen: screen,
          },
        });
        navigation.push('StakeFlowFAQ');
      }}
    />
  );
}

function AppAuthenticated() {
  const { theme } = useTheme();
  const headerStyle = {
    backgroundColor: theme.background.secondary,
  };
  const { deeplink } = useDeeplink();
  return (
    <BottomSheetModalProvider>
      <StatusBar backgroundColor={theme.background.secondary} />
      <PetraBottomSheetModal />
      {/* TODO: 1.Move wrapper to Parent (Guards) after Renfield refactor.
                2. Refactor header to use a custom component */}
      <NetworkBannerWrapper>
        <RootAuthenticatedStack.Navigator
          screenOptions={{ headerShadowVisible: false }}
        >
          <RootAuthenticatedStack.Screen
            name="AssetsRoot"
            component={HomeTabsScreen}
            options={{ headerShown: false }}
          />
          <RootAuthenticatedStack.Screen
            name="Settings"
            component={Settings}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
            })}
          />
          <RootAuthenticatedStack.Screen
            name="Scanner"
            component={Scanner}
            options={{
              headerTransparent: true,
            }}
          />
          <RootAuthenticatedStack.Screen
            name="Network"
            component={Network}
            options={({ navigation }) => ({
              headerBackTitle: '',
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
            })}
          />
          <RootAuthenticatedStack.Screen
            name="CoinsList"
            component={CoinsList}
            options={({ navigation, route }) => ({
              headerBackTitle: '',
              headerLeft: () => null,
              headerStyle,
              headerTitle: () => coinListHeader(navigation, route),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="CoinDetails"
            component={CoinDetails}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: '',
            })}
          />
          <RootAuthenticatedStack.Screen
            name="NFTsList"
            component={NFTsList}
            options={({ navigation, route }) => ({
              headerBackTitle: '',
              headerLeft: () => null,
              headerStyle,
              headerTitle: () => nftListHeader(navigation, route),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="NFTDetails"
            component={NFTDetails}
            getId={({ params }) => params.token.idHash}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: '',
            })}
          />
          <RootAuthenticatedStack.Screen
            name="ManageAccount"
            component={ManageAccount}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: 'Manage Account',
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 20,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="PendingNFTs"
            component={PendingNftsTabScreen}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('assets:pendingNfts.title'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="Buy"
            component={Buy}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 20,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="PrivateKey"
            component={PrivateKey}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('settings:manageAccount.privateKey.title'),
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 20,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="SecretRecoveryPhrase"
            component={SecretRecoveryPhrase}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock(
                'settings:manageAccount.secretRecoveryPhrase.title',
              ),
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 18,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="EditAccountName"
            component={EditAccountName}
            options={({ navigation }) => ({
              headerLeft: (props: HeaderBackButtonProps) =>
                defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('settings:manageAccount.accountName.title'),
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 18,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="SecurityPrivacy"
            component={SecurityPrivacy}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('settings:securityPrivacy.title'),
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 20,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="ConnectedApps"
            component={ConnectedApps}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('settings:connectedApps.title'),
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 20,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="DirectTransferToken"
            component={DirectTransferToken}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('settings:directTransferToken.title'),
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 20,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('settings:changePassword.title'),
              headerTitleStyle: {
                color: customColors.navy['900'],
                fontFamily: 'WorkSans-Bold',
                fontSize: 20,
                lineHeight: 24,
              },
            })}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowEnterAmount"
            component={EnterStakeAmountContainer}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerRight: () => (
                <StakeFAQButton
                  navigation={navigation}
                  screen="enter stake amount"
                />
              ),
              headerStyle,
              headerTitle: i18nmock('assets:stakeFlow.enterStakeAmount.title'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowSelectPool"
            component={SelectStakePool}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerRight: () => (
                <StakeFAQButton
                  navigation={navigation}
                  screen="select stake pool"
                />
              ),
              headerStyle,
              headerTitle: i18nmock('stake:selectPool.title'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowConfirmStake"
            component={ConfirmStake}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerRight: () => (
                <StakeFAQButton
                  navigation={navigation}
                  screen="confirm stake"
                />
              ),
              headerStyle,
              headerTitle: i18nmock('assets:stakeFlow.confirmStake.title'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowFAQ"
            component={StakeFAQ}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('assets:stakeFlow.faq.title'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowStaking"
            component={Staking}
            options={({ navigation, route }) => ({
              headerBackTitle: '',
              headerLeft: () => null,
              headerStyle,
              headerTitle: () => stakingHeader(navigation, route),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowStakingDetails"
            component={StakingDetails}
            options={({ navigation, route }) => {
              const currentStakingState = route.params?.state;

              let headerTitle = '';
              switch (currentStakingState) {
                case 'active':
                  headerTitle = i18nmock('stake:stakesDetails.active');
                  break;
                case 'withdrawPending':
                  headerTitle = i18nmock('stake:stakesDetails.withdrawPending');
                  break;
                case 'withdrawReady':
                  headerTitle = i18nmock('stake:stakesDetails.withdrawReady');
                  break;
                default:
                  headerTitle = '';
                  break;
              }

              return {
                headerBackTitle: '',
                headerLeft: (props) => defaultBackButton(navigation, props),
                headerRight: () => (
                  <StakeFAQButton
                    navigation={navigation}
                    screen="stake details"
                  />
                ),
                headerStyle,
                headerTitle,
              };
            }}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowEnterUnstakeAmount"
            component={EnterUnstakeAmountContainer}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('stake:enterUnstakeAmount.title'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="StakeFlowTerminal"
            component={StakeTerminalScreen}
            options={() => ({
              gestureEnabled: false,
              header: () => null,
              headerLeft: () => null,
              headerStyle,
              headerTitle: '',
            })}
          />
          <RootAuthenticatedStack.Screen
            name="SendFlow1"
            component={I_SelectContact}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('assets:sendFlow.selectRecipient'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="SendFlow2"
            component={II_SelectCoin}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('assets:sendFlow.selectCoin'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="SendFlow3"
            component={III_EnterAmount}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('assets:sendFlow.enterAmount'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="SendFlow4"
            component={IV_ConfirmSend}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('assets:sendFlow.confirmSend'),
            })}
          />
          <RootAuthenticatedStack.Screen
            name="SendFlow5"
            component={V_SendSuccess}
            options={() => ({
              gestureEnabled: false,
              headerLeft: () => null,
              headerStyle,
              headerTitle: '',
            })}
          />
          <RootAuthenticatedStack.Screen
            name="ActivityDetail"
            component={ActivityDetail}
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerStyle,
              headerTitle: i18nmock('activity:detail'),
            })}
          />
          <RootAuthenticatedStack.Screen
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerRight: handleAndroidCentering,
              headerStyle,
              headerTitleAlign: 'center',
              title: i18nmock('settings:settingListItems.addAccount'),
            })}
            name="AddAccountOptions"
            component={AddAccountOptions}
          />
          <RootAuthenticatedStack.Screen
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerRight: handleAndroidCentering,
              headerStyle,
              headerTitleAlign: 'center',
              title: '',
            })}
            name="SignUpMnemonicDisplay"
            component={SignUpMnemonicDisplay}
          />
          <RootAuthenticatedStack.Screen
            options={({ navigation }) => ({
              headerLeft: (props) => defaultBackButton(navigation, props),
              headerRight: handleAndroidCentering,
              headerStyle,
              headerTitleAlign: 'center',
              title: '',
            })}
            name="SignUpMnemonicEntry"
            component={SignUpMnemonicEntry}
          />
          <RootAuthenticatedStack.Screen
            options={({
              navigation,
            }: RootAuthenticatedStackScreenProps<'AddAccountPrivateKey'>) => ({
              headerLeft: (props: HeaderBackButtonProps) =>
                defaultBackButton(navigation, props),
              headerRight: handleAndroidCentering,
              headerStyle,
              headerTitleAlign: 'center',
              title: i18nmock('onboarding:importWallet.title'),
            })}
            name="AddAccountPrivateKey"
            component={ImportPrivateKey}
          />
          <RootAuthenticatedStack.Screen
            options={({
              navigation,
            }: RootAuthenticatedStackScreenProps<'AddAccountImportMnemonic'>) => ({
              headerLeft: (props: HeaderBackButtonProps) =>
                defaultBackButton(navigation, props),
              headerRight: handleAndroidCentering,
              headerStyle,
              headerTitleAlign: 'center',
              title: i18nmock('onboarding:importWallet.title'),
            })}
            name="AddAccountImportMnemonic"
            component={ImportMnemonic}
          />
          <RootAuthenticatedStack.Screen
            options={({
              navigation,
            }: RootAuthenticatedStackScreenProps<'ImportWalletPasswordCreation'>) => ({
              headerLeft: (props: HeaderBackButtonProps) =>
                defaultBackButton(navigation, props),
              headerStyle,
              headerTitleAlign: 'center',
              title: '',
            })}
            name="ImportWalletPasswordCreation"
            component={ImportWalletPasswordCreation}
          />
          <RootAuthenticatedStack.Screen
            options={({
              navigation,
              route,
            }: RootAuthenticatedStackScreenProps<'ImportWalletChooseAccountName'>) => ({
              headerLeft: (props: HeaderBackButtonProps) =>
                defaultBackButton(navigation, props),
              headerRight: (props) =>
                defaultSkipButton(navigation, {
                  ...props,
                  onPress: () =>
                    navigation.navigate('ImportWalletCongratsFinish', {
                      ...route.params,
                    }),
                }),
              headerStyle,
              headerTitleAlign: 'center',
              title: '',
            })}
            name="ImportWalletChooseAccountName"
            component={ChooseAccountName}
          />
          <RootAuthenticatedStack.Screen
            options={({
              navigation,
              route,
            }: RootAuthenticatedStackScreenProps<'SignUpChooseAccountName'>) => ({
              headerLeft: (props: HeaderBackButtonProps) =>
                defaultBackButton(navigation, props),
              headerRight: (props) =>
                defaultSkipButton(navigation, {
                  ...props,
                  onPress: () =>
                    navigation.navigate('SignUpCongratsFinish', {
                      ...route.params,
                    }),
                }),
              headerStyle,
              headerTitleAlign: 'center',
              title: '',
            })}
            name="SignUpChooseAccountName"
            component={ChooseAccountName}
          />
          <RootAuthenticatedStack.Screen
            options={() => ({
              gestureEnabled: false,
              header: () => null,
              headerStyle,
            })}
            name="ImportWalletCongratsFinish"
            component={CongratsFinishAddAccount}
          />
          <RootAuthenticatedStack.Screen
            options={() => ({
              gestureEnabled: false,
              header: () => null,
              headerStyle,
            })}
            name="SignUpCongratsFinish"
            component={CongratsFinishAddAccount}
          />
        </RootAuthenticatedStack.Navigator>
      </NetworkBannerWrapper>
      <BackgroundAppOverlay />
      {deeplink?.receive ||
      deeplink?.error ||
      deeplink?.explore ||
      deeplink?.renfield ? (
        <DeeplinkRedirectHandler />
      ) : null}
    </BottomSheetModalProvider>
  );
}

export default AppAuthenticated;
