// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react-hooks/exhaustive-deps */
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PetraPillButton } from 'core/components';
import { i18nmock } from 'strings';
import { customColors } from '@petra/core/colors';
import {
  ImportStackScreenProps,
  RootAuthenticatedStackScreenProps,
} from 'navigation/types';
import { useNavigation } from '@react-navigation/native';
import useKeyboard, { KeyboardState } from 'core/hooks/useKeyboard';
import { AptosAccount } from 'aptos';
import { generateMnemonicObject } from '@petra/core/utils/account';
import { useKeychain } from 'core/hooks/useKeychain';
import { usePetraToastContext } from 'core/providers/ToastProvider';
import PetraKeyboardAvoidingView from 'core/components/PetraKeyboardAvoidingView';
import BottomSafeAreaView from 'core/components/BottomSafeAreaView';
import makeStyles from 'core/utils/makeStyles';
import { testProps } from 'e2e/config/testProps';
import OnboardingInstruction from '../Shared/OnboardingInstruction';

type ImportMnemonicProps =
  | ImportStackScreenProps<'ImportMnemonic'>
  | RootAuthenticatedStackScreenProps<'AddAccountImportMnemonic'>;

const buttonHeight = 80;
function ImportMnemonic({ route }: ImportMnemonicProps) {
  const styles = useStyles();
  const [currentActiveIndex, setCurrentActiveIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { unlockedPassword } = useKeychain();
  const [mnemonicPhrases, setMnemonicPhrases] = useState<string[]>(
    Array(12).fill(''),
  );
  const mnemonicPhraseHasBeenFocussed = useRef<boolean[]>(
    Array(12).fill(false),
  );
  const navigation = useNavigation();
  const { showDangerToast } = usePetraToastContext();
  const bottomOffSet = useRef(new Animated.Value(0)).current;
  const { keyboardStatus, openKeyboardHeight } = useKeyboard();

  const ref1 = useRef<TextInput>();
  const ref2 = useRef<TextInput>();
  const ref3 = useRef<TextInput>();
  const ref4 = useRef<TextInput>();
  const ref5 = useRef<TextInput>();
  const ref6 = useRef<TextInput>();
  const ref7 = useRef<TextInput>();
  const ref8 = useRef<TextInput>();
  const ref9 = useRef<TextInput>();
  const ref10 = useRef<TextInput>();
  const ref11 = useRef<TextInput>();
  const ref12 = useRef<TextInput>();

  useEffect(() => {
    const animateKeyboardHide = () => {
      Animated.timing(bottomOffSet, {
        duration: 0,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    };

    const animateKeyboardShow = () => {
      Animated.timing(bottomOffSet, {
        duration: 0,
        toValue: openKeyboardHeight,
        useNativeDriver: false,
      }).start();
    };

    if (keyboardStatus === KeyboardState.CLOSED) {
      animateKeyboardHide();
    } else {
      animateKeyboardShow();
    }
  }, [keyboardStatus]);
  const refFromIndex = (idx: number) => {
    switch (idx) {
      case 0:
        return ref1;
      case 1:
        return ref2;
      case 2:
        return ref3;
      case 3:
        return ref4;
      case 4:
        return ref5;
      case 5:
        return ref6;
      case 6:
        return ref7;
      case 7:
        return ref8;
      case 8:
        return ref9;
      case 9:
        return ref10;
      case 10:
        return ref11;
      case 11:
        return ref12;
      default:
        return null;
    }
  };

  const onSubmitPress = async () => {
    const mnemonicString: string = mnemonicPhrases.join(' ').trim();

    try {
      setIsLoading(true);
      // verify if the mnemonic phrase is correct before navigating away
      // by putting the encodedKey inside Aptos Account
      const { mnemonic, seed } = await generateMnemonicObject(mnemonicString);
      // eslint-disable-next-line no-new
      new AptosAccount(seed);

      // if user navigating to next page and there is still an active index, unset it
      if (currentActiveIndex !== -1) {
        setCurrentActiveIndex(-1);
      }

      if (route.params.isAddAccount) {
        navigation.navigate('ImportWalletChooseAccountName', {
          fromRoute: 'ImportWallet',
          isAddAccount: true,
          mnemonic,
          privateKey: undefined,
        });
      } else if (unlockedPassword !== undefined) {
        navigation.navigate('ImportWalletChooseAccountName', {
          confirmedPassword: unlockedPassword,
          fromRoute: 'ImportWalletPasswordCreation',
          isAddAccount: false,
          mnemonic,
          privateKey: undefined,
        });
      } else {
        navigation.navigate('ImportWalletPasswordCreation', {
          mnemonic,
          privateKey: undefined,
        });
      }
    } catch (e) {
      showDangerToast({
        hideOnPress: true,
        text: i18nmock('onboarding:importWallet.importMnemonic.toast'),
        toastPosition: 'bottomWithButton',
      });
    }
    setIsLoading(false);
  };

  const handleOnPaste = (content: string) => {
    const words = content
      .trim()
      .split(' ')
      .map((word: string) => word.toLowerCase());

    setMnemonicPhrases(words);
    Keyboard.dismiss();
    setCurrentActiveIndex(-1);
  };

  const handleOnChangeText = (text: string) => {
    // determine if the user is pasting an existing mnemonic by checking the length
    // of the text split on a space
    if (text.trim().split(' ').length === 12) {
      handleOnPaste(text);
    } else {
      const scrubbedText: string = text.toLowerCase().replace(/[^a-z]/g, '');
      mnemonicPhrases[currentActiveIndex] = scrubbedText;

      setMnemonicPhrases([...mnemonicPhrases]);
    }
  };

  const handleOnSubmitEditing = (currentIdx: number) => {
    // focus on the next field for all indeces except the last index (11)
    if (currentIdx === 11) {
      Keyboard.dismiss();
      setCurrentActiveIndex(-1);
    } else {
      // as an input becomes unfocussed, add it to the ref of hasBeenFocussedIndeces
      // if a user accidentally skips a field or doesn't fill it out, make it red
      mnemonicPhraseHasBeenFocussed.current[currentIdx] = true;

      // focus on next ref
      const nextRef = refFromIndex(currentIdx + 1);
      nextRef?.current?.focus();
    }
  };

  const isErrorInput = (idx: number) =>
    mnemonicPhraseHasBeenFocussed.current[idx] && mnemonicPhrases[idx] === '';

  const handleTextInputFocused = (id: number) => {
    setCurrentActiveIndex(id);
  };

  const renderTextInput = (phrase: string, idx: number) => (
    <View
      style={[
        styles.textInputContainer,
        currentActiveIndex === idx
          ? { borderColor: customColors.navy['900'] }
          : { borderColor: customColors.navy['100'] },
      ]}
      key={idx}
    >
      <View
        style={[
          styles.textInputNumberContainer,
          isErrorInput(idx) ? styles.errorNumber : null,
        ]}
      >
        <Text style={styles.textInputNumberText}>{`${idx + 1}.`}</Text>
      </View>
      <TextInput
        style={[styles.textInput, isErrorInput(idx) ? styles.errorInput : null]}
        ref={refFromIndex(idx) as MutableRefObject<TextInput>}
        value={phrase}
        blurOnSubmit={idx >= 11}
        onFocus={() => handleTextInputFocused(idx)}
        onChangeText={handleOnChangeText}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        onSubmitEditing={() => handleOnSubmitEditing(idx)}
        spellCheck={false}
        returnKeyType={idx < 11 ? 'next' : 'done'}
        {...testProps(`input-mnemonic-word-${idx}`)}
      />
    </View>
  );

  return (
    <BottomSafeAreaView
      style={styles.bottomSafeArea}
      {...testProps('ImportMnemonic-screen')}
    >
      <PetraKeyboardAvoidingView style={styles.container}>
        <View style={styles.body}>
          <ScrollView>
            <OnboardingInstruction
              title={i18nmock('onboarding:importWallet.importMnemonic.title')}
              subtext=""
            />
            <View style={styles.bodyContent}>
              <View style={styles.column}>
                {mnemonicPhrases.map((phrase: string, idx: number) => {
                  if (idx < 6) {
                    return renderTextInput(phrase, idx);
                  }
                  return null;
                })}
              </View>
              <View style={[styles.column, { justifyContent: 'flex-end' }]}>
                {mnemonicPhrases.map((phrase: string, idx: number) => {
                  if (idx > 5) {
                    return renderTextInput(phrase, idx);
                  }
                  return null;
                })}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <PetraPillButton
            accessibilityLabel={i18nmock('general:submit')}
            disabled={mnemonicPhrases.some((el: string) => el === '')}
            isLoading={isLoading}
            onPress={onSubmitPress}
            text={i18nmock('general:next')}
          />
        </View>
      </PetraKeyboardAvoidingView>
    </BottomSafeAreaView>
  );
}

export default ImportMnemonic;

const useStyles = makeStyles((theme) => ({
  animatedButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: buttonHeight,
    paddingHorizontal: 16,
    width: '100%',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  bodyContent: {
    flexDirection: 'row',
    paddingTop: 10,
    width: '100%',
  },
  bottomSafeArea: {
    backgroundColor: theme.background.secondary,
  },
  column: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.background.secondary,
  },
  errorInput: {
    borderBottomColor: theme.palette.error,
    borderRightColor: theme.palette.error,
    borderTopColor: theme.palette.error,
  },
  errorNumber: {
    borderBottomColor: theme.palette.error,
    borderLeftColor: theme.palette.error,
    borderTopColor: theme.palette.error,
  },
  footer: {
    flexShrink: 0,
    padding: 16,
  },
  keyboardContainer: {
    flex: 1,
    overflow: 'visible',
    paddingHorizontal: 16,
    width: '100%',
  },
  textInput: {
    color: customColors.navy['800'],
    flex: 5,
    minHeight: 30,
  },
  textInputContainer: {
    backgroundColor: theme.background.tertiary,
    borderColor: customColors.navy['200'],
    borderRadius: 48,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 4,
    minHeight: 48,
    padding: 4,
  },
  textInputNumberContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  textInputNumberText: {
    color: customColors.navy['500'],
    fontSize: 16,
    textAlign: 'center',
  },
}));
