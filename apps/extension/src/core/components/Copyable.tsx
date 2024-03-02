// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Tooltip, useClipboard, As } from '@chakra-ui/react';

export const defaultTimeout = 500;
export const defaultOpenDelay = 300;

interface CopyableProps {
  as?: As;
  children: React.ReactNode | React.ReactNode[];
  copiedPrompt?: string;
  height?: string;
  openDelay?: number;
  prompt?: JSX.Element;
  timeout?: number;
  value: any;
  width?: string;
}

/**
 * Copy the specified `value` when children are clicked, and give feedback with a tooltip
 * @constructor
 */
export default function Copyable({
  as,
  children,
  height,
  value,
  width,
  ...options
}: CopyableProps) {
  const prompt = options.prompt ?? <FormattedMessage defaultMessage="Copy" />;
  const copiedPrompt = options.copiedPrompt ?? (
    <FormattedMessage defaultMessage="Copied!" />
  );
  const timeout = options.timeout ?? defaultTimeout;
  const openDelay = options.openDelay ?? defaultOpenDelay;

  const { hasCopied, onCopy } = useClipboard(value, { timeout });

  // Callback wrapper to prevent bubbling up
  const onClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onCopy();
  };

  return (
    <Box
      cursor="pointer"
      onClick={onClick}
      as={as || 'span'}
      width={width}
      height={height}
    >
      <Tooltip
        label={hasCopied ? copiedPrompt : prompt}
        isOpen={hasCopied || undefined}
        openDelay={openDelay}
      >
        {children}
      </Tooltip>
    </Box>
  );
}
