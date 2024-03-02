// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import Cluster from 'core/components/Layouts/Cluster';
import Typography from 'core/components/Typography';
import { usePrompt } from 'core/providers/PromptProvider';
import { useTheme } from 'core/providers/ThemeProvider';
import { TouchableOpacity, View } from 'react-native';
import { HIT_SLOPS } from 'shared';
import { InfoCircleEmptyIconSVG } from 'shared/assets/svgs';

type Size = 'xsmall' | 'small' | 'body';
type Color = 'muted' | 'primary' | 'error' | 'green';

/**
 * The base class that others utilize to make more specific
 * and easier to consume components
 */
export interface StakingFacetProps {
  align?: 'left' | 'right';
  /** Makes both the title and subtitle bold */
  bold?: boolean;
  /** Determines the color of both the title and subtitle */
  color?: Color;
  /** If this element should break into multiple lines or force others to */
  flexPriority?: boolean;

  /**
   * If this is true, an informational icon is rendered
   * and an onPress even triggers it to show a bottom sheet.
   */
  renderBottomSheetContent?: () => JSX.Element;

  // Subtitle specific props
  subtitle?: string;
  subtitleBold?: boolean;
  subtitleColor?: Color;
  subtitleSize?: Size;

  // Title specific props
  title: string;
  titleBold?: boolean;
  titleColor?: Color;
  titleSize?: Size;
}

export function StakingFacet({
  align = 'left',
  bold,
  color = 'muted',
  flexPriority,
  renderBottomSheetContent,
  subtitle,
  subtitleBold,
  subtitleColor,
  subtitleSize,
  title,
  titleBold,
  titleColor,
  titleSize = 'body',
}: StakingFacetProps) {
  const { theme } = useTheme();
  const { promptVisible, setPromptContent, setPromptVisible } = usePrompt();

  const togglePrompt = useCallback(() => {
    if (!promptVisible && renderBottomSheetContent) {
      setPromptContent(renderBottomSheetContent());
      setPromptVisible(true);
    } else {
      setPromptVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPromptVisible]);

  const colors: Record<Color, string> = {
    error: theme.palette.error,
    green: theme.palette.success,
    muted: theme.typography.primaryDisabled,
    primary: theme.typography.primary,
  };

  const iconSize: Record<Size, number> = {
    body: 14,
    small: 12,
    xsmall: 10,
  };

  return (
    <Cluster
      noWrap
      space={4}
      justify={align === 'left' ? 'flex-start' : 'flex-end'}
      align="flex-start"
      style={{
        flex: flexPriority ? 2 : 1,
        flexShrink: flexPriority ? 0 : 1,
      }}
    >
      <View
        style={{
          flexShrink: flexPriority ? 0 : 1,
        }}
      >
        <Typography
          variant={titleSize}
          weight={titleBold || bold ? '600' : '400'}
          color={colors[titleColor || color]}
          align={align}
        >
          {title}
        </Typography>

        {subtitle ? (
          <Typography
            variant={subtitleSize}
            weight={subtitleBold || bold ? '600' : '400'}
            color={colors[subtitleColor || color]}
            align={align}
          >
            {subtitle}
          </Typography>
        ) : null}
      </View>

      {renderBottomSheetContent ? (
        <TouchableOpacity hitSlop={HIT_SLOPS.midSlop} onPress={togglePrompt}>
          <View style={{ position: 'relative', top: 5 }}>
            <InfoCircleEmptyIconSVG
              size={iconSize[titleSize]}
              color={colors[titleColor || color]}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </Cluster>
  );
}
