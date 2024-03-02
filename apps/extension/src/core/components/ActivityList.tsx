// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { VStack } from '@chakra-ui/react';
import React from 'react';
import ActivityListItem from 'core/components/ActivityListItem';
import {
  ActivityItem,
  isConfirmedActivityItem,
} from '@petra/core/types/activity';

/**
 * Get a unique key for the activity item, based on its status.
 * A pending activity item maps to a pending transaction, so we can safely use the transaction hash
 */
function getActivityItemKey(item: ActivityItem) {
  return isConfirmedActivityItem(item)
    ? `${item.creationNum}_${item.sequenceNum}`
    : item.txnHash;
}

interface ActivityListProps {
  items: ActivityItem[];
}

export function ActivityList({ items }: ActivityListProps) {
  return (
    <VStack w="100%">
      {items.map((item) => (
        <ActivityListItem key={getActivityItemKey(item)} item={item} />
      ))}
    </VStack>
  );
}

export default ActivityList;
