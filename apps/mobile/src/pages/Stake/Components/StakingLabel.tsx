// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { usePrompt } from 'core/providers/PromptProvider';
import { I18nKey, i18nmock } from 'strings';
import DefinitionSheetContent from '../Sheets/DefinitionSheetContent';
import { StakingFacet, StakingFacetProps } from './StakingFacet';

export interface StakingLabelProps
  extends Omit<
    StakingFacetProps,
    'renderBottomSheetContent' | 'title' | 'subtitle'
  > {
  subtitle?: I18nKey;
  term?: {
    definition: I18nKey;
    title: I18nKey;
  };
  title: I18nKey;
}

export function StakingLabel({
  subtitle,
  term,
  title,
  ...props
}: StakingLabelProps) {
  const { setPromptVisible } = usePrompt();

  const renderBottomSheetContent = term
    ? () => (
        <DefinitionSheetContent
          definition={i18nmock(term.definition)}
          term={i18nmock(term.title)}
          dismiss={() => {
            setPromptVisible(false);
          }}
        />
      )
    : undefined;

  return (
    <StakingFacet
      {...props}
      title={i18nmock(title)}
      subtitle={subtitle ? i18nmock(subtitle) : undefined}
      renderBottomSheetContent={renderBottomSheetContent}
    />
  );
}
