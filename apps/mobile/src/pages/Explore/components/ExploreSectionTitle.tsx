// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Typography, { TypographyProps } from 'core/components/Typography';

export default function ExploreSectionTitle({
  children,
  ...props
}: TypographyProps) {
  return (
    <Typography variant="bodyLarge" weight="600" color="navy.900" {...props}>
      {children}
    </Typography>
  );
}
