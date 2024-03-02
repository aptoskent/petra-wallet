// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import TokenBody from 'core/components/TokenBody';
import WalletLayout from 'core/layouts/WalletLayout';
import { useLocation } from 'react-router-dom';
import TokenData from '@petra/core/types/token';
import {
  Button,
  Icon,
  useColorMode,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { RiSendPlaneFill } from '@react-icons/all-files/ri/RiSendPlaneFill';
import { secondaryButtonBgColor } from '@petra/core/colors';
import SendTokenDrawer from 'core/components/SendTokenDrawer';
import { ExtendedTokenData } from '@petra/core/types';

function SendButton({ onClick }: { onClick: () => void }) {
  const { colorMode } = useColorMode();
  const { state } = useLocation();
  const tokenData = state as ExtendedTokenData;
  return (
    <Tooltip
      label={
        tokenData && tokenData.amount === 0 ? (
          <FormattedMessage defaultMessage="No token left" />
        ) : (
          <FormattedMessage defaultMessage="Send token" />
        )
      }
    >
      <Button
        onClick={onClick}
        aria-label="offer"
        bgColor={secondaryButtonBgColor[colorMode]}
        isDisabled={tokenData && tokenData.amount === 0}
      >
        <Icon as={RiSendPlaneFill} color="salmon" w={6} h={6} />
      </Button>
    </Tooltip>
  );
}

function Token() {
  const { state } = useLocation();
  const tokenData = state as TokenData;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const canSend = !tokenData.isSoulbound;

  return (
    <WalletLayout
      title={<span>{tokenData?.name ?? ''}</span>}
      showBackButton
      position="relative"
      showAccountCircle={false}
      headerButtons={
        canSend ? [<SendButton key="send-button" onClick={onOpen} />] : []
      }
    >
      <TokenBody />
      <SendTokenDrawer isOpen={isOpen} onClose={onClose} />
    </WalletLayout>
  );
}

export default Token;
