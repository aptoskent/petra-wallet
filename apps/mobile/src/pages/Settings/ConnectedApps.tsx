// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { App, useConnectedApps } from '@petra/core/hooks/useConnectedApps';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import Center from 'core/components/Center';
import EmptyState from 'core/components/EmptyState';
import PetraList from 'core/components/PetraList';
import { ItemType } from 'core/components/PetraListItem';
import makeStyles from 'core/utils/makeStyles';
import ExploreDappIcon from 'pages/Explore/components/ExploreDappIcon';
import {
  DappCategory,
  getDappFromUrl,
} from 'pages/Explore/data/DappListSource';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';

interface PlaceholderProps {
  onPressExplore: () => void;
}

function Placeholder({ onPressExplore }: PlaceholderProps) {
  const styles = useStyles();
  return (
    <BottomSafeAreaView>
      <Center>
        <EmptyState
          text={i18nmock('settings:connectedApps.placeholderTitle')}
          subtext={i18nmock('settings:connectedApps.placeholderBody')}
        />
      </Center>
      {Platform.OS === 'android' ? (
        <PetraPillButton
          onPress={onPressExplore}
          text={i18nmock('settings:connectedApps.exploreButton')}
          buttonDesign={PillButtonDesign.default}
          containerStyleOverride={styles.exploreButton}
        />
      ) : null}
    </BottomSafeAreaView>
  );
}

function ConnectedApps({
  navigation,
}: RootAuthenticatedStackScreenProps<'ConnectedApps'>) {
  const styles = useStyles();
  const { connectedApps, isLoading, revokeApp } = useConnectedApps();

  const handlePressExplore = () => {
    navigation.popToTop();
    navigation.navigate('AssetsRoot', {
      params: { activeTab: DappCategory.all },
      screen: 'Explore',
    });
  };

  function renderConnectedAppItems(
    apps: App[],
    handleRevoke: (app: App) => void,
  ): ItemType<string>[] {
    return apps.map((app: App) => ({
      id: app.url,
      key: app.url,
      leftIcon: <ExploreDappIcon {...getDappFromUrl(app.url)} />,
      rightIcon: (
        <PetraPillButton
          text={i18nmock('settings:connectedApps.revokeButtonLabel')}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          buttonStyleOverride={{ paddingHorizontal: PADDING.container }}
          buttonTextStyleOverride={styles.buttonOverride}
          onPress={() => handleRevoke(app)}
        />
      ),
      text: app.domain,
    }));
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center>
          <ActivityIndicator size="large" />
        </Center>
      );
    }
    if (connectedApps.length === 0) {
      return <Placeholder onPressExplore={handlePressExplore} />;
    }
    return (
      <PetraList items={renderConnectedAppItems(connectedApps, revokeApp)} />
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

export default ConnectedApps;

const useStyles = makeStyles((theme) => ({
  buttonOverride: {
    fontSize: 16,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flexGrow: 1,
  },
  exploreButton: {
    padding: PADDING.container,
  },
  placeholderBody: {
    flexGrow: 1,
    justifyContent: 'center',
  },
}));
