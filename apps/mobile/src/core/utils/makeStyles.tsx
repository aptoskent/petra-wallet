// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { Theme, useTheme } from 'core/providers/ThemeProvider';
import { StyleSheet } from 'react-native';

type NamedStyles<T> = StyleSheet.NamedStyles<T>;
type CreateStyleReturn<T> = NamedStyles<T> | NamedStyles<any>;

export default function makeStyles<T extends CreateStyleReturn<T>>(
  stylesOrFn: T | NamedStyles<T> | ((theme: Theme) => T | NamedStyles<T>),
) {
  return function useStyles() {
    const { theme } = useTheme();
    return useMemo(() => {
      const styles =
        typeof stylesOrFn === 'function' ? stylesOrFn(theme) : stylesOrFn;
      return StyleSheet.create(styles);
    }, [theme]);
  };
}
