// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Typography from 'core/components/Typography';
import { CloseIconSVG } from 'shared/assets/svgs';
import { usePetraBottomSheetContext } from './PetraBottomSheetContext';

export interface PetraBottomSheetHeaderProps extends PropsWithChildren {
  showCloseButton?: boolean;
  showHandle?: boolean;
}

export default function PetraBottomSheetHeader({
  children,
  showCloseButton = false,
  showHandle = true,
}: PetraBottomSheetHeaderProps) {
  const { isOverflowing, modalRef } = usePetraBottomSheetContext();

  const onClose = () => {
    modalRef.current?.dismiss();
  };

  const isTextTitle = typeof children === 'string';

  return (
    <View
      style={{
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: isOverflowing ? 1 : 0,
      }}
    >
      {showHandle ? (
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      ) : null}
      <View style={styles.container}>
        <View
          style={[
            styles.titleContainer,
            showCloseButton ? { marginLeft: 24 } : null,
          ]}
        >
          {isTextTitle ? (
            <Typography
              variant="heading"
              color="navy.900"
              style={styles.title}
              numberOfLines={1}
            >
              {children}
            </Typography>
          ) : (
            children
          )}
        </View>
        {showCloseButton ? (
          <TouchableOpacity onPress={onClose}>
            <CloseIconSVG size={24} color="navy.600" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  handle: {
    backgroundColor: customColors.tan[400],
    borderRadius: 3,
    height: 5,
    width: 36,
  },
  handleContainer: {
    alignSelf: 'center',
    marginTop: 8,
    paddingBottom: 8,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  titleContainer: {
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
  },
});
