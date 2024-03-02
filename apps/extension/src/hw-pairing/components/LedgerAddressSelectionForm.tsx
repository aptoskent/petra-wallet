// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import {
  Box,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { HexString } from 'aptos';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { secondaryBorderColor } from '@petra/core/colors';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { getAptosBip44Path } from '@petra/core/utils/account';
import { formatCoin } from '@petra/core/utils/coin';
import collapseHexString from '@petra/core/utils/hex';

import { CreateAccountFromLedgerParams } from 'modules/accountCreation/types';
import { makeRange } from 'modules/shared/utils';
import useLedgerAccountInfo from '../hooks/useLedgerAccountInfo';

interface LedgerAddressItemProps {
  hdPath: string;
}

function LedgerAddressItem({ hdPath }: LedgerAddressItemProps) {
  const accountInfo = useLedgerAccountInfo(hdPath);
  const { setValue } = useFormContext<CreateAccountFromLedgerParams>();
  const { accounts } = useUnlockedAccounts();

  function onChange() {
    if (accountInfo.data !== undefined) {
      const publicKey = HexString.fromBuffer(
        accountInfo.data.publicKey,
      ).toString();
      setValue('address', accountInfo.data.address);
      setValue('hdPath', hdPath);
      setValue('publicKey', publicKey);
    }
  }

  const isAlreadyImported =
    accountInfo.data?.address !== undefined
      ? Object.keys(accounts).some(
          (address) => address === accountInfo.data?.address,
        )
      : undefined;

  const balance = useAccountOctaCoinBalance(accountInfo.data?.address, {
    enabled: accountInfo.data?.address !== undefined,
    staleTime: 60000,
  });

  return (
    <HStack as="label" cursor="pointer" fontSize="md">
      <Radio
        isDisabled={accountInfo.isFetching || isAlreadyImported}
        onChange={() => onChange()}
        value={hdPath}
      />
      <Box flexGrow={1}>
        {accountInfo.data !== undefined ? (
          <Text>{collapseHexString(accountInfo.data.address)}</Text>
        ) : (
          <Spinner color="navy.500" size="sm" />
        )}
      </Box>
      {balance.isSuccess ? (
        <Text>{formatCoin(balance.data, { decimals: 5 })}</Text>
      ) : (
        <Spinner color="navy.500" size="sm" />
      )}
    </HStack>
  );
}

export default function LedgerAddressSelectionForm() {
  const { getValues, register } =
    useFormContext<CreateAccountFromLedgerParams>();
  const { colorMode } = useColorMode();
  const initialValue = getValues('hdPath');
  const intl = useIntl();

  return (
    <VStack alignItems="stretch" maxHeight="100%">
      <Text fontSize={14}>
        <FormattedMessage defaultMessage="Select a derivation path or an address from below" />
      </Text>
      <Input
        variant="filled"
        readOnly
        {...register('hdPath', { required: true })}
        placeholder={intl.formatMessage({ defaultMessage: 'No selected path' })}
      />
      <RadioGroup defaultValue={initialValue}>
        <VStack
          alignItems="stretch"
          p={2}
          border="1px"
          borderColor={secondaryBorderColor[colorMode]}
        >
          {makeRange(8).map((index) => (
            <LedgerAddressItem key={index} hdPath={getAptosBip44Path(index)} />
          ))}
        </VStack>
      </RadioGroup>
    </VStack>
  );
}
