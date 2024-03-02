// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { customColors } from '@petra/core/colors';
import { petraLogo } from 'shared/assets/images';
import { i18nmock } from 'strings';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { AppLaunchStackScreenProps } from 'navigation/types';
import AptosWordSVG from 'shared/assets/svgs/aptos_word_icon';
import OneHomeSVG from 'shared/assets/svgs/one_home_icon';
import SimplifiedSVG from 'shared/assets/svgs/simplified_icon';
import NewHereSVG from 'shared/assets/svgs/new_here_icon';
import { useFocusEffect } from '@react-navigation/native';
import PetraDots from 'core/components/PetraDots';
import { useDeeplink } from 'core/providers/DeeplinkProvider';
import { testProps } from 'e2e/config/testProps';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import { useTheme } from 'core/providers/ThemeProvider';
import {
  TALL_BUTTON_OVERRIDE_STYLE,
  TALL_BUTTON_TEXT_OVERRIDE_STYLE,
} from 'core/components/PetraPillButton';
import { getRenfieldContent } from 'core/components/PetraAlertModalContent';
import { useAlertModalContext } from 'core/providers/AlertModalProvider';
import { deeplinkEvents } from '@petra/core/utils/analytics/events';
import useTrackEvent from 'core/hooks/useTrackEvent';

interface ItemType {
  headingText?: string;
  image: JSX.Element | null;
  subtext?: string;
  text?: string;
}

interface ItemProps {
  item: ItemType;
}

const carouselData = [
  {
    headingText: i18nmock('onboarding:appLaunch.title'),
    image: <Image source={petraLogo} />,
    subtext: i18nmock('onboarding:appLaunch.subtext'),
  },
  {
    image: <OneHomeSVG />,
    subtext: i18nmock('onboarding:welcome.homeForDigitalAssets.subtext'),
    text: i18nmock('onboarding:welcome.homeForDigitalAssets.text'),
  },
  {
    image: <SimplifiedSVG />,
    subtext: i18nmock('onboarding:welcome.simplifiedTransaction.subtext'),
    text: i18nmock('onboarding:welcome.simplifiedTransaction.text'),
  },
  {
    image: <NewHereSVG />,
    subtext: i18nmock('onboarding:welcome.weGotYou.subtext'),
    text: i18nmock('onboarding:welcome.weGotYou.text'),
  },
];

function Welcome({ navigation }: AppLaunchStackScreenProps<'Welcome'>) {
  const styles = useStyles();
  const [index, setIndex] = useState<number>(0);
  const { theme } = useTheme();
  const { deeplink, setDeeplink } = useDeeplink();
  const { trackEvent } = useTrackEvent();
  const { dismissAlertModal, showAlertModal } = useAlertModalContext();

  useEffect(() => {
    if (deeplink?.renfield?.privateKey) {
      const { privateKey } = deeplink.renfield;
      const onRenfieldAlertOk = () => {
        void trackEvent({
          eventType: deeplinkEvents.REDIRECT_RENFIELD,
        });
        navigation.navigate('ImportStack', { privateKey });
        dismissAlertModal();
      };
      showAlertModal(
        getRenfieldContent({ isLoading: false, onPress: onRenfieldAlertOk }),
      );
      setDeeplink(undefined);
    }
  }, [
    deeplink,
    dismissAlertModal,
    navigation,
    setDeeplink,
    showAlertModal,
    trackEvent,
  ]);

  useFocusEffect(
    useCallback(() => {
      // set to light-content: dark background, white texts and icons
      // because app launch/welcome screen has dark navy.900 background color
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(theme.background.primary);
      }

      return () => {
        // revert back to dark-content: light background, dark texts and icons
        // when when AppLaunch screen unmounted because both Import & Signup screen
        // will have light background
        StatusBar.setBarStyle('dark-content');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor(theme.background.secondary);
        }
      };
    }, [theme]),
  );

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const onCreateNewWalletPress = () => {
    navigation.navigate('SignupStack');
  };

  const onImportWalletPress = () => {
    navigation.navigate('ImportStack');
  };

  const renderItems = ({
    item: { headingText, image, subtext, text },
  }: ItemProps) => (
    <View style={styles.item}>
      <View style={styles.image}>{image}</View>
      {headingText ? (
        <Text style={styles.headingText}>{headingText}</Text>
      ) : null}
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {subtext ? <Text style={styles.subText}>{subtext}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container} {...testProps('Welcome-screen')}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bodyContainer}>
        <Carousel
          {...testProps('onboarding-carousel')}
          loop
          width={Dimensions.get('window').width}
          height={400}
          pagingEnabled={false}
          snapEnabled
          data={carouselData}
          onSnapToItem={(currIndex: number) => setIndex(currIndex)}
          renderItem={renderItems}
          autoPlayInterval={8000}
        />
      </View>
      <View style={styles.dots} {...testProps('dots')}>
        <PetraDots length={carouselData.length} activeIndex={index} />
      </View>
      <View style={styles.buttonContainer}>
        <PetraPillButton
          accessibilityLabel={i18nmock(
            'onboarding:appLaunch.createWallet.accessibility',
          )}
          buttonStyleOverride={TALL_BUTTON_OVERRIDE_STYLE}
          buttonTextStyleOverride={TALL_BUTTON_TEXT_OVERRIDE_STYLE}
          containerStyleOverride={styles.buttonOverride}
          onPress={onCreateNewWalletPress}
          testId="create-wallet"
          text={i18nmock('onboarding:appLaunch.createWallet.text')}
        />
        <PetraPillButton
          accessibilityLabel={i18nmock(
            'onboarding:appLaunch.importWallet.accessibility',
          )}
          buttonDesign={PillButtonDesign.clearWithWhiteText}
          buttonStyleOverride={TALL_BUTTON_OVERRIDE_STYLE}
          buttonTextStyleOverride={TALL_BUTTON_TEXT_OVERRIDE_STYLE}
          containerStyleOverride={styles.buttonOverride}
          onPress={onImportWalletPress}
          testId="import-wallet"
          text={i18nmock('onboarding:appLaunch.importWallet.text')}
        />
        <View style={styles.byContainer} {...testProps('by-aptos')}>
          <View style={styles.byLogo}>
            <Text style={styles.byText}>
              {i18nmock('onboarding:welcome.by')}
            </Text>
            <AptosWordSVG color={customColors.navy['500']} />
            <View style={styles.labsContainer}>
              <Text style={styles.labs}>
                {i18nmock('onboarding:welcome.labs')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Welcome;

const useStyles = makeStyles((theme) => ({
  bodyContainer: {
    alignItems: 'center',
    backgroundColor: theme.background.primary,
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: PADDING.container,
    paddingTop: 8,
    width: '100%',
  },
  buttonOverride: {
    marginVertical: 8,
  },
  byContainer: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
  byLogo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  byText: {
    color: customColors.navy['500'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.primary,
    flex: 1,
    justifyContent: 'space-between',
  },
  dots: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    color: theme.typography.secondary,
    fontFamily: 'WorkSans-Bold',
    fontSize: 48,
    marginTop: 12,
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  labs: {
    color: customColors.navy['500'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 8,
    marginLeft: 4,
    marginTop: 6,
  },
  labsContainer: {
    height: '100%',
  },
  subText: {
    color: theme.typography.secondaryDisabled,
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  text: {
    color: theme.typography.secondary,
    fontFamily: 'WorkSans-Bold',
    fontSize: 32,
    marginTop: 12,
    paddingHorizontal: 40,
    textAlign: 'center',
  },
}));
