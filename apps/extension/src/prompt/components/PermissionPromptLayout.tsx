// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import { GiUsbKey } from '@react-icons/all-files/gi/GiUsbKey';
import React, { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  useColorMode,
  Icon,
} from '@chakra-ui/react';
import {
  ApprovalRequestArgs,
  ApprovalResponseArgs,
} from '@petra/core/approval';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import {
  permissionRequestBgColor,
  permissionRequestLayoutBgColor,
  permissionRequestTileBgColor,
  secondaryBorderColor,
} from '@petra/core/colors';

import AccountCircle from 'core/components/AccountCircle';
import { useAnalytics } from 'core/hooks/useAnalytics';
import { dAppEvents } from '@petra/core/utils/analytics/events';
import { isKeystoneSignatureCancel, QRIcon } from 'modules/keystone';
import { useApprovalRequestContext } from '../hooks';
import { DappInfoTile } from './DappInfoTile';

type ApprovalRequestType = ApprovalRequestArgs['type'];
type DAppEventType = typeof dAppEvents extends { [key: string]: infer V }
  ? V
  : never;

const successTrackingEventTypeMap: Record<ApprovalRequestType, DAppEventType> =
  {
    connect: dAppEvents.APPROVE_DAPP_CONNECTION,
    signAndSubmitTransaction: dAppEvents.APPROVE_SIGN_AND_SUBMIT_TRANSACTION,
    signMessage: dAppEvents.APPROVE_SIGN_MESSAGE,
    signMultiAgentTransaction: dAppEvents.APPROVE_SIGN_MULTI_AGENT_TRANSACTION,
    signTransaction: dAppEvents.APPROVE_SIGN_TRANSACTION,
  };

const errorTrackingEventTypeMap: Record<ApprovalRequestType, DAppEventType> = {
  connect: dAppEvents.ERROR_APPROVE_DAPP_CONNECTION,
  signAndSubmitTransaction:
    dAppEvents.ERROR_APPROVE_SIGN_AND_SUBMIT_TRANSACTION,
  signMessage: dAppEvents.ERROR_APPROVE_SIGN_MESSAGE,
  signMultiAgentTransaction:
    dAppEvents.ERROR_APPROVE_SIGN_MULTI_AGENT_TRANSACTION,
  signTransaction: dAppEvents.ERROR_APPROVE_SIGN_TRANSACTION,
};

export const FooterButton = styled(Button)`
  height: 48px;
  font-size: 18px;
  line-height: 28px;
`;

const hiddenScrollbarCss = { '&::-webkit-scrollbar': { display: 'none' } };

interface PermissionRequestHeaderProps {
  title: JSX.Element;
}

function PermissionRequestHeader({ title }: PermissionRequestHeaderProps) {
  const { colorMode } = useColorMode();

  return (
    <HStack
      height="84px"
      minHeight="84px"
      borderBottomColor={secondaryBorderColor[colorMode]}
      borderBottomWidth="1px"
      justifyContent="space-between"
      padding={6}
      bgColor={permissionRequestLayoutBgColor[colorMode]}
    >
      <Text fontSize={20} fontWeight="bold">
        {title}
      </Text>
      <AccountCircle />
    </HStack>
  );
}

interface PermissionRequestFooterArgs {
  canApprove?: boolean;
  onApprove: () => Promise<ApprovalResponseArgs>;
  // Whether to show the hardware wallet icon next to the button, in case of a non-local account
  requiresSigner?: boolean;
}

export function PermissionRequestFooter({
  canApprove = true,
  onApprove,
  requiresSigner = false,
}: PermissionRequestFooterArgs) {
  const { colorMode } = useColorMode();
  const {
    approvalRequest: { args, dappInfo },
    approve,
    isApproving,
    reject,
    setIsApproving,
  } = useApprovalRequestContext();
  const { trackEvent } = useAnalytics();
  const { activeAccount } = useActiveAccount();

  let signerIcon;
  if (activeAccount.type === 'ledger') {
    signerIcon = <GiUsbKey />;
  } else if (activeAccount.type === 'keystone') {
    signerIcon = <Icon as={QRIcon} boxSize="14px" />;
  }

  /**
   * Utility function for sending a permission approval tracking event
   * @param permissionType the permission type
   * @param success whether the approval was successful
   */
  function trackApprovalEvent(
    permissionType: ApprovalRequestType,
    success: boolean,
  ) {
    const eventType = success
      ? successTrackingEventTypeMap[permissionType]
      : errorTrackingEventTypeMap[permissionType];
    trackEvent({
      eventType,
      params: {
        ...dappInfo,
      },
    });
  }

  const onApprovePressed = async (event: React.MouseEvent) => {
    event?.preventDefault();
    setIsApproving(true);
    try {
      const approvalArgs = await onApprove();
      await approve(approvalArgs);
    } catch (err) {
      if (isKeystoneSignatureCancel(err)) {
        return;
      }
      trackApprovalEvent(args.type, false);
      throw err;
    } finally {
      setIsApproving(false);
    }

    trackApprovalEvent(args.type, true);
    window.close();
  };

  const onCancelPressed = async (event: React.MouseEvent) => {
    event?.preventDefault();
    await reject();
    window.close();
  };

  return (
    <HStack
      height="75px"
      minHeight="75px"
      bgColor={permissionRequestLayoutBgColor[colorMode]}
      px="24px"
      spacing="8px"
      borderTopColor={secondaryBorderColor[colorMode]}
      borderTopWidth="1px"
    >
      <FooterButton w="50%" variant="outline" onClick={onCancelPressed}>
        <FormattedMessage defaultMessage="Cancel" />
      </FooterButton>
      <FooterButton
        w="50%"
        colorScheme="salmon"
        isDisabled={!canApprove}
        isLoading={isApproving}
        onClick={onApprovePressed}
        rightIcon={requiresSigner ? signerIcon : undefined}
      >
        <FormattedMessage defaultMessage="Approve" />
      </FooterButton>
    </HStack>
  );
}

export function PermissionRequestBody({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();

  return (
    <Box
      flexGrow={1}
      overflowY="scroll"
      css={hiddenScrollbarCss}
      bgColor={permissionRequestBgColor[colorMode]}
    >
      <VStack
        width="100%"
        p="21px"
        spacing="16px"
        alignItems="stretch"
        flexGrow={1}
      >
        <DappInfoTile />
        {children}
      </VStack>
    </Box>
  );
}

export function PermissionRequestFullBody({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();

  return (
    <Box
      flexGrow={1}
      overflowY="scroll"
      css={hiddenScrollbarCss}
      bgColor={permissionRequestTileBgColor[colorMode]}
    >
      <VStack
        width="100%"
        minHeight="100%"
        p="21px"
        spacing="16px"
        alignItems="stretch"
        justifyContent="center"
        flexGrow={1}
      >
        {children}
      </VStack>
    </Box>
  );
}

export interface PermissionPromptLayoutProps {
  children: JSX.Element | JSX.Element[];
  title: JSX.Element;
}

export function PermissionRequestLayout({
  children,
  title,
}: PermissionPromptLayoutProps) {
  return (
    <VStack h="100%" w="100%" spacing={0} alignItems="stretch">
      <PermissionRequestHeader title={title} />
      {children}
    </VStack>
  );
}

export default PermissionRequestLayout;
