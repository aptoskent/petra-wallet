// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  createStandaloneToast,
} from '@chakra-ui/react';
import { collapseHexString } from '@petra/core/utils/hex';
import { customColors } from '@petra/core/colors';
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill';
import { AiFillCheckCircle } from '@react-icons/all-files/ai/AiFillCheckCircle';
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill';

import {
  DefaultNetworks,
  Network,
  OnChainTransaction,
} from '@petra/core/types';
import { formatCoin } from '@petra/core/utils/coin';
import { FormattedMessage } from 'react-intl';

const MIN_WIDTH = '365px';
const MAX_WIDTH = '365px';
const MIN_HEIGHT = '60px';

export const { toast } = createStandaloneToast({
  defaultOptions: {
    duration: 2000,
    isClosable: true,
    variant: 'solid',
  },
});

interface RenderSuccessToastProps {
  buttonLabel?: string;
  description?: string;
  onButtonClick?: () => void;
  onClose?: () => void;
  title: string;
}

const renderSuccessToast = ({
  buttonLabel,
  description,
  onButtonClick,
  onClose,
  title,
}: RenderSuccessToastProps) => (
  <Flex
    minWidth={MIN_WIDTH}
    minHeight={MIN_HEIGHT}
    maxWidth={MAX_WIDTH}
    width="100%"
    py={3}
    bgColor="green.800"
    position="relative"
  >
    <Flex width="100%">
      <Flex height="100%" width="64px">
        <Icon as={AiFillCheckCircle} color="white" w={8} h={8} mx="auto" />
      </Flex>
      <Flex flexDirection="column" width="100%" color="white" gap="4px">
        <Box fontWeight={700}>
          <Text fontSize="md">{title}</Text>
        </Box>
        {description && (
          <Box marginTop={1}>
            <Text fontSize="md">{description}</Text>
          </Box>
        )}
        {buttonLabel && (
          <Button
            marginTop={1}
            onClick={onButtonClick || onClose}
            bgColor="green.800"
            display="flex"
            justifyContent="flex-start"
            p={0}
            _hover={{
              bgColor: 'none',
            }}
            _active={{ bgColor: 'none' }}
            fontWeight={400}
            color="white"
          >
            <Text fontSize="md">{buttonLabel}</Text>
          </Button>
        )}
      </Flex>
      <Button
        position="absolute"
        top="4px"
        right="0px"
        maxWidth="10px"
        bgColor="green.800"
        _hover={{
          bgColor: 'none',
        }}
        color="white"
        _active={{ bgColor: 'green.900' }}
        onClick={onClose}
      >
        <Icon as={RiCloseFill} w={6} h={6} />
      </Button>
    </Flex>
  </Flex>
);

interface RenderErrorToastProps {
  buttonLabel?: string;
  description: string | React.ReactElement;
  onButtonClick?: () => void;
  onClose: () => void;
  title: string | React.ReactElement;
}

export const renderErrorToast = ({
  buttonLabel,
  description,
  onButtonClick,
  onClose,
  title,
}: RenderErrorToastProps) => (
  <Flex
    minWidth={MIN_WIDTH}
    minHeight={MIN_HEIGHT}
    maxWidth={MAX_WIDTH}
    width="100%"
    py={3}
    bgColor="orange.200"
    position="relative"
  >
    <Flex>
      <Flex minWidth="48px">
        <Icon
          as={RiErrorWarningFill}
          color={customColors.orange[600]}
          w={8}
          h={8}
          mx="auto"
        />
      </Flex>
      <Flex
        flexDirection="column"
        color={customColors.navy[900]}
        gap={0.2}
        paddingRight={2}
      >
        <Box fontWeight={700}>
          <Text fontSize="md">{title}</Text>
        </Box>
        {description && (
          <Box marginTop={1} flexWrap="wrap" maxWidth="280px">
            <Text fontSize="md">{description}</Text>
          </Box>
        )}
        {buttonLabel && (
          <Button
            marginTop={1}
            onClick={onButtonClick}
            bgColor="orange.200"
            display="flex"
            justifyContent="flex-start"
            p={0}
            colorScheme="orange"
            _hover={{
              bgColor: 'none',
            }}
            _active={{ bgColor: customColors.orange[50] }}
            fontWeight={400}
          >
            <Text fontSize="md">{buttonLabel}</Text>
          </Button>
        )}
      </Flex>
      <Button
        position="absolute"
        top="4px"
        right="0px"
        maxWidth="10px"
        bgColor="orange.200"
        colorScheme="orange"
        color="navy.900"
        _hover={{
          bgColor: 'none',
        }}
        _active={{ bgColor: 'orange.400' }}
        onClick={onClose}
      >
        <Icon as={RiCloseFill} w={6} h={6} />
      </Button>
    </Flex>
  </Flex>
);

// TODO(i18n): renderSuccessToast etc. should be react components
// (<SuccessToast> etc.) so that we can use FormattedMessages here. Not sure it
// will work otherwise.

// Add Account
export const createAccountToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: 'Successfully created new account',
        onClose,
        title: 'Created account',
      }),
  });
};

// Add Account
export const hideTokenToast = (tokenName: string, senderAddress: string) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: `Successfully hide token ${tokenName} from ${collapseHexString(
          senderAddress,
        )}`,
        onClose,
        title: 'Hide token',
      }),
  });
};

export const lockAccountToast = ({ address }: { address: string }) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: `Successfully lock account ${address}`,
        onClose,
        title: 'Locked account',
      }),
  });
};

export const rotateKeySuccessToast = ({ address }: { address: string }) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: `Successfully rotated key for account ${address}`,
        onClose,
        title: 'Rotate key successfully',
      }),
  });
};

export const rotateKeyErrorToast = ({ address }: { address: string }) => {
  toast({
    render: ({ onClose }) =>
      renderErrorToast({
        description: `Error rotating key for account ${address}`,
        onClose,
        title: 'Rotate key failed',
      }),
  });
};

export const offerTokenErrorToast = ({
  errorThrown,
  recipientAddress,
  tokenName,
}: {
  errorThrown: Error;
  recipientAddress: string;
  tokenName: string;
}) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: `Failed to offer token ${tokenName} to ${recipientAddress}. Error message ${errorThrown.message}`,
        onClose,
        title: 'Offer token failed',
      }),
  });
};

export const rotateKeySequenceNumberTooOldErrorToast = ({
  address,
}: {
  address: string;
}) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: `Failed to rotate key for account ${address}.
      The transaction's sequence_number must match the current sequence number in the sender's account.`,
        onClose,
        title: 'Rotate key failed',
      }),
  });
};

export const rotateKeyInsufficientBalanceErrorToast = ({
  address,
}: {
  address: string;
}) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: `Failed to rotate key for account ${address}. Insufficient balance.`,
        onClose,
        title: 'Rotate key failed',
      }),
  });
};

export const createAccountErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Error creating new account',
        onClose,
        title: 'Error creating account',
      }),
  });
};

export const importAccountToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: 'Successfully imported new account',
        onClose,
        title: 'Imported account',
      }),
  });
};

export const importAccountErrorToast = (description?: string) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: description ?? 'Error importing new account',
        onClose,
        title: 'Error importing account',
      }),
  });
};

export const registerCoinSimulationErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description:
          'Error running simulation when trying to register coin. Please try again',
        onClose,
        title: 'Error running simulation',
      }),
  });
};

export const importAccountNotFoundToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description:
          'Account does not exist on-chain (please note devnet is wiped every 2 weeks)',
        onClose,
        title: 'Error importing account',
      }),
  });
};

// Switch Account

export const switchAccountToast = (accountAddress: string) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: `Successfully switched account to ${accountAddress.substring(
          0,
          6,
        )}...`,
        onClose,
        title: 'Switched account',
      }),
  });
};

export const switchAccountErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Error during account switch',
        onClose,
        title: 'Error switch account',
      }),
  });
};

// Change Password

export const changePasswordNewPasswordNotMatchErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: "New password and confirmed new password don't match",
        onClose,
        title: 'Passsword do not match',
      }),
  });
};

export const changePasswordIncorrectCurrentPasswordErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Current password entered is incorrect',
        onClose,
        title: 'Incorrect current password',
      }),
  });
};

export const changePasswordSuccessfullyUpdatedToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: 'Password successfully updated to new password',
        onClose,
        title: 'Password updated',
      }),
  });
};

// NFT Offers & Claims

export const cancelTokenOferErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Unable to cancel token offer',
        onClose,
        title: 'Error canceling offer',
      }),
  });
};

export const acceptTokenOferErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Unable to claim token',
        onClose,
        title: 'Error claiming token',
      }),
  });
};

// Remove Account

export const removeAccountToast = (message: string) => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: message,
        onClose,
        title: 'Deleted account',
      }),
  });
};

export const removeAccountErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Account removal process incurred an error',
        onClose,
        title: 'Error removing account',
      }),
  });
};

export const addNetworkToast = (networkName?: string) => {
  const description = networkName
    ? `Switching to ${networkName}`
    : 'Staying on current network';
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description,
        onClose,
        title: 'Added network',
      }),
  });
};

export const switchNetworkToast = (
  networkName: string,
  isSwitching: boolean,
) => {
  const description = isSwitching
    ? `Switching to ${networkName}`
    : `Staying on ${networkName}`;
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description,
        onClose,
        title: 'Removed network',
      }),
  });
};

export const networkDoesNotExistToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Error: network not found',
        onClose,
        title: 'Error getting network',
      }),
  });
};

// transfer

export function coinTransferSuccessToast(
  amount: string,
  txn: OnChainTransaction,
) {
  const networkFee = formatCoin(txn.gasFee * txn.gasUnitPrice, { decimals: 8 });
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: `Amount transferred: ${amount}, gas consumed: ${networkFee}`,
        onClose,
        title: 'Transaction succeeded',
      }),
  });
}

export function coinTransferAbortToast(txn: OnChainTransaction) {
  const networkFee = formatCoin(txn.gasFee * txn.gasUnitPrice, { decimals: 8 });

  const abortReasonDescr =
    txn.error !== undefined ? txn.error.description : 'Transaction failed';
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: `${abortReasonDescr}, gas consumed: ${networkFee}`,
        onClose,
        title: 'Transaction failed',
      }),
  });
}

export function transactionErrorToast(err: unknown) {
  const errorMsg = err instanceof Error ? err.message : 'Unexpected error';
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: errorMsg,
        onClose,
        title: 'Transaction error',
      }),
  });
}

// faucet

export function faucetOnErrorToast(
  activeNetwork: Network,
  errorMessage: string | undefined,
) {
  if (activeNetwork.name === DefaultNetworks.Localhost) {
    const localhostMessage =
      activeNetwork.name === DefaultNetworks.Localhost
        ? 'If you are on localhost, please ensure that the faucet is running.'
        : undefined;
    toast({
      position: 'bottom',
      render: ({ onClose }) =>
        renderErrorToast({
          description: `Error accessing faucet at ${activeNetwork?.faucetUrl}. ${localhostMessage}`,
          onClose,
          title: 'Error calling faucet',
        }),
    });
  } else {
    toast({
      duration: 5000,
      position: 'bottom',
      render: ({ onClose }) =>
        renderErrorToast({
          description: errorMessage ?? 'Error calling faucet',
          onClose,
          title: 'Error calling faucet',
        }),
    });
  }
}

// buy

export function buyErrorToast() {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Please try again later',
        onClose,
        title: 'Error requesting url',
      }),
  });
}

// ledger verify

export const ledgerVerifyPendingToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: 'Verify address on your Ledger device',
        onClose,
        title: 'Verify on Ledger',
      }),
  });
};

export const ledgerVerifySuccessToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderSuccessToast({
        description: 'You successfully verified your address',
        onClose,
        title: 'Ledger Address Verified',
      }),
  });
};

export const ledgerVerifyErrorToast = () => {
  toast({
    position: 'bottom',
    render: ({ onClose }) =>
      renderErrorToast({
        description: 'Unable to verify address',
        onClose,
        title: 'Ledger Verify Failed',
      }),
  });
};

// coins swap
export const loadHippAggError = () => {
  toast({
    render: ({ onClose }) =>
      renderErrorToast({
        description: (
          <FormattedMessage
            defaultMessage="Error loading aggregator for coin swap. Please refresh and try again."
            description="error message body when aggregator failed to load for coin swap"
          />
        ),
        onClose,
        title: (
          <FormattedMessage
            defaultMessage="Error loading aggregator "
            description="error title when aggregator failed to load for coin swap"
          />
        ),
      }),
  });
};

export default toast;
