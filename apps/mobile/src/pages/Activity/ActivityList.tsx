// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ActivityEvent } from '@petra/core/activity';
import { customColors } from '@petra/core/colors';
import { useNavigation } from '@react-navigation/native';
import Center from 'core/components/Center';
import EmptyState from 'core/components/EmptyState';
import Typography, { TypographyProps } from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import React, { forwardRef } from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import ActivityListItem from './ActivityListItem';

function idFromEvent(event: ActivityEvent) {
  // eslint-disable-next-line no-underscore-dangle
  return String(event.version) + event._type + event.eventIndex;
}

function ActivityHeader({ title }: { title: string }) {
  const styles = useStyles();
  return (
    <View style={styles.sectionHeader}>
      <Typography weight="700" variant="heading">
        {title}
      </Typography>
    </View>
  );
}

interface ActivityListProps extends SectionListProps<ActivityEvent> {
  initialLoading?: boolean;
  refreshingNextPage?: boolean;
  sectionHeaderStyle?: TypographyProps;
}

const ActivityList = forwardRef<SectionList<ActivityEvent>, ActivityListProps>(
  (
    {
      initialLoading,
      refreshingNextPage,
      sectionHeaderStyle,
      sections,
      ...props
    },
    ref,
  ) => {
    const styles = useStyles();
    const navigation = useNavigation();

    const navigateToDetail = (event: ActivityEvent) =>
      navigation.navigate('ActivityDetail', { event });

    const renderEmptyState = () => (
      <Center>
        {initialLoading ? (
          <ActivityIndicator color={customColors.black} />
        ) : (
          <EmptyState
            text={i18nmock('activity:nullState.title')}
            subtext={i18nmock('activity:nullState.message')}
          />
        )}
      </Center>
    );

    const renderItem = ({ item }: { item: ActivityEvent }) => (
      <TouchableOpacity onPress={() => navigateToDetail(item)}>
        <ActivityListItem event={item} />
      </TouchableOpacity>
    );

    const renderFooter = () =>
      refreshingNextPage ? (
        <Center>
          <ActivityIndicator color={customColors.black} />
        </Center>
      ) : null;

    return (
      <SectionList<ActivityEvent>
        ref={ref}
        showsVerticalScrollIndicator={false}
        sections={sections}
        renderSectionHeader={({ section: { title } }) => (
          <ActivityHeader title={title} {...sectionHeaderStyle} />
        )}
        renderItem={renderItem}
        keyExtractor={idFromEvent}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollContainer}
        windowSize={10}
        {...props}
      />
    );
  },
);

export default ActivityList;

const useStyles = makeStyles((theme) => ({
  contentContainer: { flexGrow: 1 },
  scrollContainer: { width: '100%' },
  sectionHeader: {
    backgroundColor: theme.background.secondary,
    padding: PADDING.container,
  },
}));
