// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { customColors } from '@petra/core/colors';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import { RootAuthenticatedStackParamList } from 'navigation/types';
import {
  fiatDollarValueDisplay,
  fiatDollarValueExists,
} from 'pages/Assets/Shared/utils';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import Faucet from 'core/components/Faucet';
import { PADDING, TOP_Z_INDEX } from 'shared/constants';
import { quantityDisplayApt } from 'shared/utils';
import useCoinDisplay from 'pages/Assets/useCoinDisplay';
import { usePrompt } from 'core/providers/PromptProvider';
import BottomSheetModalContent from 'core/components/BottomSheetModalContent';
import { testProps } from 'e2e/config/testProps';
import ViewQRCodeModalBody from 'core/components/BottomModalBody/ViewQRCodeModalBody';

interface AssetsBlockProps {
  handleNavigation: (routeName: keyof RootAuthenticatedStackParamList) => void;
}

export default function AssetsBlock({
  handleNavigation,
}: AssetsBlockProps): JSX.Element {
  const { aptHeroValue, aptosCoin } = useCoinDisplay();
  const { showPrompt } = usePrompt();
  const { hasFaucet } = useNetworks();

  const { fiatDollarValue } = aptosCoin;
  const showFiat: boolean = fiatDollarValueExists(fiatDollarValue);

  const handleOnReceive = () => {
    showPrompt(
      <BottomSheetModalContent
        title={i18nmock('assets:receive.title')}
        body={<ViewQRCodeModalBody />}
      />,
    );
  };

  return (
    <View style={styles.container} {...testProps('assets-block')}>
      <View style={styles.mainDisplay} {...testProps('assets-block-balance')}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={styles.amount}
          {...testProps('assets-apt-balance')}
        >
          {quantityDisplayApt(aptHeroValue)}
        </Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.amountApt}>
          {i18nmock('general:apt')}
        </Text>
      </View>
      {showFiat ? (
        <View style={styles.dollarDisplay}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.dollarValue}
          >
            {fiatDollarValueDisplay(fiatDollarValue)}
          </Text>
        </View>
      ) : null}
      <View style={styles.buttonsContainer}>
        {hasFaucet ? (
          <Faucet containerStyleOverride={styles.buttonBoxLeft} />
        ) : null}

        <PetraPillButton
          onPress={() => handleNavigation('Buy')}
          text={i18nmock('assets:buy')}
          buttonDesign={PillButtonDesign.default}
          containerStyleOverride={styles.buttonBoxCenter}
        />
        <PetraPillButton
          onPress={() => handleNavigation('SendFlow1')}
          text={i18nmock('assets:send')}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          containerStyleOverride={styles.buttonBoxCenter}
        />
        <PetraPillButton
          onPress={handleOnReceive}
          text={i18nmock('assets:receive.title')}
          buttonDesign={PillButtonDesign.clearWithDarkText}
          containerStyleOverride={styles.buttonBoxCenter}
        />
      </View>
    </View>
  );
}

const buttonHorizontalPadding = 4;

const styles = StyleSheet.create({
  amount: {
    color: customColors.navy[900],
    fontFamily: 'WorkSans-Bold',
    fontSize: 56,
    lineHeight: 56,
  },
  amountApt: {
    color: customColors.navy[900],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 20,
    lineHeight: 42,
    marginLeft: 4,
  },
  buttonBoxCenter: {
    flex: 1,
    paddingHorizontal: buttonHorizontalPadding,
  },
  buttonBoxLeft: {
    flex: 1,
    paddingRight: buttonHorizontalPadding,
  },
  buttonBoxRight: {
    flex: 1,
    paddingLeft: buttonHorizontalPadding,
  },
  buttonsContainer: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  container: {
    flex: 1,
    marginVertical: 10,
    minHeight: 180,
    paddingHorizontal: PADDING.container,
    paddingTop: 20,
    zIndex: TOP_Z_INDEX,
  },
  currencySymbol: {
    color: customColors.navy[900],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  dollarDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 27,
    paddingHorizontal: 16,
  },
  dollarValue: {
    color: customColors.navy['600'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 18,
  },
  mainDisplay: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    width: '100%',
  },
  spacingAbove: {
    marginTop: 20,
    textAlign: 'center',
  },
});
