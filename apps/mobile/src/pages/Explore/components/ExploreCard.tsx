// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import useAccountTokensTotal from '@petra/core/hooks/useAccountTokensTotal';
import useAccountTransactionsAggregate from '@petra/core/hooks/useAccountTransactionsAggregate';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import Typography from 'core/components/Typography';
import { useTheme } from 'core/providers/ThemeProvider';
import makeStyles from 'core/utils/makeStyles';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DROP_SHADOW } from 'shared';
import { ChevronRightIconSVG } from 'shared/assets/svgs';
import AnsSVG from 'shared/assets/svgs/ans';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';
import SafeSVG from 'shared/assets/svgs/safe';

interface ExploreCardProps {
  backgroundColor?: string;
  content?: React.ReactNode;
}

interface ExploreCardPressProps {
  onPress?: () => void;
}

function ExploreCard({
  backgroundColor,
  content,
  onPress,
}: ExploreCardProps & ExploreCardPressProps) {
  const styles = useStyles();
  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[styles.container, DROP_SHADOW.default, { backgroundColor }]}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
}

interface StatSectionProps {
  subtitle: string;
  title: string;
  value: string | number;
}

function StatSection({ subtitle, title, value }: StatSectionProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.statSection}>
      <Typography variant="body" weight="600">
        {title}
      </Typography>
      <Typography variant="heading" weight="700">
        {value}
      </Typography>
      <Typography
        variant="small"
        weight="400"
        color={theme.typography.secondaryDisabled}
      >
        {subtitle}
      </Typography>
    </View>
  );
}

function TransactionsStatSection() {
  const { activeAccountAddress } = useActiveAccount();
  const aggregateQuery = useAccountTransactionsAggregate(activeAccountAddress);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
  };
  const timestamp = aggregateQuery.data?.firstTimestamp
    ? `${i18nmock(
        'general:exploreCards.transactions.body',
      ).toUpperCase()} ${aggregateQuery.data?.firstTimestamp
        ?.toLocaleString('en-US', options)
        ?.toUpperCase()}`
    : '';

  return (
    <StatSection
      subtitle={aggregateQuery.isFetching ? '-' : timestamp ?? '-'}
      title={i18nmock('general:exploreCards.transactions.title')}
      value={aggregateQuery.isFetching ? '-' : aggregateQuery.data?.count ?? 0}
    />
  );
}

function NFTsStatSection() {
  const { activeAccountAddress } = useActiveAccount();
  const totalTokensQuery = useAccountTokensTotal(activeAccountAddress);
  return (
    <StatSection
      subtitle={i18nmock('general:exploreCards.nfts.body').toUpperCase()}
      title={i18nmock('general:exploreCards.nfts.title')}
      value={totalTokensQuery.isFetching ? '-' : totalTokensQuery.data ?? 0}
    />
  );
}

export function ExploreStatCard() {
  const { theme } = useTheme();
  const styles = useStyles();
  const content = (
    <View style={styles.statCard}>
      <TransactionsStatSection />
      <NFTsStatSection />
    </View>
  );
  return (
    <ExploreCard
      backgroundColor={theme.background.tertiary}
      content={content}
    />
  );
}

interface LinkHeaderProps {
  secondaryColor: string;
  text: string | React.ReactNode;
  textColor: string;
}

interface LinkBodyProps {
  text: string | React.ReactNode;
  textColor: string;
}

function LinkHeader({ secondaryColor, text, textColor }: LinkHeaderProps) {
  const styles = useStyles();
  return (
    <View style={styles.linkHeader}>
      <Typography color={textColor} variant="heading" weight="700">
        {text}
      </Typography>
      <ChevronRightIconSVG color={secondaryColor} />
    </View>
  );
}

function LinkBody({ text, textColor }: LinkBodyProps) {
  return (
    <View style={{ paddingRight: 8 }}>
      <Typography color={textColor} variant="body">
        {text}
      </Typography>
    </View>
  );
}

interface CardContentProps {
  body: React.ReactNode;
  header: string;
  image: React.ReactNode;
  secondaryColor: string;
  textColor: string;
}

function CardContent({
  body,
  header,
  image,
  secondaryColor,
  textColor,
}: CardContentProps) {
  const styles = useStyles();
  return (
    <View style={styles.linkCard}>
      <LinkHeader
        text={header}
        textColor={textColor}
        secondaryColor={secondaryColor}
      />
      <LinkBody text={body} textColor={textColor} />
      <View style={{ alignItems: 'center', flex: 1, paddingVertical: 28 }}>
        {image}
      </View>
    </View>
  );
}

export function ExploreNameCard({ onPress }: ExploreCardPressProps) {
  const { theme } = useTheme();
  // TODO: Replace with formatted message type
  const start = (
    <Typography>Personalize your wallet address with your unique</Typography>
  );
  const apt = <Typography weight="600">.apt</Typography>;
  const end = <Typography>name.</Typography>;
  const body = (
    <Typography variant="body">
      {start} {apt} {end}
    </Typography>
  );
  const content = (
    <CardContent
      header={i18nmock('general:exploreCards.names.title')}
      body={body}
      textColor={theme.typography.primary}
      secondaryColor={theme.typography.secondaryDisabled}
      image={<AnsSVG />}
    />
  );

  return (
    <ExploreCard
      onPress={onPress}
      backgroundColor={customColors.tan[400]}
      content={content}
    />
  );
}

export function ExploreSafeCard({ onPress }: ExploreCardPressProps) {
  const { theme } = useTheme();
  const content = (
    <CardContent
      header={i18nmock('general:exploreCards.safe.title')}
      body={i18nmock('general:exploreCards.safe.body')}
      textColor={theme.typography.secondary}
      secondaryColor={theme.typography.secondary}
      image={<SafeSVG />}
    />
  );

  return (
    <ExploreCard
      onPress={onPress}
      backgroundColor={customColors.navy[700]}
      content={content}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.background.tertiary,
    borderRadius: 12,
    paddingHorizontal: PADDING.container,
    paddingVertical: 8,
    width: '100%',
  },
  linkCard: {
    paddingTop: PADDING.container,
  },
  linkHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statCard: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
  },
  statSection: {
    flex: 1,
    gap: 2,
    height: '100%',
  },
}));
