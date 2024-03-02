// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { LegacyRef, MouseEventHandler } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { Account } from '@petra/core/types';
import AvatarImage from 'core/AvatarImage';
import { KeystoneLogoCircleFill } from 'modules/keystone';

interface AccountCircleProps {
  account?: Account;
  onClick?: MouseEventHandler<HTMLDivElement>;
  size?: number;
}

const AccountCircle = React.forwardRef(
  (
    { account, onClick, size = 32 }: AccountCircleProps,
    ref: LegacyRef<HTMLImageElement>,
  ) => {
    const { activeAccount, activeAccountAddress } = useActiveAccount();
    const address = account?.address || activeAccountAddress;
    const type = account ? account.type : activeAccount.type;
    return (
      <Box borderRadius="2rem" cursor="pointer" onClick={onClick} ref={ref}>
        {type === 'keystone' ? (
          <Icon as={KeystoneLogoCircleFill} boxSize={`${size}px`} />
        ) : (
          <AvatarImage size={size} address={address ?? ''} variant="sunset" />
        )}
      </Box>
    );
  },
);

export default AccountCircle;
