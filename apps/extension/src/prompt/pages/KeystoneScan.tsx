// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { HStack, useColorMode } from '@chakra-ui/react';
import {
  permissionRequestLayoutBgColor,
  secondaryBorderColor,
} from '@petra/core/colors';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { KeystoneScanQR } from 'modules/keystone';
import {
  FooterButton,
  PermissionRequestFullBody,
  PermissionRequestLayout,
} from '../components/PermissionPromptLayout';

export default function KeystoneScan() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const onBack = () => navigate(-1);
  const onDone = () => navigate(-2);

  return (
    <PermissionRequestLayout
      title={<FormattedMessage defaultMessage="Signature request" />}
    >
      <PermissionRequestFullBody>
        <KeystoneScanQR onDone={onDone} />
      </PermissionRequestFullBody>
      <HStack
        height="75px"
        minHeight="75px"
        bgColor={permissionRequestLayoutBgColor[colorMode]}
        px="24px"
        spacing="8px"
        borderTopColor={secondaryBorderColor[colorMode]}
        borderTopWidth="1px"
      >
        <FooterButton w="100%" variant="outline" onClick={onBack}>
          <FormattedMessage
            defaultMessage="Back to QR code"
            description="Button for going back to the keystone signature request step"
          />
        </FooterButton>
      </HStack>
    </PermissionRequestLayout>
  );
}
