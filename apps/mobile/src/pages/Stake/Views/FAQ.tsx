// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { PropsWithChildren } from 'react';
import Typography from 'core/components/Typography';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import { customColors } from '@petra/core/colors';
import {
  ScrollView,
  View,
  Pressable,
  TextProps,
  ViewProps,
} from 'react-native';
import useExplorerAddress from '@petra/core/hooks/useExplorerAddress';
import { useWebViewPopover } from 'core/providers/WebViewPopoverProvider';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import { PetraPillButton } from 'core/components';
import { i18nmock } from 'strings';

interface StakingTextProps extends PropsWithChildren, TextProps {}
interface SectionProps extends ViewProps {}

function Heading({ children, style }: StakingTextProps) {
  return (
    <Typography variant="heading" style={[{ marginBottom: 12 }, style]}>
      {children}
    </Typography>
  );
}

function Question({ children, style }: StakingTextProps) {
  return (
    <Typography
      variant="body"
      weight="600"
      style={[{ marginBottom: 4 }, style]}
    >
      {children}
    </Typography>
  );
}

function Answer({ children, style }: StakingTextProps) {
  return (
    <Typography variant="small" style={[{ marginBottom: 8 }, style]}>
      {children}
    </Typography>
  );
}

function Section({ children, style }: SectionProps) {
  const styles = useStyles();

  return <View style={[styles.questionAnswer, style]}>{children}</View>;
}

type StakeFAQProps = RootAuthenticatedStackScreenProps<'StakeFlowFAQ'>;

export default function StakeFAQ({ navigation }: StakeFAQProps) {
  const styles = useStyles();
  const getExplorerAddress = useExplorerAddress();
  const { openUri } = useWebViewPopover();

  const handleNavigateToExplorer = () => {
    const explorerAddress = getExplorerAddress('');
    openUri({
      title: i18nmock('settings:viewOnExplorer.modalTitle'),
      uri: explorerAddress,
    });
  };

  const handleNavigateToStakingView = () => {
    navigation.push('StakeFlowEnterAmount');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.questionAnswer}>
        <Heading>I. {i18nmock('stake:faq.staking')}</Heading>
        <Question>{i18nmock('stake:faq.whatIsStaking')}</Question>
        <Answer>
          {i18nmock('stake:faq.whatIsStakingAnswerFirstParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.whatIsStakingAnswerSecondParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.whatIsStakingAnswerThirdParagraph')}
        </Answer>
      </View>

      <View style={styles.questionAnswer}>
        <Question>{i18nmock('stake:faq.canAnyoneStake')}</Question>
        <Answer>{i18nmock('stake:faq.canAnyoneStakeAnswer')}</Answer>
      </View>

      <Section>
        <Question>{i18nmock('stake:faq.minimumStake')}</Question>
        <Answer>{i18nmock('stake:faq.minimumStakeAnswer')}</Answer>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.howToStake')}</Question>
        <Answer>{i18nmock('stake:faq.howToStakeAnswer')}</Answer>
        <Pressable onPress={handleNavigateToStakingView}>
          <Typography variant="small" underline style={{ marginBottom: 8 }}>
            {i18nmock('stake:faq.tapHereToBegin')}
          </Typography>
        </Pressable>
        <Typography variant="small">
          {i18nmock('stake:faq.checkOnExplorer')}
          <Pressable onPress={handleNavigateToExplorer}>
            <Typography variant="small" underline>
              {i18nmock('stake:faq.explorer')}
            </Typography>
          </Pressable>
        </Typography>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.canIUnstake')}</Question>
        <Answer>{i18nmock('stake:faq.canIUnstakeAnswer')}</Answer>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.whenCanIWithdraw')}</Question>
        <Answer>
          {i18nmock('stake:faq.whenCanIWithdrawAnswerFirstParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.whenCanIWithdrawAnswerSecondParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.whenCanIWithdrawAnswerThirdParagraph')}
        </Answer>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.whatStatusedMean')}</Question>
        <Answer>
          {i18nmock('stake:faq.whatStatusedMeanAnswerFirstParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.whatStatusedMeanAnswerSecondParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.whatStatusedMeanAnswerThirdParagraph')}
        </Answer>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.addStakeFee')}</Question>
        <Answer>{i18nmock('stake:faq.addStakeFeeAnswer')}</Answer>
      </Section>

      <Heading style={{ marginTop: 16 }}>
        II. {i18nmock('stake:faq.rewards')}
      </Heading>
      <Section>
        <Question>
          {i18nmock('stake:faq.canValidatorChangeCommission')}
        </Question>
        <Answer>
          {i18nmock('stake:faq.canValidatorChangeCommissionAnswer')}
        </Answer>
      </Section>

      <Section>
        <Question>
          {i18nmock('stake:faq.stakingRewardExpectToReceive')}
        </Question>
        <Answer>
          {i18nmock('stake:faq.stakingRewardExpectToReceiveAnswer')}
        </Answer>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.whenReceiveAward')}</Question>
        <Answer>{i18nmock('stake:faq.whenReceiveAwardAnswer')}</Answer>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.whenReceiveAward')}</Question>
        <Answer>{i18nmock('stake:faq.whenReceiveAwardAnswer')}</Answer>
      </Section>

      <Heading style={{ marginTop: 16 }}>
        III. {i18nmock('stake:faq.validators')}
      </Heading>

      <Section>
        <Question>{i18nmock('stake:faq.whatIsValidators')}</Question>
        <Answer>{i18nmock('stake:faq.whatIsValidatorsAnswer')}</Answer>
      </Section>

      <Section>
        <Question>{i18nmock('stake:faq.howDoIChooseValidator')}</Question>
        <Answer>
          {i18nmock('stake:faq.howDoIChooseValidatorAnswerFirstParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.howDoIChooseValidatorAnswerSecondParagraph')}
        </Answer>
        <Answer>
          {i18nmock('stake:faq.howDoIChooseValidatorAnswerThirdParagraph')}
        </Answer>
      </Section>

      <Section style={{ borderColor: 'transparent' }}>
        <Question>
          {i18nmock('stake:faq.howIsValidatorPerformanceMeasured')}
        </Question>
        <Answer>
          {i18nmock(
            'stake:faq.howIsValidatorPerformanceMeasuredAnswerFirstParagraph',
          )}
        </Answer>
        <Answer>
          {i18nmock(
            'stake:faq.howIsValidatorPerformanceMeasuredAnswerSecondParagraph',
          )}
        </Answer>
        <Answer>
          {i18nmock(
            'stake:faq.howIsValidatorPerformanceMeasuredAnswerThirdParagraph',
          )}
        </Answer>
      </Section>
      <View style={[styles.bottomSheetContainer]}>
        <PetraPillButton
          onPress={navigation.goBack}
          text={i18nmock('general:ok')}
        />
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles((theme) => ({
  bottomSheetContainer: {
    paddingBottom: 36,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    paddingHorizontal: PADDING.container,
  },
  questionAnswer: {
    borderBottomWidth: 1,
    borderColor: customColors.navy[100],
    paddingBottom: 8,
    paddingTop: 12,
  },
}));
