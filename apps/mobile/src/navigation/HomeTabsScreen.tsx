// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useTheme } from 'core/providers/ThemeProvider';
import { Activity } from 'pages/Activity';
import { Assets } from 'pages/Assets';
import Explore from 'pages/Explore';
import React from 'react';
import { i18nmock } from 'strings';
import ActivityFilledIcon from '../shared/assets/svgs/activity_filled_icon.svg';
import ActivityOutlinedIcon from '../shared/assets/svgs/activity_outlined_icon.svg';
import ExploreFilledIcon from '../shared/assets/svgs/explore_filled_icon.svg';
import ExploreOutlinedIcon from '../shared/assets/svgs/explore_outlined_icon.svg';
import WalletFilledIcon from '../shared/assets/svgs/wallet_filled_icon.svg';
import WalletOutlinedIcon from '../shared/assets/svgs/wallet_outlined_icon.svg';
import { HomeTabs } from './Root';

const tabBarIconColor = (active: boolean) =>
  active ? customColors.navy['900'] : customColors.navy['500'];

const focusedColor = customColors.navy['900'];
const unfocusedColor = customColors.navy['500'];

const assetsTabBarIcon = (focused: boolean) =>
  focused ? (
    <WalletFilledIcon color={focusedColor} />
  ) : (
    <WalletOutlinedIcon color={unfocusedColor} />
  );
const activityTabBarIcon = (focused: boolean) =>
  focused ? (
    <ActivityFilledIcon color={focusedColor} />
  ) : (
    <ActivityOutlinedIcon color={unfocusedColor} />
  );
const explorerTabBarIcon = (focused: boolean) =>
  focused ? (
    <ExploreFilledIcon color={focusedColor} />
  ) : (
    <ExploreOutlinedIcon color={unfocusedColor} />
  );

function HomeTabsScreen() {
  const { theme } = useTheme();
  const headerStyle = {
    backgroundColor: theme.background.secondary,
  };

  return (
    <HomeTabs.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: theme.background.secondary,
        },
      }}
    >
      <HomeTabs.Screen
        name="Assets"
        component={Assets}
        options={{
          headerStyle,
          tabBarActiveTintColor: tabBarIconColor(true),
          tabBarIcon: ({ focused }) => assetsTabBarIcon(focused),
          tabBarInactiveTintColor: tabBarIconColor(false),
          tabBarLabel: 'Assets',
        }}
      />
      <HomeTabs.Screen
        name="Activity"
        component={Activity}
        options={{
          headerStyle,
          tabBarActiveTintColor: tabBarIconColor(true),
          tabBarIcon: ({ focused }) => activityTabBarIcon(focused),
          tabBarInactiveTintColor: tabBarIconColor(false),
          tabBarLabel: 'Activity',
        }}
      />
      <HomeTabs.Screen
        name="Explore"
        component={Explore}
        options={{
          headerStyle,
          tabBarActiveTintColor: tabBarIconColor(true),
          tabBarIcon: ({ focused }) => explorerTabBarIcon(focused),
          tabBarInactiveTintColor: tabBarIconColor(false),
          tabBarLabel: i18nmock('general:explore'),
        }}
      />
    </HomeTabs.Navigator>
  );
}

export default HomeTabsScreen;
