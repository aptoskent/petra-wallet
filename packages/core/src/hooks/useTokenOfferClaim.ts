// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import constate from 'constate';
import { useState } from 'react';

import { TokenClaim } from '../types';

export const [TokenOfferClaimProvider, useTokenOfferClaim] = constate(() => {
  const [acceptingPendingTokenOffer, setAcceptingPendingTokenOffer] =
    useState<TokenClaim>();
  const [cancelingPendingTokenOffer, setCancelingPendingTokenOffer] =
    useState<TokenClaim>();

  return {
    acceptingPendingTokenOffer,
    cancelingPendingTokenOffer,
    setAcceptingPendingTokenOffer,
    setCancelingPendingTokenOffer,
  };
});
