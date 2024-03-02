// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import WebView, { WebViewNavigation } from 'react-native-webview';
import getEntryScript from 'shared/scripts/entryscript';
import { StorageKeys } from 'shared/constants';
import getFavicon from 'core/utils/getFavicon';
import { AssetsTabsScreenProps } from 'navigation/types';
import { Alert, TextInput } from 'react-native';
import { i18nmock } from 'strings';
import useRecentContacts, { Contact } from 'core/hooks/useRecentContacts';
import useSearchContacts from 'core/hooks/useSearchContacts';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { isAddressValid, isAptosName } from '@petra/core/utils/address';
import sanitizeUrl from 'core/utils/sanitizeUrl';
import MobilePreferences from '../../util/mobilePreferences';
import usePetraApiServer from './hooks/usePetraApiServer';
import { allDapps } from './data/DappListSource';
import { ExploreHistoryEntry } from './components/ExploreDappHistory';
import ExploreView, { ExploreViewModes } from './ExploreView';
import { ApprovalModalHandle } from './components/ApprovalModal';

const maxHistory = 10;

// type ExploreProps = RootAuthenticatedStackScreenProps<'AssetsRoot'>;
type ExploreProps = AssetsTabsScreenProps<'Explore'>;

export default function Explore({ navigation, route }: ExploreProps) {
  const refWebView = useRef<WebView>(null);
  const refHeaderTextInput = useRef<TextInput>(null);
  const refApprovalModal = useRef<ApprovalModalHandle>(null);
  const [entryScript, setEntryScript] = useState<string | undefined>(undefined);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const [mode, setMode] = useState<ExploreViewModes>('dapp-view');
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const [currentUri, navigateToUri] = useState<string>('');
  const [history, setHistory] = useState<ExploreHistoryEntry[]>([]);
  const { activeAccount } = useActiveAccount();

  const { pushContact, recentContacts } = useRecentContacts();

  const {
    isFetching: isFetchingProfile,
    onQueryChange: onSearchQueryChange,
    result: filteredRecipients,
  } = useSearchContacts(recentContacts);

  const { handleRequest: onWebViewMessage, setDappInfo } = usePetraApiServer({
    approvalModalRef: refApprovalModal,
    webViewRef: refWebView,
  });

  const filteredHistory = useMemo(() => {
    if (currentSearch) {
      return history.filter((entry) => {
        const name = entry.name.toLowerCase();
        const search = currentSearch.toLowerCase();
        return name.includes(search);
      });
    }

    return history;
  }, [history, currentSearch]);

  const filteredDapps = useMemo(() => {
    // Prioritize searching over tab usage.
    // Use ALL dapps when we are searching
    if (currentSearch) {
      const cleanSearch = currentSearch
        .toLowerCase()
        .replace('https://', '')
        .replace('www.', '');

      return allDapps.filter((dapp) => {
        const name = dapp.name.toLowerCase();
        const tester = dapp.tester.toLowerCase();
        const url = dapp.link.toLowerCase();

        return (
          name.includes(cleanSearch) ||
          cleanSearch.includes(tester) ||
          cleanSearch.includes(name) ||
          url.includes(cleanSearch)
        );
      });
    }

    return [];
  }, [currentSearch]);

  const updateHeaderTextInput = useCallback((text: string) => {
    refHeaderTextInput.current?.setNativeProps({ text });
  }, []);

  // Pull our history from storage and get our script
  // to inject into the web view to connect the wallet
  useEffect(() => {
    const getEntryScriptProvider = async () => {
      const entryScriptText = await getEntryScript();
      setEntryScript(entryScriptText);
    };

    const getHistory = async () => {
      const historyString = await MobilePreferences.getData(
        StorageKeys.dappHistory,
      );
      if (historyString) {
        setHistory(JSON.parse(historyString));
      } else {
        setHistory([]);
      }
    };

    getEntryScriptProvider();
    getHistory();
  }, [navigation]);

  const onInputSubmit = useCallback(
    // eslint-disable-next-line consistent-return
    (input: string) => {
      if (isAddressValid(input) && filteredRecipients[0]?.address === input) {
        return onContactPress(filteredRecipients[0]);
      }

      if (isAptosName(input) && filteredRecipients[0]?.name === input) {
        return onContactPress(filteredRecipients[0]);
      }

      goToUri(input);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredRecipients],
  );

  const goToUri = useCallback(
    (newUri: string) => {
      try {
        if (!history || (newUri?.length ?? 0) === 0) return;

        const url = sanitizeUrl(newUri);
        updateHeaderTextInput(url.toString());
        navigateToUri(url.toString());

        // Move dapp to the front of the history list if it already exists,
        // otherwise add it to the front
        const existingDapp = history.find((dapp) => dapp.name === url.hostname);
        if (existingDapp) {
          history.splice(history.indexOf(existingDapp), 1);
          history.unshift(existingDapp);
        } else {
          history.unshift({
            link: url.origin,
            name: url.hostname,
          });
          if (history.length > maxHistory) {
            history.pop();
          }
        }

        // Save the new history
        MobilePreferences.storeData(
          StorageKeys.dappHistory,
          JSON.stringify(history),
        );

        setMode('web-view');
      } catch {
        Alert.alert(i18nmock('assets:explore.invalidUrl'));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, updateHeaderTextInput],
  );

  const onWebViewNavigation = useCallback(
    (navState: WebViewNavigation) => {
      const url = sanitizeUrl(navState.url);
      updateHeaderTextInput(url.toString());
      setDappInfo({
        domain: url.origin,
        imageURI: getFavicon(url.origin),
        name: navState.title,
      });
      setCanGoBack(navState.canGoBack);
      setCanGoForward(navState.canGoForward);
    },
    [updateHeaderTextInput, setDappInfo],
  );

  const navGoogle = useCallback(
    (searchText: string) => {
      goToUri(`https://www.google.com/search?q=${searchText}`);
    },
    [goToUri],
  );

  const navBack = useMemo(
    () => ({
      enabled: canGoBack,
      go: () => {
        if (canGoBack) {
          refWebView?.current?.goBack();
        } else {
          updateHeaderTextInput(currentSearch);
          setMode('dapp-view');
        }
      },
    }),
    [canGoBack, currentSearch, updateHeaderTextInput],
  );

  const navForward = useMemo(
    () => ({
      enabled: canGoForward,
      go: () => {
        if (canGoForward) {
          refWebView?.current?.goForward();
        }
      },
    }),
    [canGoForward],
  );

  const navHome = useMemo(
    () => ({
      enabled: true,
      go: () => {
        setCurrentSearch('');
        updateHeaderTextInput(currentSearch);
        refHeaderTextInput.current?.focus();
        setMode('dapp-view');
      },
    }),
    [updateHeaderTextInput, currentSearch],
  );

  const onContactPress = (contact: Contact) => {
    navigation.navigate('NFTsList', { address: contact.address });
    // TODO: the update is visible during navigation, maybe wait for the end of navigation
    //  or just push contact after a successful transfer
    pushContact(contact);
  };

  // navigate home on change account
  useEffect(() => {
    navHome.go();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount.address]);

  useEffect(() => {
    if (route.params) {
      const { activeTab, link } = route.params;
      if (link) {
        goToUri(link);
        navigation.setParams({ activeTab, link: undefined });
      }
    }
  }, [goToUri, navigation, route, route.params]);

  const onInputChange = useCallback(
    (text: string) => {
      if (mode === 'dapp-view') {
        setCurrentSearch(text);
        onSearchQueryChange(text);
      }
    },
    [mode, onSearchQueryChange],
  );

  return (
    <ExploreView
      refApprovalModal={refApprovalModal}
      refWebView={refWebView}
      refHeaderTextInput={refHeaderTextInput}
      currentUri={currentUri}
      currentSearch={currentSearch}
      dapps={filteredDapps}
      injectedJavascript={entryScript}
      history={filteredHistory}
      mode={mode}
      navBack={navBack}
      navForward={navForward}
      navHome={navHome}
      navUri={goToUri}
      navGoogle={navGoogle}
      onContactPress={onContactPress}
      onWebViewMessage={onWebViewMessage}
      onWebViewNavigation={onWebViewNavigation}
      onInputChange={onInputChange}
      onInputSubmit={onInputSubmit}
      profiles={filteredRecipients}
      isFetchingProfile={isFetchingProfile}
    />
  );
}
