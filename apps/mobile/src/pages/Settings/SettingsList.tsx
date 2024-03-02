// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import RadioIconSVG from 'shared/assets/svgs/radio_icon';
import UserIconSVG from 'shared/assets/svgs/user_icon';
import ShieldIconSVG from 'shared/assets/svgs/shield_icon';
import CompassIconSVG from 'shared/assets/svgs/compass_icon';
import HelpCircleIconSVG from 'shared/assets/svgs/help_circle_icon';
import UserPlusIconSVG from 'shared/assets/svgs/user_plus_icon';
import { ChevronRightIconSVG } from 'shared/assets/svgs';
import ExternalLinkIconSVG from 'shared/assets/svgs/external_link_icon';
import { customColors } from '@petra/core/colors';
import { i18nmock } from 'strings';
import { ItemType } from 'core/components/PetraListItem';
import PetraList from 'core/components/PetraList';
import { useKeychain } from 'core/hooks/useKeychain';
import { Alert } from 'react-native';
import UserMinusIconSVG from 'shared/assets/svgs/user_minus_icon';
import { useWebViewPopover } from 'core/providers/WebViewPopoverProvider';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { HELP_SUPPORT_LINK } from 'shared/constants';
import Typography from 'core/components/Typography';
import DeviceInfo from 'react-native-device-info';
import { useNetworks } from '@petra/core/hooks/useNetworks';

type SettingType =
  | 'Network'
  | 'ManageAccount'
  | 'SecurityPrivacy'
  | 'ViewOnExplorer'
  | 'HelpSupport'
  | 'AddAccount'
  | 'RemoveAccount';

interface SettingsListProps {
  handleNavigateToRoute: (route: string, params: any) => void;
  handleRemoveAccount: () => void;
  renderPetraHeader: () => JSX.Element;
}

function SettingsList({
  handleNavigateToRoute,
  handleRemoveAccount,
  renderPetraHeader,
}: SettingsListProps): JSX.Element {
  const { authenticate, hasPassword } = useKeychain();
  const { openUri } = useWebViewPopover();

  const getExplorerAddress = useExplorerAddress();
  const { activeNetworkName } = useNetworks();
  const { activeAccountAddress } = useActiveAccount();
  const explorerUri = getExplorerAddress(`account/${activeAccountAddress}`);

  const items: ItemType<SettingType>[] = [
    {
      hintText: activeNetworkName,
      id: 'Network',
      leftIcon: <RadioIconSVG color={customColors.navy['600']} />,
      rightIcon: <ChevronRightIconSVG color={customColors.navy['600']} />,
      route: 'Network',
      text: i18nmock('settings:settingListItems.network'),
    },
    {
      id: 'ManageAccount',
      leftIcon: <UserIconSVG color={customColors.navy[600]} />,
      rightIcon: <ChevronRightIconSVG color={customColors.navy[600]} />,
      route: 'ManageAccount',
      text: i18nmock('settings:settingListItems.accountDetails'),
    },
    {
      id: 'SecurityPrivacy',
      leftIcon: <ShieldIconSVG color={customColors.navy['600']} />,
      rightIcon: <ChevronRightIconSVG color={customColors.navy['600']} />,
      route: 'SecurityPrivacy',
      text: i18nmock('settings:settingListItems.securityPrivacy'),
    },
    {
      id: 'ViewOnExplorer',
      leftIcon: <CompassIconSVG color={customColors.navy['600']} />,
      rightIcon: <ExternalLinkIconSVG color={customColors.navy['600']} />,
      route: 'ViewOnExplorer',
      text: i18nmock('settings:settingListItems.viewOnExplorer'),
    },
    {
      id: 'HelpSupport',
      leftIcon: <HelpCircleIconSVG color={customColors.navy['600']} />,
      rightIcon: <ExternalLinkIconSVG color={customColors.navy['600']} />,
      route: 'HelpSupport',
      text: i18nmock('settings:settingListItems.helpSupport'),
    },
    {
      id: 'AddAccount',
      leftIcon: <UserPlusIconSVG color={customColors.navy['600']} />,
      route: 'AddAccountOptions',
      text: i18nmock('settings:settingListItems.addAccount'),
    },
    {
      id: 'RemoveAccount',
      leftIcon: <UserMinusIconSVG color={customColors.red['500']} />,
      text: i18nmock('settings:settingListItems.removeAccount'),
      textColor: customColors.red['500'],
    },
  ];

  const renderAppVersion = useCallback(
    () => (
      <Typography variant="small" align="center" color="navy.600">
        {`${i18nmock('general:version')}: ${DeviceInfo.getVersion()}`}
      </Typography>
    ),
    [],
  );

  const handleItemPress = async (item: ItemType<SettingType>) => {
    switch (item.id) {
      case 'ManageAccount':
        if (hasPassword) {
          const didAuthenticate = await authenticate();
          if (didAuthenticate) {
            handleNavigateToRoute('ManageAccount', {
              needsAuthentication: false,
            });
          } else {
            Alert.alert(i18nmock('onboarding:passwordEntry.loginError'));
          }
        } else {
          handleNavigateToRoute('ManageAccount', { needsAuthentication: true });
        }
        break;
      case 'RemoveAccount':
        handleRemoveAccount();
        break;
      case 'ViewOnExplorer':
        openUri({
          title: 'explore.aptoslabs.com',
          uri: explorerUri,
        });
        break;
      case 'HelpSupport':
        openUri({
          title: HELP_SUPPORT_LINK,
          uri: HELP_SUPPORT_LINK,
        });
        break;
      default:
        if (item.route) {
          handleNavigateToRoute(item.route, {});
        }
        break;
    }
  };
  return (
    <PetraList
      items={items}
      handleItemPress={handleItemPress}
      renderHeader={renderPetraHeader}
      renderFooter={renderAppVersion}
      footerLocation="flush-with-bottom"
    />
  );
}

export default SettingsList;
