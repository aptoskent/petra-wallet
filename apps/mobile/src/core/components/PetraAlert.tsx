// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  AlertButton,
} from 'react-native';
import { customColors } from '@petra/core/colors';
import { i18nmock } from 'strings';
import { BlurView } from '@react-native-community/blur';
import { testProps } from 'e2e/config/testProps';
import { PADDING } from 'shared/constants';
import Typography from './Typography';
import PetraPillButton, { PillButtonDesign } from './PetraPillButton';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const styleForAlertButton = (button: AlertButton) => {
  if (button.style === 'default') {
    return PillButtonDesign.default;
  }
  if (button.style === 'cancel') {
    return PillButtonDesign.clearWithDarkText;
  }
  return PillButtonDesign.default;
};

type PetraAlertButton = AlertButton & { isLoading?: boolean; testId?: string };

export interface PetraAlertProps {
  body?: JSX.Element;
  buttons: PetraAlertButton[];
  dismissAlertModal: () => void;
  dismissable?: boolean;
  headerStyle?: TextStyle;
  message?: string;
  renderIcon?: () => JSX.Element;
  stackButtons?: boolean;
  title: string;
  visible: boolean;
}

function PetraAlert({
  body,
  buttons,
  dismissAlertModal,
  dismissable,
  headerStyle,
  message,
  renderIcon,
  stackButtons = false,
  title,
  visible,
}: PetraAlertProps) {
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      visible={visible}
      presentationStyle="overFullScreen"
      transparent
    >
      <AnimatedBlurView
        style={{ alignSelf: 'stretch', flex: 1 }}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor={customColors.white}
      />
      <Pressable
        {...testProps('modal-overlay', true)}
        onPress={dismissAlertModal}
        disabled={!dismissable}
        style={[styles.background, StyleSheet.absoluteFill]}
      >
        <View>
          <View style={styles.modalView}>
            {renderIcon ? (
              <View style={styles.icon}>{renderIcon?.()}</View>
            ) : null}
            <Typography
              variant="heading"
              weight="700"
              color={customColors.navy['900']}
              style={headerStyle}
            >
              {title}
            </Typography>
            {body ?? (
              <Typography
                style={{ margin: 8, textAlign: 'center' }}
                variant="body"
                color={customColors.navy['900']}
              >
                {message}
              </Typography>
            )}
            {buttons.length ? (
              <View
                style={[
                  styles.bottomButtons,
                  stackButtons ? styles.stackButtons : null,
                ]}
              >
                {buttons.map((button) => (
                  <View
                    key={button.text}
                    style={{
                      flex: stackButtons ? 0 : 1,
                      marginHorizontal: stackButtons ? 0 : 4,
                      marginVertical: stackButtons ? 4 : 0,
                    }}
                  >
                    <PetraPillButton
                      buttonDesign={styleForAlertButton(button)}
                      onPress={button.onPress ?? dismissAlertModal}
                      text={button.text ?? i18nmock('general:ok')}
                      isLoading={button.isLoading ?? false}
                      testId={button.testId}
                    />
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    marginTop: 24,
    minHeight: 50,
  },
  icon: {
    paddingBottom: 24,
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    margin: PADDING.container,
    paddingHorizontal: 16,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  stackButtons: {
    flexDirection: 'column',
    width: '100%',
  },
});

export default PetraAlert;
