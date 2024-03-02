// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import {
  TouchableHighlight,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  BackHandler,
  TextInput,
} from 'react-native';
import { parseColor } from '@petra/core/colors';
import Typography from 'core/components/Typography';
import Cluster from 'core/components/Layouts/Cluster';
import { i18nmock } from 'strings';
import { GlobeIconSVG, SearchIconSVG } from 'shared/assets/svgs';
import { PADDING, PETRA_FAQ_LINK } from 'shared/constants';
import { Contact } from 'core/hooks/useRecentContacts';
import RecipientsListItem from 'core/components/RecipientsListItem';
import { isAddressValid, isAptosName } from '@petra/core/utils/address';
import makeStyles from 'core/utils/makeStyles';
import { useTheme } from 'core/providers/ThemeProvider';
import { AssetsTabsScreenProps } from 'navigation/types';
import { ApprovalModal, ApprovalModalHandle } from './components/ApprovalModal';
import ExploreHeader from './components/ExploreHeader';
import { DApp } from './data/DappListSource';
import ExploreDappHistory, {
  ExploreHistoryEntry,
} from './components/ExploreDappHistory';
import DappListItem from './components/ExploreDappListItem';
import ExploreSectionTitle from './components/ExploreSectionTitle';
import {
  ExploreNameCard,
  ExploreSafeCard,
  ExploreStatCard,
} from './components/ExploreCard';
import { ANS_LINK } from '../../shared/constants';

export type ExploreViewModes = 'dapp-view' | 'web-view';

interface WebNavigation {
  enabled: boolean;
  go: () => void;
}

export interface ExploreViewProps {
  currentSearch: string;
  currentUri: string;
  dapps: DApp[];
  history: ExploreHistoryEntry[];
  injectedJavascript?: string;
  isFetchingProfile: boolean;
  mode: ExploreViewModes;
  navBack: WebNavigation;
  navForward: WebNavigation;
  navGoogle: (query: string) => void;
  navHome: WebNavigation;
  navUri: (url: string) => void;
  onContactPress: (contact: Contact) => void;
  onInputChange: (value: string) => void;
  onInputSubmit: (value: string) => void;
  onWebViewMessage: (message: WebViewMessageEvent) => void;
  onWebViewNavigation: (navigation: WebViewNavigation) => void;
  profiles: Contact[];
  refApprovalModal: React.RefObject<ApprovalModalHandle>;
  refHeaderTextInput: React.RefObject<TextInput>;
  refWebView: React.RefObject<WebView<{}>>;
}

export default function ExploreView({
  currentSearch,
  currentUri,
  dapps,
  history,
  injectedJavascript,
  isFetchingProfile,
  mode,
  navBack,
  navForward,
  navGoogle,
  navHome,
  navUri,
  onContactPress,
  onInputChange,
  onInputSubmit,
  onWebViewMessage,
  onWebViewNavigation,
  profiles,
  refApprovalModal,
  refHeaderTextInput,
  refWebView,
}: ExploreViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = useStyles();
  const { theme } = useTheme();
  const navigation =
    useNavigation<AssetsTabsScreenProps<'Assets'>['navigation']>();
  const route = useRoute<AssetsTabsScreenProps<'Assets'>['route']>();
  const hasSearch = currentSearch.length > 0;
  const hasHistory = history.length > 0;
  const hasProfiles = profiles.length > 0;
  const hasList = dapps.length > 0;
  const isProfile = useMemo(
    () => isAddressValid(currentSearch) || isAptosName(currentSearch),
    [currentSearch],
  );
  const stickyHeaderIndices = useMemo(
    () =>
      [
        hasProfiles ? +hasProfiles : null,
        hasList ? 2 * +hasProfiles + +hasList : null,
      ].filter((index) => index !== null) as number[],
    [hasList, hasProfiles],
  );

  // Common colors
  const rowHighlightColor = parseColor('navy.50');

  // renderHeader
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <ExploreHeader
          canGoBack={navBack.enabled}
          onBackPress={navBack.go}
          canGoForward={navForward.enabled}
          onForwardPress={navForward.go}
          onGoHome={navHome.go}
          mode={mode}
          refHeaderTextInput={refHeaderTextInput}
          onChange={onInputChange}
          onSubmit={onInputSubmit}
        />
      ),
      headerStyle: {
        backgroundColor: theme.background.secondary,
      },
    });
  }, [
    currentSearch,
    currentUri,
    mode,
    navBack,
    navForward,
    navHome,
    navigation,
    onInputChange,
    onInputSubmit,
    theme,
    refHeaderTextInput,
  ]);

  useEffect(() => {
    const removeFocusListener = navigation.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        navHome.go();
        if (scrollViewRef.current?.scrollTo) {
          scrollViewRef.current.scrollTo({ animated: true, y: 0 });
        }
      }
    });
    return () => {
      removeFocusListener();
    };
  }, [navHome, navigation, route.name]);

  const onWebViewError = useCallback(() => {
    Alert.alert(i18nmock('assets:explore.webError'));
    navHome.go();
  }, [navHome]);

  const renderGoToUri = () => (
    <TouchableHighlight
      underlayColor={rowHighlightColor}
      onPress={() => navUri(currentSearch)}
      style={{ ...styles.filterAction, backgroundColor: rowHighlightColor }}
    >
      <Cluster space={8} align="center">
        <GlobeIconSVG size={16} />
        <Typography weight="600">{currentSearch}</Typography>
        <Typography color="navy.500">
          - {i18nmock('assets:explore.searchUrl')}
        </Typography>
      </Cluster>
    </TouchableHighlight>
  );

  const renderSearchGoogle = () => (
    <TouchableHighlight
      underlayColor={rowHighlightColor}
      onPress={() => navGoogle(currentSearch)}
      style={styles.filterAction}
    >
      <Cluster space={8} align="center">
        <SearchIconSVG size={16} />
        <Typography weight="600">{currentSearch}</Typography>
        <Typography color="navy.500">
          - {i18nmock('assets:explore.searchTerm')}
        </Typography>
      </Cluster>
    </TouchableHighlight>
  );

  const renderDappList = () =>
    dapps.map((dapp) => (
      <DappListItem
        key={dapp.name}
        onClick={() => navUri(dapp.link)}
        item={dapp}
      />
    ));

  const renderEmptyDappList = () => {
    const onNamePress = () => {
      navUri(ANS_LINK);
    };

    const onSafePress = () => {
      navUri(PETRA_FAQ_LINK);
    };

    return (
      <View style={styles.dappListCTA}>
        <ExploreStatCard />
        <ExploreNameCard onPress={onNamePress} />
        <ExploreSafeCard onPress={onSafePress} />
      </View>
    );
  };

  useEffect(() => {
    const backAction = () => {
      if (navBack.enabled) {
        navBack.go();
      } else {
        navHome.go();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navBack, navHome]);

  return (
    <View style={styles.container}>
      {mode === 'web-view' && currentUri && (
        <WebView
          style={styles.webView}
          ref={refWebView}
          source={{ uri: currentUri }}
          domStorageEnabled
          injectedJavaScriptBeforeContentLoaded={injectedJavascript}
          onMessage={onWebViewMessage}
          setSupportMultipleWindows={false}
          onError={onWebViewError}
          allowsBackForwardNavigationGestures
          onNavigationStateChange={onWebViewNavigation}
        />
      )}

      {mode === 'dapp-view' && (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          stickyHeaderIndices={stickyHeaderIndices}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* NB: Don't remove wrapping `View`.
              We need predictable indices for sticky headers. */}
          <View>
            {!isProfile && hasSearch && renderGoToUri()}
            {!isProfile && hasSearch && renderSearchGoogle()}
            {hasHistory && (
              <ExploreDappHistory
                history={history}
                onItemClick={(dapp) => navUri(dapp.link)}
              />
            )}
          </View>

          <View style={styles.listHeader}>
            {(isFetchingProfile || hasProfiles) && (
              <ExploreSectionTitle style={styles.listTitle}>
                {i18nmock('general:profiles')}
              </ExploreSectionTitle>
            )}
            {isFetchingProfile && <ActivityIndicator />}
          </View>

          <View>
            {profiles.map((contact: Contact) => (
              <RecipientsListItem
                key={contact.address}
                contact={contact}
                onPress={() => onContactPress(contact)}
              />
            ))}
          </View>

          {/* NB: If we change the order of the DOM, change
                  stickyHeaderIndices to point to this node */}
          <View style={styles.listHeader}>
            {hasList && (
              <ExploreSectionTitle style={styles.listTitle}>
                {hasSearch
                  ? i18nmock('general:results')
                  : i18nmock('assets:explore.topDapps')}
              </ExploreSectionTitle>
            )}
          </View>

          {hasProfiles || isFetchingProfile || hasList
            ? renderDappList()
            : renderEmptyDappList()}
        </ScrollView>
      )}

      <ApprovalModal ref={refApprovalModal} />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    height: '100%',
  },
  dappListCTA: {
    alignItems: 'center',
    flex: 1,
    gap: PADDING.container,
    justifyContent: 'center',
    padding: PADDING.container,
  },
  dappListCTAImage: {
    height: 130,
    width: 140,
  },
  filterAction: {
    paddingHorizontal: 29,
    paddingVertical: 12,
  },
  listHeader: {
    backgroundColor: theme.background.secondary,
  },
  listTitle: {
    paddingBottom: 10,
    paddingLeft: PADDING.container,
    paddingTop: PADDING.container,
  },
  scrollView: {
    height: '100%',
  },
  tab: {
    minWidth: 80,
    paddingBottom: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  tabsScrollview: {
    borderBottomWidth: 1,
    paddingBottom: 0,
  },
  webView: {
    width: '100%',
  },
}));
