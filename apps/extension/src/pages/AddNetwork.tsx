// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Routes from 'core/routes';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useNetworks } from '@petra/core/hooks/useNetworks';
import { DefaultNetworks, defaultNetworks } from '@petra/core/types';
import { useNodeStatus } from '@petra/core/queries/network';
import useDebounce from '@petra/core/hooks/useDebounce';
import { addNetworkToast } from 'core/components/Toast';
import { buttonBorderColor } from '@petra/core/colors';
import WalletLayout from 'core/layouts/WalletLayout';

interface AddNetworkFormData {
  faucetUrl?: string;
  name: string;
  nodeUrl: string;
}

const requiredValidator = {
  required: 'This is required',
};

const urlValidator = {
  pattern: {
    message: 'Not a valid URL',
    value: /^(http|https):\/(\/([A-z\d-]+\.)*([A-z\d-]+))+(:\d+)?$/,
  },
};

const referenceNetwork = defaultNetworks[DefaultNetworks.Testnet];

function AddNetworkBody() {
  const { addNetwork, networks } = useNetworks();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    watch,
  } = useForm<AddNetworkFormData>({
    mode: 'onChange',
  });
  const intl = useIntl();

  // Make sure to check node status only when format is right
  const shouldCheckNodeStatus = errors.nodeUrl === undefined;
  const { debouncedValue: debouncedNodeUrl } = useDebounce(
    watch('nodeUrl'),
    300,
  );
  const { isLoading: isNodeStatusLoading, isNodeAvailable } = useNodeStatus(
    debouncedNodeUrl,
    {
      enabled: shouldCheckNodeStatus,
      refetchInterval: 5000,
    },
  );

  const nameValidators = {
    ...requiredValidator,
    maxLength: {
      message: intl.formatMessage({ defaultMessage: 'Name is too long' }),
      value: 30,
    },
    validate: {
      unique: (name: string) => !networks || !(name in networks),
    },
  };

  const nodeUrlValidators = {
    ...requiredValidator,
    ...urlValidator,
    validate: {
      unique: (nodeUrl: string) =>
        !networks ||
        !Object.values(networks).some((n) => n.nodeUrl === nodeUrl),
    },
  };

  const onSubmit: SubmitHandler<AddNetworkFormData> = async (
    { faucetUrl, name, nodeUrl },
    event,
  ) => {
    event?.preventDefault();
    const shouldSwitch = isNodeAvailable === true;
    const network = {
      faucetUrl: faucetUrl || undefined,
      name,
      nodeUrl,
    };

    await addNetwork(network, shouldSwitch);
    addNetworkToast(shouldSwitch ? network.name : undefined);
    navigate(Routes.wallet.path);
  };

  return (
    <Box
      as="form"
      overflowY="auto"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
    >
      <Box width="100%" height="100%" px={4}>
        <VStack spacing={4} pt={4}>
          <FormControl isRequired isInvalid={errors.name !== undefined}>
            <FormLabel>
              <FormattedMessage defaultMessage="Name" />
            </FormLabel>
            <Input
              placeholder={intl.formatMessage({
                defaultMessage: 'Custom network',
              })}
              height={12}
              errorBorderColor="orange.500"
              {...register('name', nameValidators)}
            />
            <FormErrorMessage color="orange.500">
              {errors.name?.type === 'unique' ? (
                <FormattedMessage defaultMessage="A network with this name already exists" />
              ) : (
                errors.name?.message
              )}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.nodeUrl !== undefined}>
            <FormLabel>Node URL</FormLabel>
            <Input
              height={12}
              placeholder={referenceNetwork.nodeUrl}
              errorBorderColor="orange.500"
              {...register('nodeUrl', nodeUrlValidators)}
            />
            <FormErrorMessage color="orange.500">
              {errors.nodeUrl?.type === 'unique' ? (
                <FormattedMessage defaultMessage="A network with this nodeUrl already exists" />
              ) : (
                errors.nodeUrl?.message
              )}
            </FormErrorMessage>
            {!errors.nodeUrl ? (
              <Box mt={2} fontSize="sm" lineHeight="normal">
                {isNodeStatusLoading ? <Spinner size="sm" /> : null}
                {isNodeAvailable === false ? (
                  <Text color="yellow.500">
                    <FormattedMessage defaultMessage="Node is not available" />
                  </Text>
                ) : null}
              </Box>
            ) : null}
          </FormControl>
          <FormControl isInvalid={errors.faucetUrl !== undefined}>
            <FormLabel>
              <FormattedMessage defaultMessage="Faucet URL (optional)" />
            </FormLabel>
            <Input
              height={12}
              placeholder={referenceNetwork.faucetUrl}
              errorBorderColor="orange.500"
              {...register('faucetUrl', { ...urlValidator })}
            />
            <FormErrorMessage color="orange.500">
              {errors.faucetUrl?.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>
      </Box>
      <Box
        width="100%"
        borderTop="1px"
        pt={4}
        px={4}
        borderColor={buttonBorderColor[colorMode]}
      >
        <Button
          colorScheme="salmon"
          height="48px"
          width="100%"
          type="submit"
          isDisabled={!isValid}
        >
          <FormattedMessage defaultMessage="Add Network" />
        </Button>
      </Box>
    </Box>
  );
}

export default function AddNetwork() {
  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Add Network" />}
      showBackButton
    >
      <AddNetworkBody />
    </WalletLayout>
  );
}
