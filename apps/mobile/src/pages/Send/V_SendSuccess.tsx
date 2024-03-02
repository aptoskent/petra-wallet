// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { formatAmount } from '@petra/core/utils/coin';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import imgSendSuccess from 'shared/assets/images/sent_success.png';
import { i18nmock } from 'strings';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import makeStyles from 'core/utils/makeStyles';

export default function SendSuccess({
  navigation,
  route,
}: RootAuthenticatedStackScreenProps<'SendFlow5'>) {
  const styles = useStyles();
  const sizeAnim = React.useRef(new Animated.Value(16)).current;
  const { transactionDuration } = route.params;
  const animateTextSize = () => {
    Animated.sequence([
      Animated.timing(sizeAnim, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        toValue: 24,
        useNativeDriver: false,
      }),
      Animated.timing(sizeAnim, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        toValue: 16,
        useNativeDriver: false,
      }),
    ]).start();
  };

  React.useEffect(() => {
    // animate text after page has been loaded
    setTimeout(animateTextSize, 1000);
  });

  const { amount, coinInfo } = route.params;

  const numericAmount = BigInt(amount);
  const formattedAmount = formatAmount(numericAmount, coinInfo, {
    prefix: false,
  });

  const onDonePress = () => {
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.contentTop}>
          <Image style={styles.topImage} source={imgSendSuccess} />
        </View>
        <View style={styles.contentBottom}>
          <View style={styles.successTextRow}>
            <Text style={styles.successText}>
              {i18nmock('assets:sendFlow.successfullySent')}
            </Text>
            <Animated.Text style={[styles.successText, { fontSize: sizeAnim }]}>
              {(transactionDuration / 1000).toFixed(2)}
            </Animated.Text>
            <Text style={styles.successText}>
              {i18nmock('assets:sendFlow.successfullySentSeconds')}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.successTextAmount}
          >
            {formattedAmount}
          </Text>
        </View>
      </View>
      <View>
        <BottomSafeAreaView>
          <PetraPillButton
            buttonDesign={PillButtonDesign.default}
            onPress={onDonePress}
            text={i18nmock('general:done')}
          />
        </BottomSafeAreaView>
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'stretch',
    backgroundColor: theme.background.secondary,
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  contentBottom: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 12,
  },
  contentTop: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  successText: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 42,
  },
  successTextAmount: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-Bold',
    fontSize: 36,
    lineHeight: 36,
    marginBottom: 4,
    marginTop: 4,
  },
  successTextFiatAmount: {
    color: theme.typography.primaryDisabled,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  successTextRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  topImage: { height: 140, width: 140 },
}));
