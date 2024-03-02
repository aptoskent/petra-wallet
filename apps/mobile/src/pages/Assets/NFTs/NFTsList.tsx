// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  Platform,
  View,
} from 'react-native';
import NFTListItem, {
  NFTTListItemWrapper,
} from 'pages/Assets/NFTs/NFTListItem';
import { ANS_LINK } from 'shared';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import ListViewEmptyState from 'pages/Assets/Shared/ListViewEmptyState';
import { NoCoinsDrawingSVG } from 'shared/assets/svgs';
import { tokenEmpty } from 'shared/assets/images';
import { AssetsTabsScreenProps } from 'navigation/types';
import { useAccountTokens } from '@petra/core/queries/useTokens';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { TokenData } from '@petra/core/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWebViewPopover } from 'core/providers/WebViewPopoverProvider';
import useSteadyRefresh from 'core/hooks/useSteadyRefresh';
import { DappCategory } from 'pages/Explore/data/DappListSource';
import { PADDING } from 'shared/constants';
import makeStyles from 'core/utils/makeStyles';
import { nftRowSpacing, nftSpacingLarge } from '../shared';

// Pending NFTs removed in this PR for reference:
// https://github.com/aptos-labs/wallet/pull/1058

export default function NFTsList({
  navigation,
  route,
}: AssetsTabsScreenProps<any>) {
  const styles = useStyles();
  const { openUri } = useWebViewPopover();
  const insets = useSafeAreaInsets();
  const { activeAccountAddress } = useActiveAccount();
  const tokensRequest = useAccountTokens(
    route.params?.address ? route.params.address : activeAccountAddress,
  );
  const [isSteadyFetching, steadyRefetch] = useSteadyRefresh(
    tokensRequest.refetch,
  );
  const [isSteadyFetchingNextPage, steadyFetchNextPage] = useSteadyRefresh(
    tokensRequest.fetchNextPage,
  );
  const isRefreshing = isSteadyFetching || isSteadyFetchingNextPage;

  const nfts = tokensRequest.allTokens;

  const isNames = route.params?.isNames ?? false;

  const renderEmptyState = () =>
    isNames ? renderEmptyNamesState() : renderEmptyNftsState();

  const handleNavigateToAns = () => {
    openUri({ uri: ANS_LINK });
  };

  const bottomButtonNames: JSX.Element = (
    <PetraPillButton
      buttonDesign={PillButtonDesign.default}
      onPress={handleNavigateToAns}
      text={i18nmock('assets:namesEmptyState.registerAnsName')}
    />
  );

  const bottomButtonNfts: JSX.Element = (
    <PetraPillButton
      buttonDesign={PillButtonDesign.default}
      onPress={() => {
        navigation.popToTop();
        navigation.navigate('AssetsRoot', {
          params: { activeTab: DappCategory.nfts },
          screen: 'Explore',
        });
      }}
      text={i18nmock('assets:nftsEmptyState.exploreNfts')}
    />
  );

  const renderEmptyNamesState = () => (
    <ListViewEmptyState
      bottomButton={bottomButtonNames}
      headingText={i18nmock('assets:namesEmptyState.noNames.heading')}
      subText={i18nmock('assets:namesEmptyState.noNames.subtext')}
      svgComponent={<NoCoinsDrawingSVG />}
    />
  );

  // To avoid the safe area at the bottom of the screen we need
  // to render an empty view with the height of the safe area.
  // Attaching paddingBottom to the FlatList doesn't work as expected
  const renderListFooter = () => (
    <View style={{ alignItems: 'center', paddingBottom: insets.bottom }}>
      {isRefreshing ? <ActivityIndicator /> : null}
    </View>
  );

  const renderEmptyNftsState = () => (
    <View style={styles.emptyNftStateContainer}>
      <ListViewEmptyState
        bottomButton={Platform.OS === 'ios' ? undefined : bottomButtonNfts}
        headingText={i18nmock('assets:nftsEmptyState.noNfts.heading')}
        subText={i18nmock('assets:nftsEmptyState.noNfts.subtext')}
        svgComponent={<Image source={tokenEmpty} />}
      />
    </View>
  );

  const renderNFTPreview: ListRenderItem<TokenData> = ({
    index,
    item: nft,
  }) => (
    <NFTTListItemWrapper
      key={nft.idHash}
      index={index}
      listLength={nfts.length}
      spacing={nftSpacingLarge}
      spacingBottom={nftRowSpacing}
    >
      <NFTListItem
        handleNavigateToDetails={(token) => {
          navigation?.navigate('NFTDetails', { token });
        }}
        resource={nft}
        showName
      />
    </NFTTListItemWrapper>
  );

  const fetchMore = () => {
    if (tokensRequest.hasNextPage && !isRefreshing) {
      void steadyFetchNextPage();
    }
  };

  const renderNamesAndNftsListView = () => (
    <FlatList
      data={nfts}
      numColumns={nfts.length === 1 ? 1 : 2}
      key={nfts.length === 1 ? 'single-column' : 'two-column'}
      keyExtractor={(nft) => nft.idHash}
      showsVerticalScrollIndicator={false}
      renderItem={renderNFTPreview}
      onEndReached={fetchMore}
      refreshing={isSteadyFetching}
      onRefresh={steadyRefetch}
      ListFooterComponent={renderListFooter}
      style={styles.list}
      windowSize={10}
    />
  );

  return (
    <View style={styles.container}>
      {!nfts.length ? renderEmptyState() : renderNamesAndNftsListView()}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: PADDING.container,
  },
  emptyNftStateContainer: {
    flex: 1,
  },
  list: {
    margin: -nftSpacingLarge,
  },
}));
