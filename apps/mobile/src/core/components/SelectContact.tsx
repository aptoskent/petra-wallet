// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import PetraKeyboardAwareScrollView from 'core/components/PetraKeyboardAwareScrollView';
import Typography from 'core/components/Typography';
import React from 'react';
import { ActivityIndicator, Platform, TextInput, View } from 'react-native';
import { i18nmock } from 'strings';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import { PADDING } from 'shared/constants';
import { useFlag } from '@petra/core/flags';
import makeStyles from 'core/utils/makeStyles';
import RecipientsListItem from './RecipientsListItem';
import useRecentContacts, { Contact } from '../hooks/useRecentContacts';
import useSearchContacts from '../hooks/useSearchContacts';
import EmptyState from './EmptyState';
import ScanQrCodeButton from './ScanQRCodeButton';

interface SelectContactProps {
  onContactPress: (contact: Contact) => void;
}

export default function SelectContact({ onContactPress }: SelectContactProps) {
  const styles = useStyles();
  const isQrSupportEnabled = useFlag('qr-support');
  const { recentContacts } = useRecentContacts();
  const {
    isFetching,
    onQueryChange,
    result: filteredRecipients,
  } = useSearchContacts(recentContacts);

  const renderRecipientList = () => {
    if (recentContacts === undefined || isFetching) {
      return <ActivityIndicator />;
    }

    if (filteredRecipients.length > 0) {
      return (
        <PetraKeyboardAwareScrollView>
          {filteredRecipients.map((contact) => (
            <RecipientsListItem
              key={contact.address}
              contact={contact}
              onPress={() => onContactPress(contact)}
            />
          ))}
        </PetraKeyboardAwareScrollView>
      );
    }

    return (
      <BottomSafeAreaView style={styles.center}>
        {recentContacts.length > 0 ? (
          <EmptyState
            text={i18nmock('assets:sendFlow.noAccountText')}
            subtext={i18nmock('assets:sendFlow.noAccountSubtext')}
          />
        ) : (
          <EmptyState
            text={i18nmock('assets:sendFlow.noRecentContactsText')}
            subtext={i18nmock('assets:sendFlow.noRecentContactsSubtext')}
          />
        )}
      </BottomSafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Typography color="navy.500" weight="600" style={styles.rightSpacing}>
          {i18nmock('general:to')}
        </Typography>
        <TextInput
          style={[styles.searchBar, styles.outline]}
          onChangeText={onQueryChange}
          placeholder={i18nmock('assets:sendFlow.placeholderInputTextAddress')}
          placeholderTextColor={customColors.navy['400']}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          clearButtonMode="always"
          keyboardType={
            Platform.OS === 'ios' ? 'email-address' : 'visible-password'
          }
          returnKeyType="search"
        />
        {isQrSupportEnabled ? (
          <ScanQrCodeButton
            style={[styles.outline, styles.qrButtonContainer]}
          />
        ) : null}
      </View>
      <Typography color="navy.500" weight="600" style={styles.spacing}>
        {i18nmock('assets:sendFlow.topPeople')}
      </Typography>
      <PetraKeyboardAvoidingView style={styles.keyboardContainer}>
        {renderRecipientList()}
      </PetraKeyboardAvoidingView>
    </View>
  );
}

const searchBarHeight = 48;

const useStyles = makeStyles((theme) => ({
  btnContainer: {
    backgroundColor: theme.background.tertiary,
    marginTop: 12,
  },
  center: {
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  keyboardContainer: {
    flex: 1,
  },
  outline: {
    backgroundColor: theme.background.tertiary,
    borderColor: customColors.navy['100'],
    borderRadius: Math.floor(searchBarHeight / 2),
    borderWidth: 1,
  },
  qrButtonContainer: {
    alignItems: 'center',
    borderRadius: Math.floor(searchBarHeight),
    justifyContent: 'center',
    marginLeft: PADDING.container,
    minHeight: searchBarHeight,
    width: searchBarHeight,
  },
  rightSpacing: {
    marginRight: 12,
  },
  searchBar: {
    color: customColors.navy['900'],
    flex: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    height: searchBarHeight,
    paddingHorizontal: PADDING.container,
  },
  searchBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: PADDING.container,
  },
  spacing: {
    paddingHorizontal: PADDING.container,
    paddingVertical: 5,
  },
}));
