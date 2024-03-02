// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import {
  Icon,
  Grid,
  VStack,
  Center,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import {
  secondaryGridHoverBgColor,
  textColor,
  secondaryAddressFontColor,
} from '@petra/core/colors';
import WalletLayout from 'core/layouts/WalletLayout';
import { Routes } from 'core/routes';

export type SecurityPrivacyItem = {
  id: number;
  label: JSX.Element;
  path: string;
};

const securityPrivacyPaths = (): SecurityPrivacyItem[] => {
  const items: SecurityPrivacyItem[] = [
    {
      id: 1,
      label: <FormattedMessage defaultMessage="Change password" />,
      path: Routes.change_password.path,
    },
    {
      id: 2,
      label: <FormattedMessage defaultMessage="Auto-lock Timer" />,
      path: Routes.autolock_timer.path,
    },
    {
      id: 3,
      label: <FormattedMessage defaultMessage="Connected Apps" />,
      path: Routes.connected_apps.path,
    },
    {
      id: 4,
      label: <FormattedMessage defaultMessage="Receiving NFTs" />,
      path: Routes.receiving_nfts.path,
    },
  ];

  return items;
};

function SecurityPrivacy() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const handleItemClick = (item: SecurityPrivacyItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <WalletLayout
      title={<FormattedMessage defaultMessage="Security and Privacy" />}
      hasWalletFooter={false}
      showBackButton
    >
      <VStack width="100%" paddingTop={4} px={4} pb={4} spacing={2}>
        {securityPrivacyPaths().map((item: SecurityPrivacyItem) => (
          <Grid
            key={item.id}
            templateColumns="1fr 32px"
            p={4}
            width="100%"
            cursor="pointer"
            onClick={() => handleItemClick(item)}
            gap={2}
            borderRadius=".5rem"
            _hover={{
              bgColor: secondaryGridHoverBgColor[colorMode],
            }}
          >
            <Text color={textColor[colorMode]} fontWeight={600} fontSize="md">
              {item.label}
            </Text>
            <Center width="100%">
              <Icon
                fontSize="xl"
                borderColor={textColor[colorMode]}
                color={secondaryAddressFontColor[colorMode]}
                as={FiChevronRight}
              />
            </Center>
          </Grid>
        ))}
      </VStack>
    </WalletLayout>
  );
}

export default SecurityPrivacy;
