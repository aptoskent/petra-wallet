// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { formatCoin } from '@petra/core/utils/coin';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { simulationRefetchInterval } from '@petra/core/constants';
import {
  buttonBorderColor,
  customColors,
  textColorPrimary,
  textColorSecondary,
} from '@petra/core/colors';
import { useTransactionSimulation } from '@petra/core/queries/transaction';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { TransactionPayload } from '@petra/core/serialization';
import { OnChainTransaction } from '@petra/core/types';
import { GiUsbKey } from '@react-icons/all-files/gi/GiUsbKey';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { QRIcon } from 'modules/keystone';

interface TransactionDetailsBodyProps {
  approveDescription: JSX.Element;
  approveHeading: JSX.Element;
  onApprove: () => void;
  onCancel: () => void;
  onSimulation?: (data: OnChainTransaction) => void;
  payload: TransactionPayload;
  simulationQueryKey: string;
}

export default function TransactionDetailsBody({
  approveDescription,
  approveHeading,
  onApprove,
  onCancel,
  onSimulation,
  payload,
  simulationQueryKey,
}: TransactionDetailsBodyProps) {
  const { colorMode } = useColorMode();
  const { activeAccount, activeAccountAddress } = useActiveAccount();
  const { data: coinBalance } = useAccountOctaCoinBalance(
    activeAccountAddress,
    {
      refetchInterval: simulationRefetchInterval,
    },
  );
  const simulation = useTransactionSimulation(
    [simulationQueryKey, undefined, undefined, undefined, undefined],
    payload,
    {
      cacheTime: 0,
      enabled: coinBalance !== undefined,
      onSuccess: onSimulation,
      refetchInterval: simulationRefetchInterval,
    },
  );

  const gasFee = useMemo(() => {
    if (simulation && simulation.isSuccess) {
      return formatCoin(simulation.data.gasFee * simulation.data.gasUnitPrice, {
        decimals: 8,
      });
    }

    return (
      <FormattedMessage
        defaultMessage="Unable to estimate gas fee"
        description="Message to show when gas fee cannot be estimated with a simulation"
      />
    );
  }, [simulation]);

  let rightIcon;
  if (activeAccount.type === 'ledger') {
    rightIcon = <GiUsbKey />;
  } else if (activeAccount.type === 'keystone') {
    rightIcon = <Icon as={QRIcon} boxSize="14px" />;
  }

  return (
    <VStack justifyContent="flex-start" width="100%" height="100%" pt={4}>
      <VStack width="100%" height="100%" px={4} gap={2} flex={1}>
        <Heading fontSize="2xl">{approveHeading}</Heading>
        <Text width="100%" textAlign="center" as="div" fontSize="sm" px={8}>
          {approveDescription}
        </Text>
        <Flex width="100%" justifyContent="space-between">
          <Text fontSize="sm" color={textColorSecondary[colorMode]} as="div">
            <FormattedMessage defaultMessage="Gas Fees" />
          </Text>
          <Text
            fontWeight={700}
            fontSize="sm"
            color={textColorPrimary[colorMode]}
            as="div"
          >
            {simulation.isLoading ? <Spinner size="sm" as="span" /> : gasFee}
          </Text>
        </Flex>
        {simulation.error ? (
          <Text
            textAlign="left"
            width="100%"
            fontSize="sm"
            color={customColors.orange[600]}
          >
            <FormattedMessage
              defaultMessage="Error message: {error}"
              values={{ error: simulation.error?.message }}
            />
          </Text>
        ) : null}
      </VStack>
      <Box
        width="100%"
        borderTop="1px"
        py={4}
        borderColor={buttonBorderColor[colorMode]}
      >
        <HStack px={4} width="100%">
          <Button width="100%" height="48px" onClick={onCancel}>
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            width="100%"
            height="48px"
            bgColor="salmon.500"
            _hover={{
              bgColor: 'salmon.300',
            }}
            color="white"
            onClick={onApprove}
            isDisabled={simulation.isLoading || simulation.isError}
            rightIcon={rightIcon}
          >
            <FormattedMessage defaultMessage="Confirm" />
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
