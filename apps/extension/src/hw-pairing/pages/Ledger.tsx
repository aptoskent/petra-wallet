// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { chakra } from '@chakra-ui/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import { createAccountFromLedger } from 'modules/accountCreation/hooks/useCreateAccount';
import { CreateAccountFromLedgerParams } from 'modules/accountCreation/types/createAccount';
import usePairWithLedger, {
  PairWithLedgerContext,
} from '../hooks/usePairWithLedger';
import FullscreenLayout from '../layouts/FullscreenLayout';

export default function Ledger() {
  const pairWithLedgerContext = usePairWithLedger();
  const navigate = useNavigate();
  const { addAccount } = useUnlockedAccounts();
  const formMethods = useForm<CreateAccountFromLedgerParams>({
    defaultValues: {
      transport: 'hid',
    },
    mode: 'onChange',
  });

  const { getValues, handleSubmit } = formMethods;
  async function onSubmit() {
    const formValues = getValues();
    const account = createAccountFromLedger(formValues);
    await addAccount(account);
    navigate('/ledger/paired');
  }

  return (
    <FullscreenLayout>
      <PairWithLedgerContext.Provider value={pairWithLedgerContext}>
        <chakra.form onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...formMethods}>
            <Outlet />
          </FormProvider>
        </chakra.form>
      </PairWithLedgerContext.Provider>
    </FullscreenLayout>
  );
}
