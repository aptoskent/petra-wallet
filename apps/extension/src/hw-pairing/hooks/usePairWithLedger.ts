// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import Transport from '@ledgerhq/hw-transport';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble';
import { AxiosError } from 'axios';
import { createContext, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';

import Aptos from 'core/ledger';
import SpeculosHttpTransport from 'core/utils/hw-transport-node-speculos-http';
import { LedgerTransport } from '@petra/core/types';

const isProductionEnv = process.env.NODE_ENV === 'production';
const speculosEndpoint = isProductionEnv
  ? 'http://localhost:5000'
  : '/speculos';

async function pairHidDevice() {
  try {
    return await TransportWebHID.request();
  } catch (err) {
    const isUserCancelled =
      err instanceof Error &&
      err.name === 'TypeError' &&
      err.message.includes('Cannot read properties of undefined');
    if (isUserCancelled) {
      return undefined;
    }
    throw err;
  }
}

async function pairBluetoothDevice() {
  try {
    return await TransportWebBLE.create();
  } catch (err) {
    if (err instanceof Error && err.name === 'TransportOpenUserCancelled') {
      return undefined;
    }
    throw err;
  }
}

async function pairSpeculosDevice() {
  try {
    return await SpeculosHttpTransport.open({ baseURL: speculosEndpoint });
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error('Could not connect to speculos');
    }
    throw err;
  }
}

export default function usePairWithLedger() {
  const transportType = useRef<LedgerTransport>();
  const [ledgerClient, setLedgerClient] = useState<Aptos>();
  const queryClient = useQueryClient();

  async function pairDevice(newTransportType: LedgerTransport) {
    if (ledgerClient !== undefined) {
      await ledgerClient.transport.close();
      setLedgerClient(undefined);
      transportType.current = undefined;
    }

    let transport: Transport | undefined;
    if (newTransportType === 'hid') {
      transport = await pairHidDevice();
    } else if (newTransportType === 'ble') {
      transport = await pairBluetoothDevice();
    } else if (newTransportType === 'speculos') {
      transport = await pairSpeculosDevice();
    } else {
      throw new Error('Invalid transport type');
    }

    if (transport !== undefined) {
      await queryClient.removeQueries(['ledger']);
      setLedgerClient(new Aptos(transport));
      transportType.current = newTransportType;
    }

    return transport !== undefined;
  }

  return {
    ledgerClient,
    pairDevice,
  };
}

type UsePairWithLedgerReturn = ReturnType<typeof usePairWithLedger>;

export const PairWithLedgerContext = createContext<UsePairWithLedgerReturn>({
  ledgerClient: undefined,
  pairDevice: async () => false,
});
PairWithLedgerContext.displayName = 'PairWithLedgerContext';
