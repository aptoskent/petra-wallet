// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import AlertOctagonIconSVG from 'shared/assets/svgs/alert_octagon_icon';
import { CheckIconSVG } from 'shared/assets/svgs';
import { CopyIcon16SVG } from 'shared/assets/svgs/copy_icon';
import makeStyles from 'core/utils/makeStyles';

function CopyIcon() {
  return <CopyIcon16SVG color={customColors.navy['600']} />;
}

function CheckIcon() {
  return <CheckIconSVG color={customColors.white} />;
}

function ViewCopyKey() {
  const styles = useStyles();
  const { activeAccount } = useActiveAccount();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (activeAccount.type !== 'local') return null;

  const handleCopy = () => {
    Clipboard.setString(activeAccount.privateKey);
    setIsCopied(true);
  };

  const buttonDesign = isCopied
    ? PillButtonDesign.success
    : PillButtonDesign.clearWithDarkText;

  return (
    <View style={styles.privateKeyContainer}>
      <View style={styles.privateKeyLabelContainer}>
        <Text style={styles.privateKeyLabel}>
          {i18nmock('settings:manageAccount.privateKey.title')}
        </Text>
        <View style={styles.privateKeyValue}>
          <Text>{activeAccount.privateKey}</Text>
        </View>
      </View>
      <View style={styles.copyButtonContainer}>
        <PetraPillButton
          buttonDesign={buttonDesign}
          onPress={handleCopy}
          text={i18nmock('settings:manageAccount.privateKey.copy')}
          buttonStyleOverride={styles.buttonStyleOverride}
          containerStyleOverride={{ width: '100%' }}
          leftIcon={!isCopied ? CopyIcon : undefined}
          rightIcon={isCopied ? CheckIcon : undefined}
        />
      </View>
    </View>
  );
}

function CautionBanner() {
  const styles = useStyles();
  return (
    <View style={styles.cautionContainer}>
      <View style={styles.cautionTitleContainer}>
        <AlertOctagonIconSVG color={customColors.error} />
        <Text style={styles.cautionTitle}>
          {i18nmock('settings:manageAccount.privateKey.caution.title')}
        </Text>
      </View>
      <Text style={styles.cautionBody}>
        {i18nmock('settings:manageAccount.privateKey.caution.body')}
      </Text>
    </View>
  );
}

export default function PriveKey() {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ViewCopyKey />
      <CautionBanner />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  buttonStyleOverride: {
    alignSelf: 'stretch',
    borderColor: customColors.navy['200'],
    borderWidth: 2,
  },
  cautionBody: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-Regular',
  },
  cautionContainer: {
    backgroundColor: customColors.salmon['50'],
    borderRadius: 8,
    padding: 20,
  },
  cautionTitle: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-SemiBold',
    marginLeft: 8,
  },
  cautionTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  circleIcon: {
    borderColor: customColors.navy['200'],
    borderRadius: Math.round(Dimensions.get('window').width * 0.5),
    borderWidth: 2,
    height: 16,
    width: 16,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    paddingHorizontal: 18,
    paddingVertical: 24,
    width: '100%',
  },
  copyButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  privateKeyContainer: {
    paddingBottom: 18,
    width: '100%',
  },
  privateKeyLabel: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    marginBottom: 20,
  },
  privateKeyLabelContainer: {
    borderBottomWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    paddingBottom: 14,
  },
  privateKeyValue: {
    borderColor: customColors.navy['200'],
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
  },
}));
