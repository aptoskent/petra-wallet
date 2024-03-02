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
import {
  KeystoneGenerateQR,
  useKeystoneRequestContext,
} from 'modules/keystone';
import {
  FooterButton,
  PermissionRequestFullBody,
  PermissionRequestLayout,
} from '../components/PermissionPromptLayout';

export default function KeystoneGenerate() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { cancelKeystoneRequest } = useKeystoneRequestContext();

  const onBack = () => {
    cancelKeystoneRequest();
    navigate(-1);
  };
  const onNext = () => navigate('/keystone-scan');

  return (
    <PermissionRequestLayout
      title={<FormattedMessage defaultMessage="Signature request" />}
    >
      <PermissionRequestFullBody>
        <KeystoneGenerateQR />
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
        <FooterButton w="50%" variant="outline" onClick={onBack}>
          <FormattedMessage defaultMessage="Back" description="Back button" />
        </FooterButton>
        <FooterButton w="50%" colorScheme="salmon" onClick={onNext}>
          <FormattedMessage
            defaultMessage="Get signature"
            description="Button for proceeding to the Keystone signature scan step"
          />
        </FooterButton>
      </HStack>
    </PermissionRequestLayout>
  );
}
