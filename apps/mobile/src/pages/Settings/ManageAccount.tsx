// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import { PetraPillButton, PillButtonDesign } from 'core/components';
import { i18nmock } from 'strings';
import AlertTriangleIconSVG from 'shared/assets/svgs/alert_triangle_icon';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import Reauthenticate from '../Reauthenticate';
import { RootAuthenticatedStackScreenProps } from '../../navigation/types';

interface AccountNameProps {
  handleNavigate: (route: any) => void;
}

function AccountName({ handleNavigate }: AccountNameProps) {
  const styles = useStyles();
  const { activeAccount } = useActiveAccount();
  const accountName = activeAccount.name ?? 'Account';

  const handleEditName = () => {
    handleNavigate('EditAccountName');
  };

  return (
    <View style={styles.rowContainer}>
      <View style={styles.accountNameContainer}>
        <Text style={styles.label}>
          {i18nmock('settings:manageAccount.accountName.label')}
        </Text>
        <Text style={styles.accountName}>{accountName}</Text>
      </View>
      <View style={styles.editButtonContainer}>
        <PetraPillButton
          buttonDesign={PillButtonDesign.clearWithDarkText}
          buttonStyleOverride={{ paddingHorizontal: PADDING.container }}
          onPress={handleEditName}
          text={i18nmock('settings:manageAccount.edit')}
        />
      </View>
    </View>
  );
}

interface SecretRecoveryPhraseProps {
  handleNavigate: (route: any) => void;
}

function SecretRecoveryPhrase({ handleNavigate }: SecretRecoveryPhraseProps) {
  const styles = useStyles();
  const handleShow = () => {
    handleNavigate('SecretRecoveryPhrase');
  };

  return (
    <View
      style={[
        styles.rowContainer,
        { alignItems: 'center', flexDirection: 'row' },
      ]}
    >
      <Text style={[styles.label, { flex: 1 }]}>
        {i18nmock('settings:manageAccount.secretRecoveryPhrase.title')}
      </Text>
      <PetraPillButton
        buttonDesign={PillButtonDesign.clearWithDarkText}
        buttonStyleOverride={{ paddingHorizontal: PADDING.container }}
        onPress={handleShow}
        text={i18nmock('settings:manageAccount.show')}
      />
    </View>
  );
}

interface PrivateKeyProps {
  handleNavigate: (route: any) => void;
}

function PrivateKey({ handleNavigate }: PrivateKeyProps) {
  const styles = useStyles();
  const { activeAccount } = useActiveAccount();

  if (activeAccount.type !== 'local') return null;

  return (
    <View style={[styles.rowContainer, { borderColor: 'transparent' }]}>
      <View style={styles.privateKeyContainer}>
        <Text style={[styles.label, { flex: 1 }]}>
          {i18nmock('settings:manageAccount.privateKey.title')}
        </Text>
        <TextInput
          style={styles.label}
          editable={false}
          secureTextEntry
          value={activeAccount.privateKey.slice(0, 28)}
          textAlign="center"
        />
      </View>
      <View style={[styles.buttonContainer]}>
        <PetraPillButton
          buttonDesign={PillButtonDesign.clearWithDarkText}
          buttonStyleOverride={{ paddingHorizontal: PADDING.container }}
          onPress={() => handleNavigate('PrivateKey')}
          text={i18nmock('settings:manageAccount.show')}
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
        <AlertTriangleIconSVG color={customColors.orange[600]} />
        <Text style={styles.cautionTitle}>
          {i18nmock('settings:manageAccount.caution.title')}
        </Text>
      </View>
      <Text style={styles.cautionBody}>
        {i18nmock('settings:manageAccount.caution.body')}
      </Text>
    </View>
  );
}

export default function ManageAccount({
  navigation,
  route,
}: RootAuthenticatedStackScreenProps<'ManageAccount'>) {
  const styles = useStyles();
  const { activeAccount } = useActiveAccount();

  const hasMnemonic =
    activeAccount.type === 'local' && activeAccount.mnemonic !== undefined;

  const handleNavigate = (newRoute: any) => {
    navigation.navigate(newRoute);
  };

  const updateTitle = (newTitle: string) => {
    navigation.setOptions({ headerTitle: newTitle });
  };

  const content = (
    <View style={styles.container}>
      <AccountName handleNavigate={handleNavigate} />
      {hasMnemonic ? (
        <SecretRecoveryPhrase handleNavigate={handleNavigate} />
      ) : null}
      <PrivateKey handleNavigate={handleNavigate} />
      <CautionBanner />
    </View>
  );

  if (route.params.needsAuthentication) {
    return (
      <Reauthenticate
        updateTitle={updateTitle}
        title={i18nmock('settings:manageAccount.title')}
      >
        {content}
      </Reauthenticate>
    );
  }
  return content;
}

const useStyles = makeStyles((theme) => ({
  accountName: {
    color: customColors.navy['700'],
    flex: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    marginRight: 16,
    textAlign: 'right',
  },
  accountNameContainer: { flexDirection: 'row', marginBottom: 24 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  cautionBody: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-Regular',
  },
  cautionContainer: {
    backgroundColor: customColors.orange['100'],
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
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    paddingHorizontal: 10,
    paddingVertical: 16,
    width: '100%',
  },
  editButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  label: {
    color: theme.typography.primary,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
  privateKeyContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 18,
    width: '100%',
  },
  rowContainer: {
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: customColors.navy['100'],
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 24,
  },
}));
