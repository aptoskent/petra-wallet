// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { Button, Text, VStack } from '@chakra-ui/react';
import { GiUsbKey } from '@react-icons/all-files/gi/GiUsbKey';
import { MdComputer } from '@react-icons/all-files/md/MdComputer';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { LedgerTransport } from '@petra/core/types';
import { CreateAccountFromLedgerParams } from 'modules/accountCreation/types';

type LedgerTransportSelectionItemProps = {
  icon: ReactElement;
  label: JSX.Element;
  value: LedgerTransport;
};

export default function LedgerTransportSelectionForm() {
  const { setValue, watch } = useFormContext<CreateAccountFromLedgerParams>();
  const transport = watch('transport');

  const transportOptions: LedgerTransportSelectionItemProps[] = [
    {
      icon: <GiUsbKey />,
      label: <FormattedMessage defaultMessage="HID" />,
      value: 'hid',
    },
    {
      icon: <MdComputer />,
      label: <FormattedMessage defaultMessage="Speculos" />,
      value: 'speculos',
    },
    /* {
    icon: <FaBluetooth />,
    label: <FormattedMessage defaultMessage="Bluetooth" />,
    value: 'ble',
  }, */
  ];

  return (
    <VStack alignItems="stretch">
      <Text fontSize="md" mb={4}>
        <FormattedMessage defaultMessage="Select the transport type for your Ledger device." />
      </Text>
      {transportOptions.map(({ icon, label, value }) => (
        <Button
          key={value}
          onClick={() => setValue('transport', value)}
          height={14}
          leftIcon={icon}
          isActive={transport === value}
        >
          {label}
        </Button>
      ))}
    </VStack>
  );
}
