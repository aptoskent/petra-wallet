// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { HIT_SLOPS, PADDING } from 'shared/constants';
import { I18nKey, i18nmock } from 'strings';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import Typography from 'core/components/Typography';
import { RadioEmptyIcon, RadioFilledIcon } from 'shared/assets/svgs';
import Cluster from 'core/components/Layouts/Cluster';
import { useFlag } from '@petra/core/flags';
import { StakingRow } from '../Components/StakingRow';
import { StakingLabel, StakingLabelProps } from '../Components/StakingLabel';

export enum SortOption {
  projected,
  staked,
  commission,
  lifetimeRewards,
  numDelegators,
}

const SortOptions: { title: I18nKey; value: SortOption }[] = [
  {
    title: 'stake:selectPool.sortSheet.projected',
    value: SortOption.projected,
  },
  {
    title: 'stake:selectPool.sortSheet.stakedAmount',
    value: SortOption.staked,
  },
  {
    title: 'stake:selectPool.sortSheet.commission',
    value: SortOption.commission,
  },
  {
    title: 'stake:selectPool.sortSheet.lifetimeRewards',
    value: SortOption.lifetimeRewards,
  },
  {
    title: 'stake:selectPool.sortSheet.numDelegators',
    value: SortOption.numDelegators,
  },
];

interface RadioButtonProps<T> {
  onPress(value: T): void;
  selected: boolean;
  style?: StyleProp<ViewStyle>;
  title: StakingLabelProps['title'];
  value: T;
}

function RadioButton<T>({
  onPress,
  selected,
  style,
  title,
  value,
}: RadioButtonProps<T>) {
  const handleOnPress = useCallback(() => {
    onPress(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <TouchableOpacity
      hitSlop={HIT_SLOPS.midSlop}
      onPress={handleOnPress}
      style={style}
    >
      <StakingRow>
        <StakingLabel titleColor="muted" title={title} />
        {selected ? <RadioFilledIcon /> : <RadioEmptyIcon />}
      </StakingRow>
    </TouchableOpacity>
  );
}

interface SortPoolsSheetContentProps {
  inactiveValidators: boolean;
  onSort: (sortValue: SortOption) => void;
  sort: SortOption;
  toggleInactiveValidators: () => void;
}

export default function SortPoolsSheetContent({
  inactiveValidators,
  onSort,
  sort,
  toggleInactiveValidators,
}: SortPoolsSheetContentProps): JSX.Element {
  const [internalSort, setInternalSort] = useState<SortOption>(sort);
  const isDisabledValidatorsEnabled = useFlag('inactive-validators');

  return (
    <View
      style={{
        paddingHorizontal: PADDING.container,
        paddingTop: PADDING.container,
      }}
    >
      <Typography
        variant="subheading"
        align="center"
        style={{ marginBottom: 8 }}
      >
        {i18nmock('stake:selectPool.sortSheet.title')}
      </Typography>

      {SortOptions.map(({ title, value }) => (
        <RadioButton
          onPress={setInternalSort}
          selected={internalSort === value}
          title={title}
          value={value}
          style={{ marginTop: 24 }}
        />
      ))}

      <Cluster space={8} noWrap style={{ marginTop: 32 }}>
        {isDisabledValidatorsEnabled ? (
          <PetraPillButton
            containerStyleOverride={{ flex: 1 }}
            buttonDesign={PillButtonDesign.clearWithDarkText}
            text={
              inactiveValidators
                ? i18nmock('stake:selectPool.sortSheet.disableInactive')
                : i18nmock('stake:selectPool.sortSheet.enableInactive')
            }
            onPress={toggleInactiveValidators}
          />
        ) : null}

        <PetraPillButton
          containerStyleOverride={{ flex: 1 }}
          buttonDesign={PillButtonDesign.default}
          text={i18nmock('stake:selectPool.sortSheet.sort')}
          onPress={() => {
            onSort(internalSort);
          }}
        />
      </Cluster>
    </View>
  );
}
