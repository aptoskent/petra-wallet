// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { AddIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { secondaryTextColor } from '@petra/core/colors';
import { useCreateTokenAndCollection } from 'core/mutations/collectibles';
import { useAccountOctaCoinBalance } from '@petra/core/queries/account';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';

export default function CreateNFTModal() {
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { handleSubmit, register, watch } = useForm();
  const { activeAccountAddress } = useActiveAccount();
  const { data: coinBalance } = useAccountOctaCoinBalance(activeAccountAddress);
  const intl = useIntl();

  const collectionName: string | undefined = watch('collectionName');
  const tokenName: string | undefined = watch('tokenName');
  const description: string | undefined = watch('description');
  const supply = Number(watch('supply') || 1);
  const uri: string | undefined = watch('uri');

  const {
    error,
    isError,
    isLoading,
    mutateAsync: createTokenAndCollectionOnClick,
  } = useCreateTokenAndCollection();

  const errorMessage = error?.response?.data?.message;

  const onSubmit: SubmitHandler<Record<string, any>> = async (_data, event) => {
    event?.preventDefault();
    await createTokenAndCollectionOnClick({
      collectionName,
      description,
      name: tokenName,
      supply,
      uri,
    });
    onClose();
  };

  return (
    <>
      <Button
        size="xs"
        disabled={!coinBalance}
        onClick={onOpen}
        leftIcon={<AddIcon fontSize="xs" />}
      >
        <FormattedMessage defaultMessage="New" />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerHeader>
              <FormattedMessage defaultMessage="Create a collectible" />
            </DrawerHeader>
            <DrawerBody overflowY="auto" maxH="450px">
              <VStack>
                <FormControl isRequired>
                  <FormLabel
                    fontWeight={400}
                    color={secondaryTextColor[colorMode]}
                  >
                    <FormattedMessage defaultMessage="Collection name" />
                  </FormLabel>
                  <Input
                    {...register('collectionName')}
                    variant="filled"
                    required
                    maxLength={100}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel
                    fontWeight={400}
                    color={secondaryTextColor[colorMode]}
                  >
                    <FormattedMessage defaultMessage="Token name" />
                  </FormLabel>
                  <Input
                    {...register('tokenName')}
                    variant="filled"
                    required
                    maxLength={100}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel
                    fontWeight={400}
                    color={secondaryTextColor[colorMode]}
                  >
                    <FormattedMessage defaultMessage="Description" />
                  </FormLabel>
                  <Input
                    {...register('description')}
                    variant="filled"
                    required
                    maxLength={3000}
                    placeholder={intl.formatMessage({
                      defaultMessage: 'A description of your collection',
                    })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel
                    fontWeight={400}
                    color={secondaryTextColor[colorMode]}
                  >
                    <FormattedMessage defaultMessage="Supply" />
                  </FormLabel>
                  <Input
                    {...register('supply')}
                    variant="filled"
                    type="number"
                    min={1}
                    required
                    defaultValue={1}
                    max={1e9}
                  />
                </FormControl>
                <FormControl isRequired>
                  <Grid templateColumns="1fr 200px">
                    <Flex>
                      <FormLabel
                        fontWeight={400}
                        color={secondaryTextColor[colorMode]}
                      >
                        <FormattedMessage defaultMessage="Uri" />
                      </FormLabel>
                    </Flex>
                    <Flex justifyContent="flex-end">
                      <Button
                        fontSize="md"
                        fontWeight={400}
                        height="24px"
                        as="a"
                        target="_blank"
                        rightIcon={<ExternalLinkIcon />}
                        variant="unstyled"
                        cursor="pointer"
                        color={secondaryTextColor[colorMode]}
                        href="https://github.com/aptos-labs/aptos-core/blob/8b826d88b0f17255a753214ede48cbc44e484a97/ecosystem/web-wallet/src/core/types/TokenMetadata.ts"
                      >
                        <FormattedMessage defaultMessage="(Metadata structure)" />
                      </Button>
                    </Flex>
                  </Grid>
                  <Input
                    {...register('uri')}
                    variant="filled"
                    required
                    maxLength={300}
                    placeholder={intl.formatMessage({
                      defaultMessage: 'Arweave, IPFS, or S3 uri',
                    })}
                  />
                </FormControl>
                {isError ? (
                  <Text color="red.400" maxW="100%">
                    {errorMessage}
                  </Text>
                ) : undefined}
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <Button
                isLoading={isLoading}
                colorScheme="blue"
                mr={3}
                type="submit"
              >
                <FormattedMessage defaultMessage="Submit" />
              </Button>
              <Button variant="ghost" onClick={onClose}>
                <FormattedMessage defaultMessage="Close" />
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
