// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { type UseInfiniteQueryResult } from 'react-query';
import { Box, Center, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { type ActivityEvent, useActivity } from '@petra/core/activity';
import useCoinListDict from '@petra/core/hooks/useCoinListDict';
import WalletLayout from 'core/layouts/WalletLayout';
import NextPageLoader from 'core/components/NextPageLoader';
import { ActivityList } from 'modules/activity';
import { customColors } from '@petra/core/colors';

function ZeroStateIcon() {
  return (
    <svg
      width="142"
      height="141"
      viewBox="0 0 142 141"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="140.272"
        height="140"
        transform="translate(0.864014 0.5)"
        fill="#FF4B4B"
        fillOpacity="0.1"
      />
      <path
        d="M37.0507 125.5C29.1905 125.5 22.8174 119.127 22.8174 111.267C22.8174 103.407 29.1905 97.0334 37.0507 97.0334C44.9109 97.0334 51.284 103.407 51.284 111.267C51.284 119.127 44.9109 125.5 37.0507 125.5ZM37.0507 99.8376C30.7625 99.8376 25.664 104.936 25.664 111.224C25.664 117.512 30.7625 122.611 37.0507 122.611C43.3388 122.611 48.4373 117.512 48.4373 111.224C48.4373 104.936 43.3388 99.8376 37.0507 99.8376Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M76.9464 37.8906L74.9495 35.8937L83.4045 27.4387C83.4895 27.3537 83.4895 27.2263 83.4045 27.1413L74.9495 18.6863L76.9464 16.6894L85.4014 25.1444C86.591 26.3341 86.591 28.2885 85.4014 29.4781L76.9464 37.8906Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M84.2121 25.3574H40.3225V28.204H84.2121V25.3574Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M60.8875 79.2312L52.4325 70.7762C51.2429 69.5865 51.2429 67.6321 52.4325 66.4424L60.8875 57.9874L62.8844 59.9843L54.4294 68.4393C54.3445 68.5243 54.3445 68.6518 54.4294 68.7368L62.8844 77.1918L60.8875 79.2312Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M95.3016 67.6747H53.324V70.5214H95.3016V67.6747Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M116.972 83.1825H98.1079C95.8135 83.1825 93.9441 81.313 93.9441 79.0187V60.1542C93.9441 57.8599 95.8135 55.9905 98.1079 55.9905H116.972C119.267 55.9905 121.136 57.8599 121.136 60.1542V79.0612C121.136 81.3555 119.267 83.1825 116.972 83.1825ZM98.1079 58.8796C97.3856 58.8796 96.7908 59.4745 96.7908 60.1967V79.0612C96.7908 79.7835 97.3856 80.3783 98.1079 80.3783H116.972C117.695 80.3783 118.289 79.7835 118.289 79.0612V60.1967C118.289 59.4745 117.695 58.8796 116.972 58.8796H98.1079Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M44.1896 38.9956H23.7107C22.691 38.9956 21.7563 38.4432 21.2464 37.551C20.7366 36.6588 20.7366 35.5966 21.2464 34.7043L31.4859 16.9446C31.9957 16.0523 32.9305 15.5 33.9502 15.5C34.9699 15.5 35.9046 16.0523 36.4144 16.9446L46.6539 34.7043C47.1638 35.5966 47.1638 36.6588 46.6539 37.551C46.1441 38.4857 45.2518 38.9956 44.1896 38.9956ZM33.9502 18.3891L23.7107 36.1489H33.9502H44.1896L39.0911 27.269L33.9502 18.3891Z"
        fill="#231F20"
      />
      <path
        d="M32.718 17.6669L33.9502 18.3891M33.9502 18.3891L23.7107 36.1489H33.9502H44.1896L39.0911 27.269L33.9502 18.3891ZM44.1896 38.9956H23.7107C22.691 38.9956 21.7563 38.4432 21.2464 37.551C20.7366 36.6588 20.7366 35.5966 21.2464 34.7043L31.4859 16.9446C31.9957 16.0523 32.9305 15.5 33.9502 15.5C34.9699 15.5 35.9046 16.0523 36.4144 16.9446L46.6539 34.7043C47.1638 35.5966 47.1638 36.6588 46.6539 37.551C46.1441 38.4857 45.2518 38.9956 44.1896 38.9956Z"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M98.7436 44.0941H95.897V42.1396H98.7436V44.0941ZM98.7436 35.8515H95.897V29.5634H98.7436V35.8515ZM98.7436 23.2752H95.897V16.9871H98.7436V23.2752Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M107.666 44.0941H104.819V42.1396H107.666V44.0941ZM107.666 35.8515H104.819V29.5634H107.666V35.8515ZM107.666 23.2752H104.819V16.9871H107.666V23.2752Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M116.587 44.0941H113.74V42.1396H116.587V44.0941ZM116.587 35.8515H113.74V29.5634H116.587V35.8515ZM116.587 23.2752H113.74V16.9871H116.587V23.2752Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M23.7107 82.2054H20.864V80.251H23.7107V82.2054ZM23.7107 73.9203H20.864V67.6322H23.7107V73.9203ZM23.7107 61.3441H20.864V55.0559H23.7107V61.3441Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M32.633 82.2054H29.7864V80.251H32.633V82.2054ZM32.633 73.9203H29.7864V67.6322H32.633V73.9203ZM32.633 61.3441H29.7864V55.0559H32.633V61.3441Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M41.5554 82.2054H38.7087V80.251H41.5554V82.2054ZM41.5554 73.9203H38.7087V67.6322H41.5554V73.9203ZM41.5554 61.3441H38.7087V55.0559H41.5554V61.3441Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M100.019 125.415H97.1719V123.46H100.019V125.415ZM100.019 117.172H97.1719V110.884H100.019V117.172ZM100.019 104.554H97.1719V98.2654H100.019V104.554Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M108.941 125.415H106.094V123.46H108.941V125.415ZM108.941 117.172H106.094V110.884H108.941V117.172ZM108.941 104.554H106.094V98.2654H108.941V104.554Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M117.862 125.414H115.015V123.459H117.862V125.414ZM117.862 117.171H115.015V110.883H117.862V117.171ZM117.862 104.552H115.015V98.2643H117.862V104.552Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M76.9464 123.885L74.9495 121.888L83.4045 113.433C83.447 113.391 83.447 113.306 83.447 113.306C83.447 113.264 83.447 113.221 83.4045 113.179L74.9495 104.724L76.9464 102.727L85.4014 111.182C85.9962 111.776 86.2936 112.541 86.2936 113.348C86.2936 114.156 85.9962 114.921 85.4014 115.515L76.9464 123.885Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
      <path
        d="M84.5936 111.35H49.8813V114.196H84.5936V111.35Z"
        fill="#231F20"
        stroke="white"
        strokeWidth="0.75"
      />
    </svg>
  );
}

function ZeroState() {
  return (
    <Center h="100%">
      <VStack w="62%" spacing={0}>
        <Box mb="24px">
          <ZeroStateIcon />
        </Box>
        <Heading
          fontSize="24px"
          lineHeight="29px"
          color={customColors.navy[900]}
        >
          <FormattedMessage defaultMessage="No Activity Yet" />
        </Heading>
        <Text
          fontSize="14px"
          lineHeight="21px"
          color={customColors.navy[600]}
          textAlign="center"
        >
          <FormattedMessage defaultMessage="All of your transactions and dApp interactions will show up here." />
        </Text>
      </VStack>
    </Center>
  );
}

function LoadingState() {
  return (
    <Center h="100%">
      <Spinner size="xl" thickness="4px" />
    </Center>
  );
}

function ErrorState() {
  // TODO
  return <ZeroState />;
}

type ActivityInnerProps = {
  activity: UseInfiniteQueryResult<{ events: ActivityEvent[] }>;
};

function ActivityInner({ activity }: ActivityInnerProps) {
  const { coinListDict } = useCoinListDict();
  if (activity.isLoading) {
    return <LoadingState />;
  }
  if (activity.isError) {
    return <ErrorState />;
  }
  const pages = activity.data?.pages;
  const activityEvents: ActivityEvent[] =
    pages?.flatMap((page) => page.events) ?? [];

  if (activityEvents.length === 0) {
    return <ZeroState />;
  }

  return (
    <>
      <ActivityList activityEvents={activityEvents} coinList={coinListDict} />
      {activity.hasNextPage && <NextPageLoader query={activity} />}
      {activity.isFetchingNextPage && (
        <Center m={8}>
          <Spinner />
        </Center>
      )}
    </>
  );
}

export default function Activity() {
  const { activeAccountAddress } = useActiveAccount();
  const activity = useActivity(activeAccountAddress);

  return (
    <WalletLayout title={<FormattedMessage defaultMessage="Activity" />}>
      <ActivityInner activity={activity} />
    </WalletLayout>
  );
}
