// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { generateMnemonic } from '@petra/core/utils/account';
import React, { useMemo, useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import CreateAccountBody from 'core/components/CreateAccountBody';
import OnboardingConfirmationPopup from 'core/components/OnboardingConfirmationPopup';
import useCreateAccount from 'core/hooks/useCreateAccount';
import { CreateAccountLayout } from 'core/layouts/AddAccountLayout';
import Routes from 'core/routes';

const transitionDuration = 200;

function CreateAccount() {
  const navigate = useNavigate();
  const { createAccount } = useCreateAccount({});
  const newMnemonic = useMemo(() => generateMnemonic(), []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ref = useRef();
  const [showSecretRecoveryPhrasePopup, setShowSecretRecoveryPhrasePopup] =
    useState<boolean>(false);

  const onSubmit = async () => {
    setShowSecretRecoveryPhrasePopup(true);
  };

  const initAccount = async (mnemonic: string) => {
    setIsLoading(true);
    await createAccount(mnemonic);
    setIsLoading(false);
  };

  return (
    <CreateAccountLayout
      headerValue={<FormattedMessage defaultMessage="Create account" />}
      backPage={Routes.addAccount.path}
      defaultValues={{
        mnemonic: newMnemonic.split(' '),
        mnemonicString: newMnemonic,
      }}
      onSubmit={onSubmit}
    >
      <CreateAccountBody isLoading={isLoading} mnemonic={newMnemonic} />
      <Transition
        in={showSecretRecoveryPhrasePopup}
        timeout={transitionDuration}
        nodeRef={ref}
      >
        {(state: TransitionStatus) => (
          <OnboardingConfirmationPopup
            isOpen={showSecretRecoveryPhrasePopup}
            primaryBttnOnClick={async () => {
              await initAccount(newMnemonic);
              navigate(Routes.welcome.path);
            }}
            secondaryBttnOnClick={() => {
              setShowSecretRecoveryPhrasePopup(false);
            }}
            state={state}
            isLoading={isLoading}
          />
        )}
      </Transition>
    </CreateAccountLayout>
  );
}

export default CreateAccount;
