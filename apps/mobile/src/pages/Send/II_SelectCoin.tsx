// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { customColors } from '@petra/core/colors';
import { useActiveAccount } from '@petra/core/hooks/useAccounts';
import EmptyState from 'core/components/EmptyState';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import PetraKeyboardAwareScrollView from 'core/components/PetraKeyboardAwareScrollView';
import Typography from 'core/components/Typography';
import { RootAuthenticatedStackScreenProps } from 'navigation/types';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import React, { useRef } from 'react';
import { ActivityIndicator, Platform, TextInput, View } from 'react-native';
import SearchIconSVG from 'shared/assets/svgs/explore_icon';
import { i18nmock } from 'strings';
import makeStyles from 'core/utils/makeStyles';
import { PADDING } from 'shared/constants';
import CoinListItem from './components/CoinListItem';
import {
  AccountCoinResource,
  useAccountCoinResources,
} from './hooks/useAccountCoinResources';
import useSearchCoin from './hooks/useSearchCoin';

type SelectCoinProps = RootAuthenticatedStackScreenProps<'SendFlow2'>;

export default function SelectCoin({ navigation, route }: SelectCoinProps) {
  const styles = useStyles();
  const inputRef = useRef<TextInput>(null);

  const onCoinPress = (coin: AccountCoinResource) => {
    inputRef.current?.blur();
    navigation.navigate('SendFlow3', {
      coinInfo: coin.info,
      contact: route.params.contact,
    });
  };

  const { activeAccountAddress } = useActiveAccount();
  const coinResources = useAccountCoinResources(activeAccountAddress);
  const { onQueryChange, result: filteredCoins } = useSearchCoin(
    coinResources.data,
  );

  const renderCoinList = () => {
    switch (coinResources.status) {
      case 'idle':
      case 'loading': {
        return <ActivityIndicator />;
      }
      case 'error': {
        const errorMessage =
          coinResources.error instanceof Error
            ? coinResources.error.message
            : JSON.stringify(coinResources.error);
        return (
          <Typography
            variant="small"
            color="red.500"
            align="center"
            style={styles.coinListText}
          >
            {errorMessage}
          </Typography>
        );
      }
      case 'success':
      default: {
        if (coinResources.data.length === 0) {
          return (
            <BottomSafeAreaView style={{ justifyContent: 'center' }}>
              <EmptyState
                text={i18nmock('assets:sendFlow.noAvailableCoinsText')}
                subtext={i18nmock('assets:sendFlow.noAvailableCoinsSubtext')}
              />
            </BottomSafeAreaView>
          );
        }

        if (filteredCoins.length === 0) {
          return (
            <BottomSafeAreaView style={{ justifyContent: 'center' }}>
              <EmptyState
                text={i18nmock('assets:sendFlow.noMatchingCoinsText')}
                subtext={i18nmock('assets:sendFlow.noMatchingCoinsSubtext')}
              />
            </BottomSafeAreaView>
          );
        }

        return (
          <PetraKeyboardAwareScrollView>
            {filteredCoins.map((coin) => (
              <CoinListItem
                key={coin.type}
                coin={coin}
                onPress={() => onCoinPress(coin)}
              />
            ))}
          </PetraKeyboardAwareScrollView>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          ref={inputRef}
          style={styles.searchBar}
          onChangeText={onQueryChange}
          placeholder={i18nmock('assets:sendFlow.placeholderInputTextCoins')}
          placeholderTextColor={customColors.navy['500']}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          returnKeyType="search"
          clearButtonMode="always"
        />
        <View style={styles.searchBarIcon}>
          <SearchIconSVG size={16} color="navy.400" />
        </View>
      </View>
      <PetraKeyboardAvoidingView style={{ flex: 1 }}>
        {renderCoinList()}
      </PetraKeyboardAvoidingView>
    </View>
  );
}

const searchBarHeight = 48;

const useStyles = makeStyles((theme) => ({
  btnContainer: {
    backgroundColor: theme.background.secondary,
    marginTop: 12,
  },
  coinListText: {
    paddingHorizontal: PADDING.container,
  },
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  searchBar: {
    backgroundColor: customColors.navy['50'],
    borderRadius: Math.floor(searchBarHeight / 2),
    color: theme.typography.primary,
    flex: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    height: searchBarHeight,
    paddingHorizontal: PADDING.container,
    paddingLeft: 40,
  },
  searchBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: PADDING.container,
  },
  searchBarIcon: {
    paddingLeft: 32,
    position: 'absolute',
  },
}));
