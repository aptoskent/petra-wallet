// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { TokenData } from '@petra/core/types';
import { AssetsTabsScreenProps } from 'navigation/types';
import PetraHeader from 'core/components/PetraHeader';
import { useAccountTokens } from '@petra/core/queries/useTokens';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import useSteadyRefresh from 'core/hooks/useSteadyRefresh';
import { testProps } from 'e2e/config/testProps';
import useAccountTokensTotal from '@petra/core/hooks/useAccountTokensTotal';
import PetraSettingsButton from 'core/components/PetraSettingsButton';
import { useAnalytics } from '@segment/analytics-react-native';
import makeStyles from 'core/utils/makeStyles';
import { IS_DEVELOPMENT } from 'shared/utils';
import { usePrompt } from 'core/providers/PromptProvider';
import FirstTimeStakeSheetContent from 'pages/Stake/Sheets/FirstTimeStakeSheetContent';
import { useFlag } from '@petra/core/flags';
import { useStaking } from '@petra/core/queries/useStaking';
import { stakingEvents } from '@petra/core/utils/analytics/events';
import useTrackEvent from 'core/hooks/useTrackEvent';
import AssetsBlock from './AssetsBlock';
import CoinsBlock from './Coins/CoinsBlock';
import NFTsBlock from './NFTs/NFTsBlock';
import StakeBanner from './Stake/StakeBanner';
import StakeBlock from './Stake/StakeBlock';

export default function Assets({
  navigation,
  route,
}: AssetsTabsScreenProps<'Assets'>) {
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = useStyles();
  const { activeAccountAddress } = useActiveAccount();
  const isStakeEnabled = useFlag('mobile-staking');
  const stakeQuery = useStaking({
    address: activeAccountAddress,
    options: { enabled: isStakeEnabled },
  });
  const { trackEvent } = useTrackEvent();
  const tokensQuery = useAccountTokens(activeAccountAddress);
  const totalTokensQuery = useAccountTokensTotal(activeAccountAddress);
  const [isSteadyRefreshing, steadyRefresh] = useSteadyRefresh(() =>
    Promise.all([
      tokensQuery.refetch(),
      totalTokensQuery.refetch(),
      stakeQuery.refetch(),
    ]),
  );
  const analytics = useAnalytics();
  const { setPromptContent, setPromptVisible } = usePrompt();

  useEffect(() => {
    if (!IS_DEVELOPMENT) {
      void analytics.identify(activeAccountAddress, {});
    }
  }, [activeAccountAddress]);

  const handleOnPressSettings = () => {
    navigation.navigate('Settings');
  };

  const handleNavigateToCoinDetails = (coinType: string) => {
    navigation.navigate('CoinDetails', { coinType });
  };

  const handleNavigateToNftDetails = (token: TokenData) => {
    navigation.navigate('NFTDetails', { token });
  };

  const handleNavigation = (routeName: any) => {
    navigation.navigate(routeName);
  };

  const navigateToBuy = () => {
    setPromptVisible(false);
    navigation.navigate('Buy');
    void trackEvent({
      eventType: stakingEvents.NAVIGATE_TO_BUY,
    });
  };
  const handleStakeBannerPress = () => {
    setPromptContent(
      <FirstTimeStakeSheetContent
        onContinue={() => {
          setPromptVisible(false);
          navigation.push('StakeFlowEnterAmount');
        }}
        onNavigateToBuy={navigateToBuy}
        onReadMore={() => {
          setPromptVisible(false);
          navigation.push('StakeFlowFAQ');
        }}
      />,
    );
    setPromptVisible(true);
  };

  const handleNavigateToStake = () => {
    navigation.navigate('StakeFlowStaking');
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <PetraHeader
          action={<PetraSettingsButton onPress={handleOnPressSettings} />}
          navigation={navigation}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const removeFocusListener = navigation.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        if (scrollViewRef.current?.scrollTo) {
          scrollViewRef.current.scrollTo({ animated: true, y: 0 });
        }
      }
    });
    return () => {
      removeFocusListener();
    };
  }, [navigation, route.name]);

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={isSteadyRefreshing}
          onRefresh={steadyRefresh}
        />
      }
      {...testProps('Assets-screen')}
    >
      <AssetsBlock handleNavigation={handleNavigation} />
      <CoinsBlock
        handleNavigation={handleNavigation}
        handleNavigateToCoinDetails={handleNavigateToCoinDetails}
      />

      {isStakeEnabled && !stakeQuery.isLoading && !stakeQuery.data?.total ? (
        <StakeBanner onPress={handleStakeBannerPress} />
      ) : null}
      {isStakeEnabled && !stakeQuery.isLoading && stakeQuery.data?.total ? (
        <StakeBlock
          stakes={stakeQuery.data}
          onStakingPress={handleNavigateToStake}
          onWithdrawPress={(stake) => {
            navigation.navigate('StakeFlowStakingDetails', {
              stake,
              state: 'withdrawReady',
            });
          }}
        />
      ) : null}

      <NFTsBlock
        isLoading={tokensQuery.isLoading}
        nfts={tokensQuery.allTokens.slice(0, 4)}
        handleNavigation={handleNavigation}
        handleNavigateToNftDetails={handleNavigateToNftDetails}
        total={totalTokensQuery.data ?? 0}
      />
    </ScrollView>
  );
}

const useStyles = makeStyles((theme) => ({
  scrollView: {
    backgroundColor: theme.background.secondary,
    width: '100%',
  },
}));
