// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, ReactNode } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Box,
  HStack,
  Tooltip,
  Text,
  useColorMode,
  IconButton,
  VStack,
  useClipboard,
} from '@chakra-ui/react';
import { Routes } from 'core/routes';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  walletBackButtonColor,
  walletBgColor,
  walletTextColor,
} from 'core/colorHelpers';
import { secondaryBorderColor } from '@petra/core/colors';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountCircle from 'core/components/AccountCircle';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import collapseHexString from '@petra/core/utils/hex';
import { BiCopy } from '@react-icons/all-files/bi/BiCopy';

interface WalletHeaderProps {
  disableBackButton?: boolean;
  extraButtons?: ReactNode[];
  showAccountCircle?: boolean;
  showBackButton?: boolean;
  title?: JSX.Element;
}

export default function WalletHeader({
  disableBackButton,
  extraButtons,
  showAccountCircle,
  showBackButton,
  title,
}: WalletHeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { activeAccount } = useActiveAccount();
  const { activeAccountAddress } = useActiveAccount();
  const { hasCopied, onCopy } = useClipboard(activeAccountAddress ?? '');
  const intl = useIntl();

  const borderBottomColor = useMemo(() => {
    switch (pathname) {
      case Routes.wallet.path:
      case Routes.gallery.path:
      case Routes.switchAccount.path:
        return 'transparent';
      default:
        return secondaryBorderColor[colorMode];
    }
  }, [colorMode, pathname]);

  const walletNameAndAddress = useMemo(() => {
    switch (pathname) {
      case Routes.wallet.path:
      case Routes.gallery.path:
      case Routes.stake.path:
      case Routes.activity.path:
        return (
          <Tooltip
            label={
              hasCopied ? (
                <FormattedMessage defaultMessage="Copied!" />
              ) : (
                <FormattedMessage defaultMessage="Copy Address" />
              )
            }
            closeDelay={300}
          >
            <HStack spacing={0} width="100%" cursor="pointer" onClick={onCopy}>
              <Text as="span" fontSize="sm" fontWeight={400}>
                {`${
                  activeAccount.name?.toString() || 'Account'
                } (${collapseHexString(activeAccount.address, 8, true)})`}
              </Text>
              <Box>
                <IconButton
                  height="16px"
                  width="16px"
                  fontSize="16px"
                  size="xs"
                  icon={<BiCopy />}
                  aria-label={intl.formatMessage({
                    defaultMessage: 'Copy Address',
                  })}
                  bg="clear"
                  _focus={{ boxShadow: 'none' }}
                  _active={{
                    bg: 'none',
                    transform: 'scale(0.90)',
                  }}
                  variant="none"
                />
              </Box>
            </HStack>
          </Tooltip>
        );
      default:
        return undefined;
    }
  }, [
    pathname,
    hasCopied,
    activeAccount.name,
    activeAccount.address,
    onCopy,
    intl,
  ]);

  const bgColor = useMemo(() => walletBgColor(pathname), [pathname]);
  const textColor = useMemo(() => walletTextColor(pathname), [pathname]);
  const backButtonColor = useMemo(
    () => walletBackButtonColor(pathname, colorMode),
    [pathname, colorMode],
  );

  const backOnClick = () => {
    navigate(-1);
  };

  return (
    <HStack
      height="73px"
      flexShrink={0}
      width="100%"
      borderBottomColor={borderBottomColor}
      borderBottomWidth="1px"
      justifyContent="space-between"
      paddingX={4}
      bgColor={bgColor}
      color={textColor}
      overflow="hidden"
      spacing={4}
    >
      {showBackButton ? (
        <IconButton
          size="lg"
          aria-label="back"
          icon={<ArrowBackIcon fontSize={26} />}
          variant="filled"
          onClick={backOnClick}
          bgColor={backButtonColor}
          borderRadius="1rem"
          disabled={disableBackButton}
        />
      ) : null}
      <VStack
        justifyContent="center"
        spacing={0}
        width="100%"
        overflow="hidden"
      >
        <Text
          w="100%"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          fontSize="1.2rem"
          fontWeight={600}
        >
          {title}
        </Text>
        {walletNameAndAddress}
      </VStack>
      {extraButtons}
      {showAccountCircle ? (
        <Tooltip label="Switch wallet" closeDelay={300}>
          <AccountCircle onClick={() => navigate(Routes.switchAccount.path)} />
        </Tooltip>
      ) : null}
    </HStack>
  );
}
