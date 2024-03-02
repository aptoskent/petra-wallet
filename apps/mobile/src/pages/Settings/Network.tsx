// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useQueryClient } from 'react-query';
import { customColors } from '@petra/core/colors';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { Network as NetworkTypes } from '@petra/core/types';
import React, { useState } from 'react';
import { TouchableHighlight, View, ScrollView } from 'react-native';
import DotIconSVG from 'shared/assets/svgs/dot_icon';
import { useNodeStatus } from '@petra/core/queries/network';
import { CheckIconSVG } from 'shared/assets/svgs';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { useTheme } from 'core/providers/ThemeProvider';
import { testProps } from 'e2e/config/testProps';
import { useNavigation } from '@react-navigation/native';
import { usePetraToastContext } from 'core/providers/ToastProvider';

const queryIntervalMs = 30000;

function NetworkListItem({
  isSelected,
  network,
  onPress,
}: {
  isSelected: boolean;
  network: NetworkTypes;
  onPress: (networkName: string) => Promise<void>;
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const queryOptions = {
    cacheTime: queryIntervalMs,
    refetchInterval: queryIntervalMs,
    staleTime: queryIntervalMs,
  };
  const { isNodeAvailable } = useNodeStatus(network.nodeUrl, queryOptions);
  const isDisabled = !isNodeAvailable;

  return (
    <TouchableHighlight
      disabled={isSelected}
      onPress={() => onPress(network.name)}
      underlayColor={customColors.navy['100']}
      style={[
        styles.itemContainer,
        {
          backgroundColor: isSelected
            ? customColors.navy['50']
            : theme.background.secondary,
          borderColor: isSelected
            ? customColors.navy['50']
            : customColors.navy['100'],
        },
      ]}
      {...testProps(`NetworkListItem-${network.name}`)}
    >
      <View style={styles.row}>
        <View style={styles.itemBody}>
          <View style={styles.networkNameRow}>
            <View style={styles.networkStatusIcon}>
              <DotIconSVG
                color={
                  isDisabled
                    ? customColors.orange['600']
                    : customColors.green['600']
                }
              />
            </View>
            <Typography style={styles.networkName}>{network.name}</Typography>
          </View>
          <Typography style={styles.networkNodeUrl}>
            {network.nodeUrl}
          </Typography>
        </View>
        {isSelected ? (
          <View style={styles.checkIcon}>
            <CheckIconSVG color={customColors.green['600']} />
          </View>
        ) : null}
      </View>
    </TouchableHighlight>
  );
}

export default function Network() {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const { activeNetworkName, networks, switchNetwork } = useNetworks();
  const { showSuccessToast } = usePetraToastContext();
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const navigation = useNavigation();

  const handlePress = async (networkName: string) => {
    if (isSwitching) return;

    setIsSwitching(true);
    try {
      await switchNetwork(networkName);
      navigation.goBack();
      showSuccessToast({
        text: 'Network Switched',
        toastPosition: 'bottom',
      });
      // Invalidate all queries to clear cached data from previous network
      await queryClient.invalidateQueries();
    } catch (e) {
      // TODO raise toast or error message
    }
    setIsSwitching(false);
  };

  return (
    <View style={styles.container} {...testProps('Network-screen')}>
      <ScrollView style={styles.scrollView}>
        {networks
          ? Object.keys(networks)
              .slice(0, 3)
              .map((networkName) => (
                <NetworkListItem
                  key={networkName}
                  network={networks[networkName]}
                  onPress={handlePress}
                  isSelected={activeNetworkName === networkName}
                />
              ))
          : null}
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  checkIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.background.secondary,
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 16,
    width: '100%',
  },
  itemBody: {
    flex: 1,
  },
  itemContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    padding: 24,
  },
  networkName: {
    alignItems: 'center',
    color: theme.typography.primary,
  },
  networkNameRow: {
    color: theme.typography.primary,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 6,
  },
  networkNodeUrl: {
    color: customColors.navy['600'],
    fontSize: 12,
  },
  networkStatusIcon: {
    alignSelf: 'center',
    height: 8,
    marginRight: 8,
    width: 8,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
    padding: 8,
  },
}));
