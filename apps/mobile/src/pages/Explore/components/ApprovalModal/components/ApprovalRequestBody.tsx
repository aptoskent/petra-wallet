// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { PetraPillButton, PillButtonDesign } from 'core/components';
import {
  PetraBottomSheetContent,
  PetraBottomSheetFooter,
  PetraBottomSheetHeader,
} from 'core/components/PetraBottomSheet';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { PADDING } from 'shared/constants';
import { i18nmock } from 'strings';

export interface ApprovalRequestBodyProps extends PropsWithChildren {
  onApprove: () => void;
  onReject: () => void;
  title: string;
}

export default function ApprovalRequestBody({
  children,
  onApprove,
  onReject,
  title,
}: ApprovalRequestBodyProps) {
  return (
    <>
      <PetraBottomSheetHeader showCloseButton>{title}</PetraBottomSheetHeader>
      <PetraBottomSheetContent contentContainerStyle={styles.content}>
        {children}
      </PetraBottomSheetContent>
      <PetraBottomSheetFooter>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <PetraPillButton
            containerStyleOverride={{ flexGrow: 1 }}
            buttonDesign={PillButtonDesign.clearWithDarkText}
            onPress={onReject}
            text={i18nmock('approvalModal:common.reject')}
          />
          <PetraPillButton
            containerStyleOverride={{ flexGrow: 1, marginLeft: 8 }}
            buttonDesign={PillButtonDesign.default}
            onPress={onApprove}
            text={i18nmock('approvalModal:common.approve')}
          />
        </View>
      </PetraBottomSheetFooter>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: PADDING.container,
  },
});
