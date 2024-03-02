// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useActivity } from '@petra/core/activity';
import { groupPagesToSections } from '@petra/core/activity/group';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { useFocusEffect } from '@react-navigation/native';
import { useFlag } from '@petra/core/flags';
import PetraHeader from 'core/components/PetraHeader';
import Typography from 'core/components/Typography';
import { AssetsTabsScreenProps } from 'navigation/types';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  SectionList,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { i18nmock } from 'strings';
import makeStyles from 'core/utils/makeStyles';
import { HIT_SLOPS } from 'shared/constants';
import { testProps } from 'e2e/config/testProps';
import useActivityFilters from 'core/hooks/useActivityFilters';
import useSteadyRefresh from 'core/hooks/useSteadyRefresh';
import ActivityList from './ActivityList';
import { getGroupTitle } from './util';

function ActivityFiltersButton({
  onPress,
  ...props
}: TouchableOpacityProps): JSX.Element {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={HIT_SLOPS.smallSlop}
      {...props}
      {...testProps('button-activity-filters')}
    >
      <Typography weight="600" variant="body">
        {i18nmock('general:filters.buttonLabel')}
      </Typography>
    </TouchableOpacity>
  );
}

function Activity({ navigation, route }: AssetsTabsScreenProps<'Activity'>) {
  const styles = useStyles();
  const scrollViewRef = useRef<SectionList>(null);
  const isFiltersSupportEnabled = useFlag('activity-filters-support');
  const { activeAccountAddress } = useActiveAccount();
  const { activityFilters, handleOnFilterPress } = useActivityFilters();
  const activity = useActivity(activeAccountAddress, activityFilters);
  const [isRefetching, refetch] = useSteadyRefresh(activity.refetch);
  const [isFetchingNextPage, fetchNextPage] = useSteadyRefresh(
    activity.fetchNextPage,
  );

  useFocusEffect(
    useCallback(() => {
      // If the query is not in flight, refetch it when navigated to
      if (!activity.isFetching) activity.refetch();

      // Listing the dependencies here will cause the effect to run every time
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    activity.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFilters]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <PetraHeader
          action={
            isFiltersSupportEnabled ? (
              <ActivityFiltersButton onPress={handleOnFilterPress} />
            ) : undefined
          }
          navigation={navigation}
        />
      ),
    });
  }, [handleOnFilterPress, navigation, isFiltersSupportEnabled]);

  const fetchMore = () => {
    if (activity.hasNextPage && !activity.isFetching) {
      fetchNextPage();
    }
  };

  const sections = groupPagesToSections(activity.data?.pages, getGroupTitle);

  useEffect(() => {
    const removeFocusListener = navigation.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        if (scrollViewRef.current && sections.length) {
          try {
            scrollViewRef.current.scrollToLocation({
              animated: true,
              itemIndex: 0,
              sectionIndex: 0,
              viewPosition: 0,
            });
          } catch (error) {
            /* empty */
          }
        }
      }
    });
    return () => {
      removeFocusListener();
    };
  }, [navigation, sections.length, route.name]);

  return (
    <View style={styles.container}>
      <ActivityList
        ref={scrollViewRef}
        sections={sections}
        onEndReached={fetchMore}
        initialLoading={activity.isLoading}
        refreshing={isRefetching}
        refreshingNextPage={isFetchingNextPage}
        onRefresh={refetch}
      />
    </View>
  );
}

export default Activity;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
  },
}));
