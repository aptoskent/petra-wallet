// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { PendingNFTsReceived, PendingNFTsSent } from 'pages/Assets';
import React from 'react';
import { i18nmock } from 'strings';
import { TextStyle } from 'react-native';
import { PendingNftsTab } from './Root';

const pendingOffersTabLabelStyle: TextStyle = {
  fontFamily: 'WorkSans-SemiBold',
  fontSize: 16,
  lineHeight: 19,
  textTransform: 'none',
};

function PendingNftsTabScreen() {
  return (
    <PendingNftsTab.Navigator>
      <PendingNftsTab.Screen
        name="PendingNFTsReceived"
        component={PendingNFTsReceived}
        options={{
          swipeEnabled: true,
          tabBarActiveTintColor: customColors.salmon['500'],
          tabBarInactiveTintColor: customColors.navy['700'],
          tabBarIndicatorStyle: { backgroundColor: customColors.salmon['500'] },
          tabBarLabel: i18nmock('assets:offersReceived'),
          tabBarLabelStyle: pendingOffersTabLabelStyle,
        }}
      />
      <PendingNftsTab.Screen
        name="PendingNFTsSent"
        component={PendingNFTsSent}
        options={{
          swipeEnabled: true,
          tabBarActiveTintColor: customColors.salmon['500'],
          tabBarInactiveTintColor: customColors.navy['700'],
          tabBarIndicatorStyle: { backgroundColor: customColors.salmon['500'] },
          tabBarLabel: i18nmock('assets:offersSent'),
          tabBarLabelStyle: pendingOffersTabLabelStyle,
        }}
      />
    </PendingNftsTab.Navigator>
  );
}

export default PendingNftsTabScreen;
