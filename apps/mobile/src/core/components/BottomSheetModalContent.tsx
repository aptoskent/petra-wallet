// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { customColors } from '@petra/core/colors';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

// SPDX-License-Identifier: Apache-2.0
interface BottomSheetModalContentProps {
  body?: JSX.Element;
  title: string;
}

export default function BottomSheetModalContent({
  body,
  title,
}: BottomSheetModalContentProps): JSX.Element {
  return (
    <>
      <Text style={styles.modalContentHeadingText}>{title}</Text>
      {body}
    </>
  );
}

const styles = StyleSheet.create({
  accountButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '80%',
    minWidth: '30%',
  },
  accountInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 16,
    width: '100%',
  },
  accountNameContainer: {
    maxWidth: '50%',
    minWidth: '10%',
  },
  accountNameText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    marginRight: 10,
  },
  accountNameTextContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  accountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    paddingLeft: 16,
    width: '100%',
  },
  accountRowAddOrRemove: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 80,
    width: '100%',
  },
  accountRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '90%',
  },
  accountRowRight: {
    flexDirection: 'row',
    paddingRight: 26,
    width: '10%',
  },
  accountText: {
    color: customColors.navy['500'],
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  accountTextContainer: {
    flex: 2,
  },
  addRemoveIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  addRemoveText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    paddingLeft: 16,
  },
  addRemoveTextContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
  addressContainer: {
    flex: 2,
    width: '100%',
  },
  addressText: {
    color: customColors.navy['600'],
    fontSize: 14,
    fontWeight: '500',
    width: '100%',
  },
  gearButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerAccountNameText: {
    color: customColors.navy['900'],
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headingLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  headingRight: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 24,
  },
  mainModalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalContentHeadingText: {
    color: customColors.navy['900'],
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 20,
    textAlign: 'center',
  },
  nameTextContainer: { maxWidth: '70%' },
});
