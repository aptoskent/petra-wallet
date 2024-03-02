// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View } from 'react-native';
import { customColors } from '@petra/core/colors';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { ItemType } from 'core/components/PetraListItem';
import { ChevronRightIconSVG } from 'shared/assets/svgs';
import { i18nmock } from 'strings';
import PetraList from 'core/components/PetraList';
import { useKeychain } from 'core/hooks/useKeychain';
import makeStyles from 'core/utils/makeStyles';

const items: ItemType<string>[] = [
  {
    id: 'ConnectedApps',
    rightIcon: <ChevronRightIconSVG color={customColors.navy['600']} />,
    route: 'ConnectedApps',
    text: i18nmock('settings:connectedApps.title'),
  },
  {
    id: 'ReceivingNFTs',
    rightIcon: <ChevronRightIconSVG color={customColors.navy['600']} />,
    route: 'DirectTransferToken',
    text: i18nmock('settings:directTransferToken.title'),
  },
];
const changePassword: ItemType<string> = {
  id: 'ChangePassword',
  rightIcon: <ChevronRightIconSVG color={customColors.navy['600']} />,
  route: 'ChangePassword',
  text: i18nmock('settings:changePassword.title'),
};

interface SecurityPrivacyListProps {
  handleNavigateToRoute: (route: string) => void;
}

function SecurityPrivacyList({
  handleNavigateToRoute,
}: SecurityPrivacyListProps): JSX.Element {
  const { keychainEnabled } = useKeychain();
  const [filteredItems, setFilteredItems] = React.useState<ItemType<string>[]>([
    ...items,
    changePassword,
  ]);
  const handleItemPress = (item: ItemType<string>) => {
    if (item.route) {
      handleNavigateToRoute(item.route);
    }
  };

  React.useEffect(() => {
    async function checkKeyChain() {
      if (await keychainEnabled()) {
        setFilteredItems(items);
      }
    }

    checkKeyChain();
  }, [keychainEnabled]);

  return <PetraList items={filteredItems} handleItemPress={handleItemPress} />;
}

function SecurityPrivacy({
  navigation,
}: RootAuthenticatedStackScreenProps<'SecurityPrivacy'>) {
  const styles = useStyles();
  const handleNavigateToRoute = (route: any) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <SecurityPrivacyList handleNavigateToRoute={handleNavigateToRoute} />
    </View>
  );
}

export default SecurityPrivacy;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    height: '100%',
    paddingVertical: 24,
    width: '100%',
  },
}));
