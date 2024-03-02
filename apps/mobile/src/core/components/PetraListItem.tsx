// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { customColors } from '@petra/core/colors';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import { testProps } from 'e2e/config/testProps';
import Typography from './Typography';

export interface ItemType<Type> {
  hintText?: string;
  id: Type;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  route?: string;
  text: string;
  textColor?: string;
  url?: string;
}

interface ItemProps {
  item: ItemType<any>;
  onPress: () => void;
}

export default function PetraListItem({ item, onPress }: ItemProps) {
  const styles = useStyles();
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={customColors.navy['300']}
      {...testProps(item.id)}
    >
      <View style={styles.item}>
        <View style={styles.leftItem}>
          {item.leftIcon ? (
            <View style={styles.icon}>{item.leftIcon}</View>
          ) : null}
          <View style={styles.textContainer}>
            <Typography
              color={item.textColor ?? customColors.navy['700']}
              variant="body"
              weight="600"
            >
              {item.text}
            </Typography>
            {item.hintText ? (
              <Typography
                color={customColors.navy['400']}
                variant="body"
                weight="600"
              >
                {item.hintText}
              </Typography>
            ) : null}
          </View>
        </View>
        {item.rightIcon ? <View>{item.rightIcon}</View> : null}
      </View>
    </TouchableHighlight>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: 16,
  },
  item: {
    alignItems: 'center',
    backgroundColor: theme.background.secondary,
    flexDirection: 'row',
    padding: PADDING.container,
  },
  leftItem: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },

  textContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
}));
