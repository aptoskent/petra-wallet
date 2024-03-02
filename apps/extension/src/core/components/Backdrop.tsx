// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { LegacyRef, forwardRef, ReactEventHandler } from 'react';
import { Box } from '@chakra-ui/react';
import { type TransitionStatus } from 'react-transition-group';
import styled from '@emotion/styled';
import { transparentize } from 'color2k';
import { customColors } from '@petra/core/colors';

interface BackdropProps {
  children: JSX.Element;
  onClick: ReactEventHandler<HTMLDivElement>;
  state: TransitionStatus;
}

const transitionStyles = {
  entered: {
    backgroundColor: transparentize(customColors.navy[900], 0.5),
    zIndex: 2,
  },
  entering: {
    backgroundColor: transparentize(customColors.navy[900], 0.2),
    zIndex: -2,
  },
  exited: {},
  exiting: {},
  unmounted: {},
};

const BackdropStyled = styled(Box)`
  transition: background-color 500ms ease-in-out, z-index 500ms ease-in-out;
  z-index: -2;
  ${(props: { state: TransitionStatus }) => transitionStyles[props.state]}
`;

const Backdrop = forwardRef(
  ({ children, onClick, state }: BackdropProps, ref) => (
    <BackdropStyled
      ref={ref as LegacyRef<HTMLDivElement>}
      className="modal-backdrop"
      display="flex"
      flexDirection="column-reverse"
      bgColor={transparentize(customColors.navy[900], 0.1)}
      backdropFilter="blur(1rem)"
      width="375px"
      height="600px"
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      zIndex="2"
      mt={0}
      state={state}
      onClick={onClick}
    >
      {children}
    </BackdropStyled>
  ),
);

export default Backdrop;
