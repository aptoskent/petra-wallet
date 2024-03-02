// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack, Button, useColorMode, Box, Grid } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useUnlockedAccounts } from '@petra/core/hooks/useAccounts';
import { Routes } from 'core/routes';
import { Account } from '@petra/core/types';
import {
  buttonBorderColor,
  secondaryBgColor,
  secondaryBorderColor,
} from '@petra/core/colors';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import AccountView from './AccountView';

export const boxShadow = 'rgba(0, 0, 0, 0.05) 0px 4px 24px 0px';

const BodyDiv = styled(Box)`
  &::-webkit-scrollbar {
    display: none;
  }
`;

const bgColor = {
  dark: 'gray.700',
  light: 'white',
};

export default function SwitchAccountBody() {
  const { accounts } = useUnlockedAccounts();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const accountsList: Account[] = useMemo(
    () => Object.values(accounts),
    [accounts],
  );

  const handleClickAddAccount = () => {
    navigate(Routes.addAccount.path);
  };

  return (
    <Grid height="100%" width="100%" maxW="100%" templateRows="1fr 80px" pb={0}>
      <BodyDiv width="100%" height="100%" overflow="auto">
        <VStack pt={4} alignItems="stretch" height="100%" width="100%">
          <VStack gap={1} flex={1} pb={4}>
            {accountsList.map((account: Account) => (
              <Box zIndex={3} px={4} width="100%" key={account.address}>
                <AccountView
                  account={account}
                  bgColor={bgColor}
                  shouldSwitchOnClick
                />
              </Box>
            ))}
          </VStack>
        </VStack>
      </BodyDiv>
      <Box
        width="100%"
        borderTop="1px"
        p={4}
        borderColor={buttonBorderColor[colorMode]}
      >
        <Button
          onClick={handleClickAddAccount}
          width="100%"
          type="submit"
          borderColor={secondaryBorderColor[colorMode]}
          borderWidth="1px"
          size="lg"
          bgColor={secondaryBgColor[colorMode]}
        >
          <FormattedMessage defaultMessage="Add Account" />
        </Button>
      </Box>
    </Grid>
  );
}
