// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Flex, Text, Link } from '@chakra-ui/react';
import { type RawCoinInfo } from '@manahippo/coin-list';
import { customColors } from '@petra/core/colors';
import { formatAmount } from '@petra/core/utils/coin';
import { collapseHexString } from '@petra/core/utils/hex';
import { type CoinInfoData } from '@petra/core/types';
import * as Types from '@petra/core/activity/types';
import GalleryImage from 'core/components/GalleryImage';

export type ActivityEventProps<E = Types.ActivityEvent> = {
  activityEvent: E;
  // eslint-disable-next-line react/no-unused-prop-types
  coinList: Record<string, RawCoinInfo>;
};

type BaseEventProps = {
  extra: JSX.Element;
  icon: JSX.Element;
  text: JSX.Element;
};

function BaseEvent({ extra, icon, text }: BaseEventProps) {
  return (
    <Flex paddingX="16px" paddingY="24px" gap="12px">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="16 24 48 48"
        fill="none"
      >
        <rect
          x="16.5"
          y="24.5"
          width="47"
          height="47"
          rx="23.5"
          fill="white"
          stroke={customColors.navy[200]}
        />
        {icon}
      </svg>
      <Text
        flex="1"
        alignSelf="center"
        margin="0"
        fontSize="16px"
        lineHeight="24px"
        fontWeight="400"
        noOfLines={2}
        color={customColors.navy[900]}
      >
        {text}
      </Text>
      {extra}
    </Flex>
  );
}

type TokenEventProps = {
  icon: JSX.Element;
  text: JSX.Element;
  uri: string;
};

function TokenEvent({ icon, text, uri }: TokenEventProps) {
  const extra = (
    <Link target="_blank" href={uri} rel="noreferrer">
      <GalleryImage
        padding="0"
        width="48px"
        height="48px"
        borderRadius="4px"
        imageSrc={uri}
      />
    </Link>
  );
  return <BaseEvent icon={icon} text={text} extra={extra} />;
}

type DualFormattedAmountProps = {
  primary: {
    amount: bigint;
    coinInfo: CoinInfoData;
    color: string;
  };
  secondary: {
    amount: bigint;
    coinInfo: CoinInfoData;
  };
};

function DualFormattedAmount({ primary, secondary }: DualFormattedAmountProps) {
  return (
    <Box alignSelf="center" textAlign="right" lineHeight="24px">
      <Text margin="0" fontWeight="600" color={primary.color}>
        {formatAmount(primary.amount, primary.coinInfo)}
      </Text>
      <Text margin="0" color={customColors.navy[600]}>
        {formatAmount(secondary.amount, secondary.coinInfo)}
      </Text>
    </Box>
  );
}

function SendIcon() {
  return (
    <>
      <path
        d="M35 53L45 43"
        stroke={customColors.navy[600]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 43H45V53"
        stroke={customColors.navy[600]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function ReceiveIcon() {
  return (
    <>
      <path
        d="M40 41V55"
        stroke={customColors.navy[600]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M47 48L40 55L33 48"
        stroke={customColors.navy[600]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function SendCoinEvent({
  activityEvent,
  coinList,
}: ActivityEventProps<Types.SendCoinEvent>) {
  const coinInfo = coinList[activityEvent.coin];
  const text = (
    <FormattedMessage
      defaultMessage="You sent {receiver} {coinSymbol}."
      values={{
        coinSymbol: coinInfo.symbol,
        receiver: (
          <Text as="span" fontWeight="600">
            {collapseHexString(activityEvent.receiver.address)}
          </Text>
        ),
      }}
      description="Activity message when the user sends coin to somebody."
    />
  );
  const primary = {
    amount: -activityEvent.amount,
    coinInfo: {
      decimals: coinInfo.decimals,
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      type: '',
    },
    color: customColors.navy[900],
  };
  // TODO
  const secondary = {
    amount: -12345n,
    coinInfo: {
      decimals: 2,
      name: '',
      symbol: 'USD',
      type: '',
    },
  };
  const extra = <DualFormattedAmount primary={primary} secondary={secondary} />;
  return <BaseEvent icon={<SendIcon />} text={text} extra={extra} />;
}

function ReceiveCoinEvent({
  activityEvent,
  coinList,
}: ActivityEventProps<Types.ReceiveCoinEvent>) {
  const coinInfo = coinList[activityEvent.coin];
  const text = (
    <FormattedMessage
      defaultMessage="You received {coinSymbol} from {sender}."
      values={{
        coinSymbol: coinInfo.symbol,
        sender: (
          <Text as="span" fontWeight="600">
            {collapseHexString(activityEvent.sender.address)}
          </Text>
        ),
      }}
      description="Activity message when the user receives coin from somebody."
    />
  );
  const primary = {
    amount: activityEvent.amount,
    coinInfo: {
      decimals: coinInfo.decimals,
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      type: '',
    },
    color: customColors.green[600],
  };
  // TODO
  const secondary = {
    amount: 12345n,
    coinInfo: {
      decimals: 2,
      name: '',
      symbol: 'USD',
      type: '',
    },
  };
  const extra = <DualFormattedAmount primary={primary} secondary={secondary} />;
  return <BaseEvent icon={<ReceiveIcon />} text={text} extra={extra} />;
}

function SwapCoinEvent({
  activityEvent,
  coinList,
}: ActivityEventProps<Types.SwapCoinEvent>) {
  const coinInfo = coinList[activityEvent.coin];
  const swapCoinInfo = coinList[activityEvent.swapCoin];
  const text = (
    <FormattedMessage
      defaultMessage="You swapped {coinSymbol} → {swapCoinSymbol}."
      values={{
        coinSymbol: coinInfo.symbol,
        swapCoinSymbol: swapCoinInfo.symbol,
      }}
      description="Activity message when the user swaps one type of coin for another."
    />
  );
  const primary = {
    amount: activityEvent.swapAmount,
    coinInfo: {
      decimals: swapCoinInfo.decimals,
      name: swapCoinInfo.name,
      symbol: swapCoinInfo.symbol,
      type: '',
    },
    color: customColors.green[600],
  };
  const secondary = {
    amount: -activityEvent.amount,
    coinInfo: {
      decimals: coinInfo.decimals,
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      type: '',
    },
  };
  const extra = <DualFormattedAmount primary={primary} secondary={secondary} />;
  return (
    <BaseEvent
      icon={
        <g>
          <path
            d="M44.5834 37.9167L48.25 41.5834L44.5834 45.25"
            stroke={customColors.navy[600]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31.75 47.0833V45.25C31.75 44.2775 32.1363 43.3449 32.8239 42.6573C33.5116 41.9696 34.4442 41.5833 35.4167 41.5833H48.25"
            stroke={customColors.navy[600]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M35.4167 58.0833L31.75 54.4167L35.4167 50.75"
            stroke={customColors.navy[600]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M48.25 48.9167V50.75C48.25 51.7225 47.8637 52.6551 47.1761 53.3427C46.4884 54.0304 45.5558 54.4167 44.5833 54.4167H31.75"
            stroke={customColors.navy[600]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      }
      text={text}
      extra={extra}
    />
  );
}

function GasEvent({
  activityEvent,
  coinList,
}: ActivityEventProps<Types.GasEvent>) {
  const coinInfo = coinList['0x1::aptos_coin::AptosCoin'];
  const text = (
    <FormattedMessage
      defaultMessage="Network Fee: Miscellaneous"
      description="Activity message when the user pays a miscellaneous gas fee."
    />
  );
  const primary = {
    amount: -activityEvent.gas,
    coinInfo: {
      decimals: coinInfo.decimals,
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      type: '',
    },
    color: customColors.navy[900],
  };
  // TODO
  const secondary = {
    amount: -23n,
    coinInfo: {
      decimals: 4,
      name: '',
      symbol: 'USD',
      type: '',
    },
  };
  const extra = <DualFormattedAmount primary={primary} secondary={secondary} />;
  return (
    <BaseEvent
      icon={
        <>
          <path
            d="M40 50C41.1046 50 42 49.1046 42 48C42 46.8954 41.1046 46 40 46C38.8954 46 38 46.8954 38 48C38 49.1046 38.8954 50 40 50Z"
            stroke={customColors.navy[600]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M44.2401 43.76C44.7979 44.3172 45.2405 44.979 45.5424 45.7074C45.8444 46.4357 45.9998 47.2165 45.9998 48.005C45.9998 48.7935 45.8444 49.5742 45.5424 50.3026C45.2405 51.031 44.7979 51.6928 44.2401 52.25M35.7601 52.24C35.2022 51.6828 34.7596 51.021 34.4577 50.2926C34.1558 49.5642 34.0003 48.7835 34.0003 47.995C34.0003 47.2065 34.1558 46.4257 34.4577 45.6974C34.7596 44.969 35.2022 44.3072 35.7601 43.75M47.0701 40.93C48.9448 42.8053 49.9979 45.3484 49.9979 48C49.9979 50.6516 48.9448 53.1947 47.0701 55.07M32.9301 55.07C31.0554 53.1947 30.0022 50.6516 30.0022 48C30.0022 45.3484 31.0554 42.8053 32.9301 40.93"
            stroke={customColors.navy[600]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      }
      text={text}
      extra={extra}
    />
  );
}

function SendTokenEvent({
  activityEvent,
}: ActivityEventProps<Types.SendTokenEvent>) {
  const text = (
    <FormattedMessage
      defaultMessage="You sent {tokenName} {receiver}."
      values={{
        receiver: (
          <Text as="span" fontWeight="600">
            {collapseHexString(activityEvent.receiver.address)}
          </Text>
        ),
        tokenName: activityEvent.name,
      }}
      description="Activity message when the user sends a token to somebody."
    />
  );
  return <TokenEvent icon={<SendIcon />} text={text} uri={activityEvent.uri} />;
}

function ReceiveTokenEvent({
  activityEvent,
}: ActivityEventProps<Types.ReceiveTokenEvent>) {
  let text;
  if (activityEvent.sender) {
    text = (
      <FormattedMessage
        defaultMessage="You received {tokenName} {sender}."
        values={{
          sender: (
            <Text as="span" fontWeight="600">
              {collapseHexString(activityEvent.sender.address)}
            </Text>
          ),
          tokenName: activityEvent.name,
        }}
        description="Activity message when the user receives a token from somebody."
      />
    );
  } else {
    text = (
      <FormattedMessage
        defaultMessage="You received {tokenName}."
        values={{
          tokenName: activityEvent.name,
        }}
        description="Activity message when the user receives a token from somebody."
      />
    );
  }

  return (
    <TokenEvent icon={<ReceiveIcon />} text={text} uri={activityEvent.uri} />
  );
}

function SendTokenOfferEvent({
  activityEvent,
}: ActivityEventProps<Types.SendTokenOfferEvent>) {
  const text = (
    <FormattedMessage
      defaultMessage="You sent a Pending NFT to {receiver}: {tokenName}."
      values={{
        receiver: (
          <Text as="span" fontWeight="600">
            {collapseHexString(activityEvent.receiver.address)}
          </Text>
        ),
        tokenName: activityEvent.name,
      }}
      description="Activity message when the user offers a token to somebody."
    />
  );
  return <TokenEvent icon={<SendIcon />} text={text} uri={activityEvent.uri} />;
}

function ReceiveTokenOfferEvent({
  activityEvent,
}: ActivityEventProps<Types.ReceiveTokenOfferEvent>) {
  const text = (
    <FormattedMessage
      defaultMessage="You received a Pending NFT from {sender}: {tokenName}."
      values={{
        sender: (
          <Text as="span" fontWeight="600">
            {collapseHexString(activityEvent.sender.address)}
          </Text>
        ),
        tokenName: activityEvent.name,
      }}
      description="Activity message when the user receives a token offer from somebody."
    />
  );
  return (
    <TokenEvent icon={<ReceiveIcon />} text={text} uri={activityEvent.uri} />
  );
}

// https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html
function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

export default function ActivityEvent({
  activityEvent,
  coinList,
}: ActivityEventProps) {
  // eslint-disable-next-line no-underscore-dangle
  switch (activityEvent._type) {
    case 'send':
      return (
        <SendCoinEvent activityEvent={activityEvent} coinList={coinList} />
      );
    case 'receive':
      return (
        <ReceiveCoinEvent activityEvent={activityEvent} coinList={coinList} />
      );
    case 'swap':
      return (
        <SwapCoinEvent activityEvent={activityEvent} coinList={coinList} />
      );
    case 'gas':
      return <GasEvent activityEvent={activityEvent} coinList={coinList} />;
    case 'send_token':
      return (
        <SendTokenEvent activityEvent={activityEvent} coinList={coinList} />
      );
    case 'receive_token':
      return (
        <ReceiveTokenEvent activityEvent={activityEvent} coinList={coinList} />
      );
    case 'send_token_offer':
      return (
        <SendTokenOfferEvent
          activityEvent={activityEvent}
          coinList={coinList}
        />
      );
    case 'receive_token_offer':
      return (
        <ReceiveTokenOfferEvent
          activityEvent={activityEvent}
          coinList={coinList}
        />
      );
    case 'add-stake':
    case 'unstake':
    case 'withdraw-stake':
    case 'mint_token':
      // eslint-disable-next-line no-console
      console.warn('Mint token event not implemented');
      return null;
    default:
      return assertNever(activityEvent);
  }
}
