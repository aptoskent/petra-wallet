// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { AiFillQuestionCircle } from '@react-icons/all-files/ai/AiFillQuestionCircle';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { BsShieldFill } from '@react-icons/all-files/bs/BsShieldFill';
import { FaLock } from '@react-icons/all-files/fa/FaLock';
import { MdWifiTethering } from '@react-icons/all-files/md/MdWifiTethering';
import { settingsItemLabel } from '@petra/core/constants';
import { Account } from '@petra/core/types';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import type { SettingsListItemProps } from 'core/components/SettingsListItem';
import Routes from 'core/routes';
import { useInitializedAccounts } from '@petra/core/hooks/useAccounts';

export interface UseSettingsPathsProps {
  account: Account;
}

export default function useSettingsPaths({ account }: UseSettingsPathsProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { lockAccounts } = useInitializedAccounts();
  const getExplorerAddress = useExplorerAddress();

  // TODO(i18n): Either add a new field for the translated title or translate
  // the existing field and add a new slug field (other code is currently
  // performing conditional logic based on the value of the title field, which
  // will break if it starts getting translated).

  return useMemo(() => {
    const items: SettingsListItemProps[][] = [
      [
        {
          iconAfter: FiChevronRight,
          iconBefore: MdWifiTethering,
          path: Routes.network.path,
          title: settingsItemLabel.NETWORK,
        },
        {
          iconAfter: FiChevronRight,
          iconBefore: BsShieldFill,
          path: Routes.security_privacy.path,
          title: 'Security and Privacy',
        },
        {
          iconBefore: colorMode === 'dark' ? SunIcon : MoonIcon,
          onClick: () => toggleColorMode(),
          path: null,
          title: colorMode === 'dark' ? 'Light mode' : 'Dark mode',
        },
      ],
      [
        {
          externalLink: 'https://discord.com/invite/petrawallet',
          iconBefore: AiFillQuestionCircle,
          path: null,
          title: settingsItemLabel.HELP_SUPPORT,
        },
        {
          iconBefore: FaLock,
          onClick: async () => {
            await lockAccounts();
          },
          path: Routes.wallet.path,
          title: settingsItemLabel.LOCK_WALLET,
        },
      ],
      [
        {
          iconAfter: FiChevronRight,
          path: Routes.manage_account.path,
          title: settingsItemLabel.MANAGE_ACCOUNT,
        },
        {
          externalLink: getExplorerAddress(`account/${account.address}`),
          iconAfter: FiChevronRight,
          path: null,
          title: settingsItemLabel.EXPLORER,
        },
        {
          iconAfter: FiChevronRight,
          path: Routes.switchAccount.path,
          title: settingsItemLabel.SWITCH_ACCOUNT,
        },
        {
          iconAfter: FiChevronRight,
          path: Routes.remove_account.path,
          textColorDict: {
            dark: 'red.400',
            light: 'red.400',
          },
          title: settingsItemLabel.REMOVE_ACCOUNT,
        },
      ],
    ];
    return items;
  }, [
    account.address,
    colorMode,
    getExplorerAddress,
    lockAccounts,
    toggleColorMode,
  ]);
}
