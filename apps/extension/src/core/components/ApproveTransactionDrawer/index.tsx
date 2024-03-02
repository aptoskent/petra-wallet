// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import {
  maxGasFeeFromEstimated,
  TransactionOptions,
} from '@petra/core/transactions';
import { customColors } from '@petra/core/colors';
import { TxnBuilderTypes } from 'aptos';
import { transparentize } from 'color2k';
import React, { useCallback, useRef, useState } from 'react';
import {
  isKeystoneSignatureCancel,
  useKeystoneRequestContext,
} from 'modules/keystone';
import { OnChainTransaction } from '@petra/core/types';
import useTransactions from '@petra/core/hooks/useTransactions';
import ErrorBody from './ErrorBody';
import KeystoneGenerateQRBody from './KeystoneGenerateQRBody';
import KeystoneScanQRBody from './KeystoneScanQRBody';
import LoadingBody from './LoadingBody';
import SuccessBody from './SuccessBody';
import TransactionDetailsBody from './TransactionDetailsBody';

export type ApproveTransactionDrawerProps = {
  approveDescription: JSX.Element;
  approveHeading: JSX.Element;
  errorMessage: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
  onSettled: () => void;
  payload: TxnBuilderTypes.TransactionPayloadEntryFunction;
  simulationQueryKey: string;
  successDescription: JSX.Element;
};

export default function ApproveTransactionDrawer({
  approveDescription,
  approveHeading,
  errorMessage,
  isOpen,
  onClose: parentOnClose,
  onSettled,
  payload,
  simulationQueryKey,
  successDescription,
}: ApproveTransactionDrawerProps) {
  const { cancelKeystoneRequest, keystoneStep } = useKeystoneRequestContext();
  const txnOptions = useRef<TransactionOptions>({});

  const { buildRawTransaction, signTransaction, submitTransaction } =
    useTransactions();

  const onSimulation = useCallback((data: OnChainTransaction) => {
    txnOptions.current.gasUnitPrice = data.gasUnitPrice;
    txnOptions.current.maxGasAmount = maxGasFeeFromEstimated(data.gasFee);
  }, []);

  const [txnHash, setTxnHash] = useState<string>();
  const [error, setError] = useState<Error>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onApprove = useCallback(async () => {
    try {
      const rawTxn = await buildRawTransaction(payload, txnOptions.current);
      const signedTxn = await signTransaction(rawTxn);
      setIsSubmitting(true);
      const { hash } = await submitTransaction(signedTxn);
      setTxnHash(hash);
    } catch (err) {
      if (!isKeystoneSignatureCancel(err)) {
        setError(err as Error);
      }
    } finally {
      setIsSubmitting(false);
      onSettled();
    }
  }, [
    buildRawTransaction,
    onSettled,
    payload,
    signTransaction,
    submitTransaction,
  ]);

  const onClose = useCallback(() => {
    setTxnHash(undefined);
    setError(undefined);
    if (keystoneStep !== undefined) {
      cancelKeystoneRequest();
    }
    parentOnClose();
  }, [cancelKeystoneRequest, keystoneStep, parentOnClose]);

  const isFullscreen =
    isSubmitting || error !== undefined || txnHash !== undefined;

  const renderBody = () => {
    if (isSubmitting) {
      return <LoadingBody />;
    }
    if (error !== undefined) {
      return (
        <ErrorBody
          error={error}
          errorMessage={errorMessage}
          onClose={onClose}
        />
      );
    }
    if (txnHash !== undefined) {
      return (
        <SuccessBody
          txnHash={txnHash}
          onClose={onClose}
          successDescription={successDescription}
        />
      );
    }
    return (
      <TransactionDetailsBody
        approveHeading={approveHeading}
        approveDescription={approveDescription}
        onSimulation={onSimulation}
        onCancel={onClose}
        onApprove={onApprove}
        payload={payload}
        simulationQueryKey={simulationQueryKey}
      />
    );
  };

  return (
    <Drawer
      size={isFullscreen ? 'full' : 'lg'}
      autoFocus
      isOpen={isOpen}
      closeOnOverlayClick
      closeOnEsc
      onClose={onClose}
      placement="bottom"
    >
      <DrawerOverlay
        bgColor={transparentize(customColors.navy[900], 0.5)}
        backdropFilter="blur(1rem)"
      />
      <DrawerContent borderTopRadius=".5rem">
        <DrawerCloseButton />
        <DrawerBody p={0}>
          {isOpen && keystoneStep === undefined ? renderBody() : null}
          {keystoneStep === 'generate' ? <KeystoneGenerateQRBody /> : null}
          {keystoneStep === 'scan' ? <KeystoneScanQRBody /> : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
