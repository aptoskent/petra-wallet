// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from '@chakra-ui/react';

type ConfirmationModalProps = Omit<ModalProps, 'children'> & {
  onConfirm: () => void;
};

export default function ResetPasswordConfirmationModal(
  props: ConfirmationModalProps,
) {
  const { onClose, onConfirm } = props;

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <FormattedMessage defaultMessage="Are you sure you want to reset the password?" />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm">
            <FormattedMessage defaultMessage="PLEASE NOTE: You will not be able to recover your wallet account unless you have stored the private key or mnemonic associated with your wallet address." />
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onConfirm}>
            <FormattedMessage defaultMessage="Yes, I understand" />
          </Button>
          <Button onClick={onClose}>
            <FormattedMessage defaultMessage="Close" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
