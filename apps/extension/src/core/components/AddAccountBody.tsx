// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Button, Icon, Text, useColorMode, VStack } from '@chakra-ui/react';
import { secondaryBgColor } from '@petra/core/colors';
import { useFlag } from '@petra/core/flags';
import { AiFillPlusSquare } from '@react-icons/all-files/ai/AiFillPlusSquare';
import { BiKey } from '@react-icons/all-files/bi/BiKey';
import { BsLayoutTextSidebar } from '@react-icons/all-files/bs/BsLayoutTextSidebar';
import { GiUsbKey } from '@react-icons/all-files/gi/GiUsbKey';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { useImportOnboardingState } from 'core/hooks/useImportOnboardingState';
import {
  CreateWalletViaImportFormValues,
  ImportOnboardingPage,
} from 'core/layouts/CreateWalletViaImportLayout';
import Routes from 'core/routes';
import { KeystoneLogoFill } from 'modules/keystone';

interface AddAccountBodyProps {
  px?: number;
}

const logoColor = {
  dark: 'salmon.600',
  light: 'salmon.500',
};

export default function AddAccountBody({ px = 4 }: AddAccountBodyProps) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const isKeystoneSupportEnabled = useFlag('keystone-support');

  async function openExternalUrl(url: string) {
    if (chrome?.tabs !== undefined) {
      const { id: extensionId } = chrome.runtime;
      const tabs = await chrome.tabs.query({});
      const existingTab = tabs.find((tab) => {
        const tabUrl = tab.url ? new URL(tab.url) : undefined;
        return tabUrl?.hostname === extensionId && tabUrl?.pathname === url;
      });

      if (existingTab?.id != null) {
        await chrome.tabs.update(existingTab.id, { active: true });
      } else {
        await chrome.tabs.create({ url });
      }
    } else {
      window.open(url, '_blank');
    }
  }

  return (
    <VStack px={px} spacing={4} width="100%" pt={4}>
      <Button
        onClick={() => navigate(Routes.createAccount.path)}
        width="100%"
        height={16}
        justifyContent="flex-start"
        leftIcon={
          <Icon
            as={AiFillPlusSquare}
            color="salmon.500"
            w={6}
            h={6}
            marginRight={4}
          />
        }
        bgColor={secondaryBgColor[colorMode]}
        border="1px"
        borderColor="navy.300"
        fontWeight={700}
      >
        <FormattedMessage defaultMessage="Create new account" />
      </Button>
      <Button
        onClick={() => navigate(Routes.importWalletPrivateKey.path)}
        width="100%"
        height={16}
        leftIcon={
          <Icon as={BiKey} color="salmon.500" w={6} h={6} marginRight={4} />
        }
        justifyContent="flex-start"
        bgColor={secondaryBgColor[colorMode]}
        border="1px"
        borderColor="navy.300"
        fontWeight={700}
      >
        <FormattedMessage defaultMessage="Import private key" />
      </Button>
      <Button
        onClick={() => navigate(Routes.importWalletMnemonic.path)}
        width="100%"
        height={16}
        leftIcon={
          <Icon
            as={BsLayoutTextSidebar}
            color="salmon.500"
            w={6}
            h={6}
            marginRight={4}
          />
        }
        justifyContent="flex-start"
        bgColor={secondaryBgColor[colorMode]}
        border="1px"
        borderColor="navy.300"
        fontWeight={700}
      >
        <FormattedMessage defaultMessage="Import mnemonic" />
      </Button>
      <Button
        onClick={() => openExternalUrl('/hw-pairing.html?ledger')}
        width="100%"
        height={16}
        leftIcon={
          <Icon as={GiUsbKey} color="salmon.500" w={6} h={6} marginRight={4} />
        }
        justifyContent="flex-start"
        bgColor={secondaryBgColor[colorMode]}
        border="1px"
        borderColor="navy.300"
        fontWeight={700}
      >
        <FormattedMessage defaultMessage="Import from Ledger" />
      </Button>
      {isKeystoneSupportEnabled ? (
        <Button
          onClick={() => openExternalUrl('/hw-pairing.html?keystone')}
          width="100%"
          height={16}
          leftIcon={
            <Icon
              as={KeystoneLogoFill}
              color="salmon.500"
              w={6}
              h={6}
              marginRight={4}
            />
          }
          justifyContent="flex-start"
          bgColor={secondaryBgColor[colorMode]}
          border="1px"
          borderColor="navy.300"
          fontWeight={700}
        >
          <FormattedMessage defaultMessage="Import from Keystone" />
        </Button>
      ) : null}
    </VStack>
  );
}

export function NoWalletAddAccountBody({ px = 4 }: AddAccountBodyProps) {
  const { setValue } = useFormContext<CreateWalletViaImportFormValues>();
  const { colorMode } = useColorMode();

  const { setActiveStep } = useImportOnboardingState();

  const importPrivateKeyOnClick = () => {
    setValue('importType', 'privateKey');
    setActiveStep(ImportOnboardingPage.ImportPrivateKey);
  };

  const importMnemonicOnClick = () => {
    setValue('importType', 'mnemonic');
    setActiveStep(ImportOnboardingPage.ImportMnemonic);
  };

  return (
    <VStack
      px={px}
      spacing={4}
      width="100%"
      pt={4}
      alignContent="center"
      height="100%"
      justifyContent="center"
    >
      <Button
        width="100%"
        height={20}
        leftIcon={
          <Icon
            as={BiKey}
            w={7}
            h={7}
            marginRight={4}
            color={logoColor[colorMode]}
          />
        }
        justifyContent="flex-start"
        border="1px"
        fontWeight={700}
        borderColor="navy.300"
        onClick={importPrivateKeyOnClick}
      >
        <Text fontSize={18}>
          <FormattedMessage defaultMessage="Import private key" />
        </Text>
      </Button>
      <Button
        width="100%"
        height={20}
        leftIcon={
          <Icon
            as={BsLayoutTextSidebar}
            w={7}
            h={7}
            marginRight={4}
            color={logoColor[colorMode]}
          />
        }
        border="1px"
        borderColor="navy.300"
        fontWeight={700}
        justifyContent="flex-start"
        onClick={importMnemonicOnClick}
      >
        <Text fontSize={18}>
          <FormattedMessage defaultMessage="Import mnemonic" />
        </Text>
      </Button>
    </VStack>
  );
}
