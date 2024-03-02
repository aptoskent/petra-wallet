// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Account_Transactions_Bool_Exp,
  Coin_Activities_Bool_Exp,
  Token_Activities_Bool_Exp,
  UseActivityConfig,
} from '@petra/core/activity';
import FiltersModalBody, {
  FilterModalOption,
} from 'core/components/BottomModalBody/FiltersModalBody';
import BottomSheetModalContent from 'core/components/BottomSheetModalContent';
import { usePrompt } from 'core/providers/PromptProvider';
import React, { useCallback, useMemo, useState } from 'react';
import { i18nmock } from 'strings';

type ActivityFilters = {
  coin_activities_where?: Coin_Activities_Bool_Exp;
  token_activities_where?: Token_Activities_Bool_Exp;
  where?: Account_Transactions_Bool_Exp;
};

const COIN_TRANSACTION_FILTER: ActivityFilters = {
  // Include all coin activities
  coin_activities_where: { activity_type: { _is_null: false } },
  // Exclude all token activities
  token_activities_where: { transfer_type: { _is_null: true } },
  // Has at least one coin activity
  where: {
    coin_activities: {
      activity_type: { _neq: '0x1::aptos_coin::GasFeeEvent' },
    },
  },
};

const NFT_TRANSACTION_FILTER: ActivityFilters = {
  // Exclude all coin activities except for gas
  coin_activities_where: {
    activity_type: { _eq: '0x1::aptos_coin::GasFeeEvent' },
  },
  // Include all token activities
  token_activities_where: { transfer_type: { _is_null: false } },
  // Has at least one token activity
  where: { token_activities: { transfer_type: { _is_null: false } } },
};

const NETWORK_FEE_FILTER: ActivityFilters = {
  // Include gas activities
  coin_activities_where: {
    activity_type: { _eq: '0x1::aptos_coin::GasFeeEvent' },
  },
  // Has no coin activities (other than gas) or token activities
  where: {
    _not: {
      _or: [COIN_TRANSACTION_FILTER.where!, NFT_TRANSACTION_FILTER.where!],
    },
  },
};

const useActivityFilters = () => {
  const { showPrompt } = usePrompt();
  const [selectedFilters, setSelectedFilters] = useState<
    FilterModalOption<ActivityFilters>[]
  >([]);

  const handleOnFilterPress = useCallback(() => {
    const filterOptions = [
      {
        label: 'Coin Transactions',
        value: COIN_TRANSACTION_FILTER,
      },
      {
        label: 'NFT Transactions',
        value: NFT_TRANSACTION_FILTER,
      },
      {
        label: 'Network Fees',
        value: NETWORK_FEE_FILTER,
      },
    ];

    showPrompt(
      <BottomSheetModalContent
        title={i18nmock('general:filters.modalTitle')}
        body={
          <FiltersModalBody<ActivityFilters>
            options={filterOptions.map((option, i) => ({
              ...option,
              checked: selectedFilters.some(
                (selectedFilter) => selectedFilter.label === option.label,
              ),
              id: i,
            }))}
            onApply={(options) =>
              setSelectedFilters(options.filter((option) => option.checked))
            }
          />
        }
      />,
    );
  }, [selectedFilters, showPrompt]);

  const activityFilters = useMemo<UseActivityConfig | undefined>(
    () =>
      selectedFilters.length
        ? ({
            coin_activities_where: {
              _or: selectedFilters
                .map((e) => e.value?.coin_activities_where)
                .filter(Boolean) as Coin_Activities_Bool_Exp[],
            },
            token_activities_where: {
              _or: selectedFilters
                .map((e) => e.value?.token_activities_where)
                .filter(Boolean) as Token_Activities_Bool_Exp[],
            },
            where: {
              _or: selectedFilters
                .map((e) => e.value?.where)
                .filter(Boolean) as Account_Transactions_Bool_Exp[],
            },
          } satisfies UseActivityConfig)
        : undefined,
    [selectedFilters],
  );

  return {
    activityFilters,
    handleOnFilterPress,
    selectedFilters,
  };
};

export default useActivityFilters;
