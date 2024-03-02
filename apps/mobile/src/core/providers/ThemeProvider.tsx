// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import constate from 'constate';
import { useCallback, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  mode: ThemeMode;
  palette: {
    error: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
  };
  typography: {
    primary: string;
    primaryDisabled: string;
    secondary: string;
    secondaryDisabled: string;
  };
}

function makeLightTheme(): Theme {
  return {
    background: {
      primary: customColors.navy[900],
      secondary: customColors.tan[50],
      tertiary: customColors.white,
    },
    mode: 'light',
    palette: {
      error: customColors.error,
      primary: customColors.navy[900],
      secondary: customColors.salmon[500],
      success: customColors.green[500],
      warning: customColors.orange[600],
    },
    typography: {
      primary: customColors.navy[900],
      primaryDisabled: customColors.navy[500],
      secondary: customColors.white,
      secondaryDisabled: customColors.navy[400],
    },
  };
}

function makeDarkTheme(): Theme {
  // @TODO: Implement dark theme
  return makeLightTheme();
}

const darkTheme: Theme = makeDarkTheme();
const lightTheme: Theme = makeLightTheme();

export const [ThemeProvider, useTheme] = constate(() => {
  const scheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(scheme ?? 'light');

  const persistentSetMode = useCallback(
    (nextMode: ThemeMode) => {
      // @TODO: Persist mode if the user changes their p
      setMode(nextMode);
    },
    [setMode],
  );

  const theme: Theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  );

  return {
    mode,
    setMode: persistentSetMode,
    theme,
  };
});
