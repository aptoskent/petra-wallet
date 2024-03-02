// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Circle,
  Heading,
  HStack,
  Text,
  Spinner,
  Tooltip,
  VStack,
  useColorMode,
  useInterval,
} from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';
import { AiOutlinePercentage } from '@react-icons/all-files/ai/AiOutlinePercentage';
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import { BsArrowUpRight } from '@react-icons/all-files/bs/BsArrowUpRight';
import { FiDownload } from '@react-icons/all-files/fi/FiDownload';
import { ImCross } from '@react-icons/all-files/im/ImCross';
import { transparentize } from 'color2k';
import React, { useMemo, useState } from 'react';
import ChakraLink from 'core/components/ChakraLink';
import { customColors, negativeAmountColor } from '@petra/core/colors';
import {
  ActivityItem,
  isConfirmedActivityItem,
} from '@petra/core/types/activity';
import { formatAmount } from '@petra/core/utils/coin';
import collapseHexString from '@petra/core/utils/hex';
import { getServerTime } from '@petra/core/utils/server-time';

const positiveAmountColor = 'green.500';
const neutralAmountColor = 'navy.500';
const coinDepositIcon = <FiDownload />;
const coinWithdrawalIcon = <BsArrowUpRight fontSize="18px" />;
const gasFeeIcon = <AiOutlinePercentage fontSize="18px" />;
const expiredIcon = <ImCross fontSize="12px" />;
const pendingIcon = (
  <Spinner size="sm" thickness="2px" speed="0.8s" color="navy.500" />
);

/**
 * Convert a timestamp into a relative time short string. If the time difference
 * is above `threshold`, a short date is returned instead
 * @param ts timestamp in milliseconds
 * @param thresholdInDays
 */
function getRelativeTime(ts: number, thresholdInDays: number = 7) {
  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;

  const seconds = (getServerTime() - ts) / 1000;

  if (seconds < secondsInMinute) {
    return 'Moments ago';
  }
  if (seconds < secondsInHour) {
    return `${Math.round(seconds / secondsInMinute)}m`;
  }
  if (seconds < secondsInDay) {
    return `${Math.round(seconds / secondsInHour)}h`;
  }
  if (seconds < secondsInDay * thresholdInDays) {
    return `${Math.round(seconds / secondsInDay)}d`;
  }

  // Return short date
  // TODO(i18n): Use global locale instead of hardcoded en-us.
  return new Date(ts).toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'short',
  });
}

function getAbsoluteDateTime(timestampMs: number) {
  // TODO(i18n): Use global locale instead of hardcoded en-us.
  const formattedDate = new Date(timestampMs).toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  // TODO(i18n): Use global locale instead of hardcoded en-us.
  const formattedTime = new Date(timestampMs).toLocaleTimeString('en-us', {
    hour: 'numeric',
    minute: 'numeric',
  });
  // TODO(i18n): Use intl.formatMessage() for this string.
  return `${formattedDate} at ${formattedTime}`;
}

export enum ActivityStatus {
  Confirmed,
  Pending,
  Expired,
  Failed,
}

/**
 * Activity item details used to render the list item
 */
interface ActivityItemDetails {
  absDatetime: string;
  amount?: string;
  amountColor?: string;
  icon: JSX.Element;
  relativeDateTime: string;
  status: ActivityStatus;
  statusText: JSX.Element;
  text: JSX.Element;
  txnId: string;
}

/**
 * Hook for retrieving the details of an activity item.
 */
function useActivityItemDetails(item: ActivityItem): ActivityItemDetails {
  const timestamp = isConfirmedActivityItem(item)
    ? item.timestamp
    : item.expirationTimestamp;
  const [relativeDateTime, setRelativeDateTime] = useState<string>(
    getRelativeTime(timestamp),
  );
  useInterval(() => {
    setRelativeDateTime(getRelativeTime(timestamp));
  }, 5000);

  return useMemo(() => {
    if (!isConfirmedActivityItem(item)) {
      const isExpired = item.status === 'expired';
      return {
        absDatetime: getAbsoluteDateTime(item.expirationTimestamp),
        icon: isExpired ? expiredIcon : pendingIcon,
        relativeDateTime,
        status: isExpired ? ActivityStatus.Expired : ActivityStatus.Pending,
        statusText: isExpired ? (
          <FormattedMessage defaultMessage="Expired" />
        ) : (
          <FormattedMessage defaultMessage="Pending" />
        ),
        text: isExpired ? (
          <FormattedMessage defaultMessage="Expired" />
        ) : (
          <FormattedMessage defaultMessage="Pending" />
        ), // TODO: use more useful text
        txnId: item.txnHash,
      };
    }

    const amount = formatAmount(item.amount, item.coinInfo, {
      decimals: 5,
      prefix: true,
    });
    const status =
      item.status === 'success'
        ? ActivityStatus.Confirmed
        : ActivityStatus.Failed;
    const statusText =
      item.status === 'success' ? (
        <FormattedMessage defaultMessage="Confirmed" />
      ) : (
        <FormattedMessage defaultMessage="Failed" />
      );

    const common = {
      absDatetime: getAbsoluteDateTime(item.timestamp),
      amount,
      relativeDateTime,
      status,
      statusText,
      timestamp: item.timestamp,
      txnId: item.txnVersion.toString(),
    };

    if (item.type === 'gasFee') {
      return {
        ...common,
        amountColor: neutralAmountColor,
        icon: gasFeeIcon,
        text: <FormattedMessage defaultMessage="Network fee" />,
      };
    }

    const amountColor =
      item.amount > 0n ? positiveAmountColor : negativeAmountColor;
    const icon = item.amount > 0n ? coinDepositIcon : coinWithdrawalIcon;

    if (item.type === 'coinTransfer') {
      return {
        ...common,
        amountColor,
        icon,
        text:
          item.amount >= 0n ? (
            <FormattedMessage
              defaultMessage="From {sender}"
              values={{
                sender: item.senderName
                  ? item.senderName.toString()
                  : collapseHexString(item.sender, 8),
              }}
            />
          ) : (
            <FormattedMessage
              defaultMessage="To {recipient}"
              values={{
                recipient: item.recipientName
                  ? item.recipientName.toString()
                  : collapseHexString(item.recipient, 8),
              }}
            />
          ),
      };
    }

    return {
      ...common,
      amountColor,
      icon,
      text:
        item.amount >= 0n ? (
          <FormattedMessage defaultMessage="Received" />
        ) : (
          <FormattedMessage defaultMessage="Sent" />
        ),
    };
  }, [item, relativeDateTime]);
}

function useActivityItemTheme(status: ActivityStatus) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return useMemo(() => {
    const textColor = isDark ? 'navy.200' : 'navy.700';
    const chevronColor = isDark ? 'navy.700' : 'navy.500';
    const pendingTextColor = isDark ? 'navy.600' : 'navy.400';
    const failedStatusTextColor = 'red.400';

    const confirmedIconColor = customColors.green['500'];
    const unconfirmedIconColor = customColors.navy['500'];
    const confirmedIconBgColor = transparentize(confirmedIconColor, 0.9);
    const unconfirmedIconBgColor = transparentize(unconfirmedIconColor, 0.9);
    const confirmedHoverColor = transparentize(confirmedIconColor, 0.95);
    const unconfirmedHoverColor = transparentize(unconfirmedIconColor, 0.96);

    if (status === ActivityStatus.Confirmed) {
      return {
        base: {
          _hover: {
            bgColor: confirmedHoverColor,
          },
          color: textColor,
        },
        chevron: {
          color: chevronColor,
        },
        icon: {
          bgColor: confirmedIconBgColor,
          color: confirmedIconColor,
        },
        status: {
          color: textColor,
        },
      };
    }

    if (status === ActivityStatus.Pending) {
      return {
        base: {
          _hover: {
            bgColor: unconfirmedHoverColor,
          },
          color: pendingTextColor,
        },
        chevron: {
          color: 'navy.500',
        },
        icon: {
          bgColor: unconfirmedIconBgColor,
          color: transparentize(unconfirmedIconColor, 0.5),
        },
        status: {
          color: pendingTextColor,
        },
      };
    }

    return {
      base: {
        _hover: {
          bgColor: unconfirmedHoverColor,
        },
        color: pendingTextColor,
      },
      chevron: {
        color: 'navy.500',
      },
      icon: {
        bgColor: unconfirmedIconBgColor,
        color: unconfirmedIconColor,
      },
      status: {
        color: failedStatusTextColor,
      },
    };
  }, [isDark, status]);
}

export interface ActivityListItemProps {
  item: ActivityItem;
}

export function ActivityListItem({ item }: ActivityListItemProps) {
  const {
    absDatetime,
    amount,
    amountColor,
    icon,
    relativeDateTime,
    status,
    statusText,
    text,
    txnId,
  } = useActivityItemDetails(item);
  const theme = useActivityItemTheme(status);

  return (
    <ChakraLink to={`/transactions/${txnId}`} w="100%" m={0}>
      <HStack
        h="100%"
        spacing={3}
        py={4}
        px={4}
        cursor="pointer"
        {...theme.base}
      >
        <Circle size="37px" {...theme.icon}>
          {icon}
        </Circle>
        <VStack flexGrow={1} alignItems="start" spacing="3px">
          <Heading fontSize="sm">{text}</Heading>
          <Text fontSize="xs">
            <Text as="span" {...theme.status}>
              {statusText}
            </Text>
            <Text as="span" px={0.5}>
              &bull;
            </Text>
            <Tooltip label={absDatetime}>{relativeDateTime}</Tooltip>
          </Text>
        </VStack>
        <Heading
          fontSize="sm"
          alignSelf="start"
          color={amountColor}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          textAlign="right"
        >
          {amount}
        </Heading>
        <Box {...theme.chevron}>
          <BiChevronRight size="24px" />
        </Box>
      </HStack>
    </ChakraLink>
  );
}

export default ActivityListItem;
