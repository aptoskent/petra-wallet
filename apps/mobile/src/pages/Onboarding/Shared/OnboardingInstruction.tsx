// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import Typography from 'core/components/Typography';
import { testProps } from 'e2e/config/testProps';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface OnboardingInstructionProps {
  boldText?: string;
  onPressUnderlineText?: () => void;
  subtext: string;
  title: string;
  underlineText?: string;
}

function OnboardingInstruction({
  boldText,
  onPressUnderlineText,
  subtext,
  title,
  underlineText,
}: OnboardingInstructionProps) {
  return (
    <>
      <Typography
        variant="display"
        color="navy.900"
        style={styles.title}
        {...testProps('onboarding-instruction-title')}
      >
        {title}
      </Typography>
      {subtext ? (
        <Typography
          color="navy.900"
          style={styles.subtext}
          {...testProps('onboarding-instruction-subtext')}
        >
          {`${subtext} `}
          {boldText ? (
            <Typography
              color="navy.900"
              weight="600"
              style={styles.subtext}
            >{`${boldText} `}</Typography>
          ) : null}
          {underlineText ? (
            <TouchableOpacity onPress={onPressUnderlineText}>
              <Typography
                underline
                color="navy.900"
                weight="600"
                style={styles.subtext}
                {...testProps('onboarding-instruction-underlinetext')}
              >
                {underlineText}
              </Typography>
            </TouchableOpacity>
          ) : null}
        </Typography>
      ) : null}
    </>
  );
}

export default OnboardingInstruction;

const styles = StyleSheet.create({
  subtext: {
    marginTop: 8,
  },
  title: {
    lineHeight: 36,
  },
});
