// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { PetraPillButton } from 'core/components';
import Typography from 'core/components/Typography';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import useTrackEvent from 'core/hooks/useTrackEvent';
import { stakingEvents } from '@petra/core/utils/analytics/events';

interface DefinitionSheetContentProps {
  definition: string;
  dismiss: () => void;
  term: string;
}

export default function DefinitionSheetContent({
  definition,
  dismiss,
  term,
}: DefinitionSheetContentProps): JSX.Element {
  const styles = useStyles();
  const { trackEvent } = useTrackEvent();

  useEffect(() => {
    void trackEvent({
      eventType: stakingEvents.VIEW_STAKING_TERM,
      params: {
        stakingTerm: term,
      },
    });
  }, [trackEvent, term]);

  return (
    <View style={styles.container}>
      <Typography variant="subheading" align="center">
        {term}
      </Typography>
      <Typography variant="body" align="center">
        {definition}
      </Typography>
      <PetraPillButton onPress={dismiss} text={i18nmock('general:ok')} />
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    gap: 32,
    paddingHorizontal: PADDING.container,
    paddingTop: 32,
  },
}));
