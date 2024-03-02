// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React, { useCallback, useMemo } from 'react';
import {
  LayoutAnimation,
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HIT_SLOPS } from 'shared';
import {
  ChevronLeftIconSVG,
  ChevronRightIconSVG,
  HomeIconSVG,
  SearchIconSVG,
} from 'shared/assets/svgs';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import Cluster from 'core/components/Layouts/Cluster';
import makeStyles from 'core/utils/makeStyles';
import { useTheme } from 'core/providers/ThemeProvider';
import type { ExploreViewModes } from '../ExploreView';

/**
 * In Explore Mode:
 * We always want the value of the input to be what is supplied by the parent.
 *
 * In Web Mode:
 * We want to balance the what the current URL is vs what the user wants to type.
 * For example, a user goes to topaz.so. The website forwards them
 * to https://topaz.so/ and the URL changes. The user navigates around the site
 * and the url continues to change. The user then decides to go to google.com,
 * we need to update the input to reflect that change.
 *
 */

interface HeaderProps {
  canGoBack: boolean;
  canGoForward: boolean;
  mode: ExploreViewModes;
  onBackPress: () => void;
  onChange: (search: string) => void;
  onForwardPress: () => void;
  onGoHome: () => void;
  onSubmit: (search: string) => void;
  refHeaderTextInput: React.RefObject<TextInput>;
}

const enabledColor = customColors.navy[900];
const disabledColor = customColors.navy[500];

export default function ExploreHeader({
  canGoBack,
  canGoForward,
  mode,
  onBackPress,
  onChange,
  onForwardPress,
  onGoHome,
  onSubmit,
  refHeaderTextInput,
}: HeaderProps): JSX.Element {
  const { theme } = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = React.useState(false);

  const safeAreaInsets = useSafeAreaInsets();

  useMemo(() => {
    // if canGoBack changes, animate the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoBack]);

  const isExplore = mode === 'dapp-view';

  const onSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmit(e.nativeEvent.text);
      setFocused(false);
      refHeaderTextInput.current?.blur();
    },
    [onSubmit, refHeaderTextInput],
  );

  return (
    <View
      style={{
        backgroundColor: theme.background.secondary,
        paddingTop: safeAreaInsets.top,
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onBackPress}
          hitSlop={HIT_SLOPS.smallSlop}
          disabled={!canGoBack}
          style={isExplore ? styles.buttonsExplore : styles.buttonsWeb}
        >
          <ChevronLeftIconSVG
            color={canGoBack ? enabledColor : disabledColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onForwardPress}
          hitSlop={HIT_SLOPS.smallSlop}
          disabled={!canGoForward}
          style={isExplore ? styles.buttonsExplore : styles.buttonsWeb}
        >
          <ChevronRightIconSVG
            color={canGoForward ? enabledColor : disabledColor}
          />
        </TouchableOpacity>
        <Cluster
          noWrap
          space={8}
          style={[styles.searchBar, focused ? styles.searchBarFocused : {}]}
        >
          <SearchIconSVG size={16} color="navy.400" />
          <TextInput
            style={styles.searchText}
            placeholderTextColor={disabledColor}
            placeholder={i18nmock('general:explorePlaceholder')}
            ref={refHeaderTextInput}
            onChangeText={onChange}
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically
            keyboardType="web-search"
            selectTextOnFocus
            onSubmitEditing={onSubmitEditing}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </Cluster>
        <TouchableOpacity
          onPress={onGoHome}
          hitSlop={HIT_SLOPS.smallSlop}
          style={isExplore ? styles.buttonsExplore : styles.buttonsWeb}
        >
          <HomeIconSVG color={enabledColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const searchBarHeight = 48;

const useStyles = makeStyles((theme) => ({
  buttonsExplore: {
    overflow: 'hidden',
    paddingHorizontal: 0,
    width: 0,
  },
  buttonsWeb: {
    overflow: 'visible',
    paddingHorizontal: 8,
    width: 'auto',
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    flexDirection: 'row',
    paddingHorizontal: PADDING.container,
    paddingVertical: 8,
    width: '100%',
  },
  searchBar: {
    backgroundColor: customColors.navy['50'],
    borderColor: 'transparent',
    borderRadius: Math.round(searchBarHeight / 2),
    borderWidth: 1,
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOpacity: 0,
  },
  searchBarFocused: {
    borderColor: customColors.navy['900'],
  },
  searchText: {
    color: theme.typography.primary,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    padding: 0,
  },
}));
