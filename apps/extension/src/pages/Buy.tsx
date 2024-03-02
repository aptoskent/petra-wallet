// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  HStack,
  Image,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  customColors,
  secondaryButtonBgColor,
  secondaryTextColor,
} from '@petra/core/colors';
import WalletLayout from 'core/layouts/WalletLayout';
import { useAnalytics } from 'core/hooks/useAnalytics';
import { buyEvents } from '@petra/core/utils/analytics/events';
import { useDynamicConfig } from '@petra/core/flags';
import useBuyProviders, {
  BuyProviderOptions,
} from '@petra/core/hooks/useBuyProviders';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';

const windowHeight = 772;
const windowWidth = 500;

function providerOptions(provider: BuyProviderOptions) {
  switch (provider.providerName) {
    case 'moonpay':
      return {
        description: (
          <FormattedMessage defaultMessage="Buy with CC, bank transfers or Apple Pay." />
        ),
        logo: './moonpay.jpeg',
        name: 'Moonpay',
      };
    case 'coinbase':
      return {
        description: (
          <FormattedMessage defaultMessage="Buy or transfer from Coinbase." />
        ),
        logo: './coinbase.jpeg',
        name: 'Coinbase Pay',
      };
    default:
      throw new Error('Provider not supported');
  }
}

interface BuyProviderItemProps {
  isLoading: boolean;
  link: string | undefined;
  provider: BuyProviderOptions;
}

function BuyProviderItem({ isLoading, link, provider }: BuyProviderItemProps) {
  const { trackEvent } = useAnalytics();
  const { colorMode } = useColorMode();
  const { description, logo, name } = providerOptions(provider);

  const openWindow = (url: string) => {
    const params = {
      height: windowHeight,
      left: 12,
      popup: true,
      top: 12,
      width: windowWidth,
    };

    const strParams = Object.entries(params)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .reduce((acc, entry) => `${acc}, ${entry}`);

    try {
      window.open(url, '_blank', strParams);
      trackEvent({
        eventType: buyEvents.OPEN_BUY_OPTION,
        params: {
          provider: provider.providerName,
        },
      });
    } catch {
      trackEvent({
        eventType: buyEvents.ERROR_OPEN_BUY_URL,
        params: {
          provider: provider.providerName,
        },
      });
    }
  };

  const onClick = async () => {
    if (link) {
      openWindow(link);
    }
  };

  const isDisabled = isLoading || link == null;

  return (
    <HStack
      as="button"
      spacing={4}
      p={4}
      w="100%"
      onClick={onClick}
      _hover={{
        backgroundColor: secondaryButtonBgColor[colorMode],
      }}
    >
      <Image borderRadius="18px" h="36px" w="36px" src={logo} />
      <VStack flexGrow={1} spacing={1} alignItems="start">
        <Text
          fontSize="md"
          fontWeight="600"
          color={
            isDisabled ? customColors.navy['400'] : customColors.navy['900']
          }
        >
          {name}
        </Text>
        <Text
          fontSize="xs"
          fontWeight="400"
          color={
            isDisabled
              ? customColors.navy['300']
              : secondaryTextColor[colorMode]
          }
        >
          {description}
        </Text>
      </VStack>
      {isLoading ? (
        <Spinner h="4" w="4" />
      ) : (
        <ChevronRightIcon h="8" w="8" color={secondaryTextColor[colorMode]} />
      )}
    </HStack>
  );
}

function Buy() {
  const providersPayload = useDynamicConfig('buy-providers-extension');
  const { trackEvent } = useAnalytics();
  const { activeAccount } = useActiveAccount();

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

  const {
    data: providerUrlsData,
    isError,
    isLoading,
  } = useBuyProviders(
    activeAccount.address,
    handleTrackFetchProviderError,
    handleTrackFetchProviderSuccess,
  );

  const providerLink = (provider: BuyProviderOptions): undefined | string => {
    if (providerUrlsData == null || provider?.providerName == null) {
      return undefined;
    }
    switch (provider.providerName) {
      case 'moonpay':
        return providerUrlsData.moonpayUrl;
      case 'coinbase':
        return providerUrlsData.coinbaseUrl;
      default:
        return undefined;
    }
  };

  const providers: BuyProviderOptions[] =
    providersPayload?.value?.providers ?? [];

  const showAlert = () =>
    isError ||
    (!isLoading &&
      (providerUrlsData?.moonpayUrl == null ||
        providerUrlsData?.coinbaseUrl == null));

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Buy APT" />}
      showBackButton
    >
      <VStack w="100%" spacing={2}>
        {providers.map((provider: BuyProviderOptions) => (
          <BuyProviderItem
            key={provider.providerName}
            provider={provider}
            link={providerLink(provider)}
            isLoading={isLoading}
          />
        ))}
        {showAlert() ? (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription fontSize="md">
              <Text fontSize="md" fontWeight={700}>
                <FormattedMessage defaultMessage="Error Loading Provider" />
              </Text>
              <FormattedMessage defaultMessage="Please reload and try again" />
            </AlertDescription>
          </Alert>
        ) : null}
      </VStack>
    </WalletLayout>
  );
}

export default Buy;
