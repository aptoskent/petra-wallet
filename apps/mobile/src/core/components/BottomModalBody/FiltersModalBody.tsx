// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { usePrompt } from 'core/providers/PromptProvider';
import makeStyles from 'core/utils/makeStyles';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { i18nmock } from 'strings';
import PetraCheckBox from '../PetraCheckBox';
import PetraPillButton from '../PetraPillButton';
import Typography from '../Typography';

export interface FilterModalOption<T> {
  checked?: boolean;
  id: any;
  label: string;
  value?: T;
}

interface FiltersModalBodyProps<T> {
  onApply?: (options: FilterModalOption<T>[]) => void;
  options: FilterModalOption<T>[];
}

function FiltersModalBody<T>({
  onApply,
  options: opts,
}: FiltersModalBodyProps<T>): JSX.Element {
  const [options, setOptions] = useState(opts);
  const { setPromptVisible } = usePrompt();

  const styles = useStyles();

  const handleOnToggleCheck = (id: any) => {
    setOptions(
      options.map((option) => ({
        ...option,
        checked: option.id === id ? !option.checked : option.checked,
      })),
    );
  };

  const handleOnApply = () => {
    onApply?.(options);
    setPromptVisible(false);
  };

  return (
    <View style={styles.bottomSheetContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          onPress={() => handleOnToggleCheck(option.id)}
          containerStyle={styles.optionContainer}
          style={styles.optionContent}
        >
          <Typography weight="600" variant="body">
            {option.label}
          </Typography>
          <PetraCheckBox checked={option.checked ?? false} />
        </TouchableOpacity>
      ))}
      <PetraPillButton
        text={i18nmock('general:filters.primaryButtonLabel')}
        containerStyleOverride={styles.primaryButtonContainerStyle}
        onPress={handleOnApply}
        buttonStyleOverride={styles.primaryButtonStyle}
      />
    </View>
  );
}

export default FiltersModalBody;

const useStyles = makeStyles(() => ({
  bottomSheetContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  optionContainer: {
    width: '100%',
  },
  optionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  primaryButtonContainerStyle: {
    width: '100%',
  },
  primaryButtonStyle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
  },
}));
