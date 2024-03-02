// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import makeStyles from 'core/utils/makeStyles';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetworkBanner, { BANNER_HEIGHT } from 'core/components/NetworkBanner';
import { DefaultNetworks } from '@petra/core/types';

export function useIsNetworkBannerVisible(): boolean {
  const { activeNetworkName } = useNetworks();
  const SHOW_NETWORKS = [DefaultNetworks.Testnet, DefaultNetworks.Devnet];
  return SHOW_NETWORKS.includes(activeNetworkName as DefaultNetworks);
}

interface NetworkBannerWrapperProps {
  children: React.ReactNode;
}

function NetworkBannerWrapper({
  children,
}: NetworkBannerWrapperProps): JSX.Element | null {
  const { top } = useSafeAreaInsets();
  const styles = useStyles();
  const showBanner = useIsNetworkBannerVisible();

  return (
    <>
      {showBanner && <View style={styles.spacerContainer} />}
      {children}
      {showBanner && (
        <NetworkBanner style={[styles.bannerContainer, { top }]} />
      )}
    </>
  );
}

export default NetworkBannerWrapper;

const useStyles = makeStyles((theme) => ({
  bannerContainer: { position: 'absolute' },
  spacerContainer: {
    backgroundColor: theme.background.secondary,
    height: BANNER_HEIGHT,
    paddingBottom: 48,
    width: '100%',
  },
}));
