// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { StyleSheet } from 'react-native';

export default {
  mainCard: StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 12,
      elevation: 0.5,
      padding: 16,
      shadowColor: 'black',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0.04,
      shadowRadius: 30,
    },
    text: {
      marginTop: 12,
    },
    title: {
      fontWeight: '600',
      marginTop: 12,
    },
  }),
};
