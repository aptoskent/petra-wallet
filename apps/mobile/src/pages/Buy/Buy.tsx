// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { MoonPayLogoSVG, CoinbasePayLogoSVG } from 'shared/assets/svgs';
import { customColors } from '@petra/core/colors';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import useBuyProviderUrl, {
  BuyProviderOptions,
} from '@petra/core/hooks/useBuyProviders';
import BuyProvider from '@petra/core/types/buy';
import Typography from 'core/components/Typography';
import ExternalLinkIconSVG from 'shared/assets/svgs/external_link_icon';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useDynamicConfig } from '@petra/core/flags';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { buyEvents } from '@petra/core/utils/analytics/events';

function logoOrTitleForProviderName(
  providerName: BuyProvider | null,
): JSX.Element | null {
  switch (providerName) {
    case BuyProvider.MOONPAY:
      return <MoonPayLogoSVG />;
    case BuyProvider.COINBASE_PAY:
      return <CoinbasePayLogoSVG />;
    default:
      return null;
  }
}

function providerNameToProvider(name: string) {
  switch (name) {
    case 'moonpay':
      return BuyProvider.MOONPAY;
    case 'coinbase':
      return BuyProvider.COINBASE_PAY;
    default:
      return null;
  }
}

interface BuyButtonProps {
  isLoading: boolean;
  link: string | undefined;
  provider: BuyProviderOptions;
}

function ProviderBlock({ isLoading, link, provider }: BuyButtonProps) {
  const { trackEvent } = useTrackEvent();
  const styles = useStyles();
  const { buttonText, infoText } = provider;

  const validateAndOpen = async () => {
    if (link === undefined) {
      return;
    }
    const providerName: string = (provider?.providerName ?? '') as string;
    const supported = await Linking.canOpenURL(link);

    if (supported) {
      await Linking.openURL(link);
      void trackEvent({
        eventType: buyEvents.OPEN_BUY_OPTION,
        params: {
          provider: providerName,
        },
      });
    } else {
      void trackEvent({
        eventType: buyEvents.ERROR_OPEN_BUY_URL,
        params: {
          provider: providerName,
        },
      });
    }
  };

  const logoDisplay = () => {
    const providerFromName: BuyProvider | null = providerNameToProvider(
      (provider?.providerName as string) ?? '',
    );
    return logoOrTitleForProviderName(providerFromName);
  };

  return (
    <View style={styles.providerBlock}>
      <View style={styles.logoContainer}>{logoDisplay()}</View>
      <Typography
        align="center"
        variant="small"
        style={styles.spacingTop}
        color={customColors.navy['900']}
      >
        {infoText}
      </Typography>
      <PetraPillButton
        isLoading={isLoading}
        disabled={isLoading || link === undefined}
        buttonStyleOverride={styles.button}
        buttonDesign={PillButtonDesign.clearWithDarkText}
        onPress={validateAndOpen}
        text={buttonText}
        rightIcon={() => (
          <ExternalLinkIconSVG
            color={isLoading || link === undefined ? 'navy.500' : 'navy.900'}
            size={16}
          />
        )}
      />
    </View>
  );
}

export default function Buy() {
  const providersPayload = useDynamicConfig('buy-providers');
  const styles = useStyles();
  const { activeAccount } = useActiveAccount();
  const { trackEvent } = useTrackEvent();
  const handleTrackFetchProviderSuccess = () => {
    void trackEvent({
      eventType: buyEvents.FETCH_BUY_PROVIDERS,
    });
  };

  const handleTrackFetchProviderError = () => {
    void trackEvent({
      eventType: buyEvents.ERROR_FETCH_BUY_PROVIDERS,
    });
  };

  const { data: dataProviderUrl, isLoading } = useBuyProviderUrl(
    activeAccount.address,
    handleTrackFetchProviderError,
    handleTrackFetchProviderSuccess,
  );

  const providers: BuyProviderOptions[] =
    providersPayload?.value?.providers ?? [];

  const providerLink = (provider: BuyProviderOptions): undefined | string => {
    if (dataProviderUrl == null || provider?.providerName == null) {
      return undefined;
    }
    switch (provider.providerName) {
      case 'moonpay':
        return dataProviderUrl.moonpayUrl;
      case 'coinbase':
        return dataProviderUrl.coinbaseUrl;
      default:
        return undefined;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {providers.map((provider: BuyProviderOptions) => (
          <ProviderBlock
            key={provider.providerName}
            provider={provider}
            link={providerLink(provider)}
            isLoading={isLoading}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const targetButtonGutter = 65;
const horizontalPaddingOnProviderBlock = 32;
const horizontalButtonPadding =
  targetButtonGutter - horizontalPaddingOnProviderBlock;
const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 24,
    paddingHorizontal: horizontalButtonPadding,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    height: '100%',
    paddingHorizontal: PADDING.container,
    paddingTop: 30,
  },
  logoContainer: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: '100%',
  },
  providerBlock: {
    alignItems: 'center',
    borderColor: customColors.navy['100'],
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    minHeight: 100,
    paddingHorizontal: horizontalPaddingOnProviderBlock,
    paddingVertical: 24,
    width: '100%',
  },
  scrollView: {
    backgroundColor: theme.background.secondary,
    paddingTop: 4,
    width: '100%',
  },
  spacingTop: {
    marginTop: 24,
  },
}));
