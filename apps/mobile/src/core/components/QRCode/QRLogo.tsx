// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ImageSourcePropType } from 'react-native';

import { ClipPath, Defs, G, Image, Rect } from 'react-native-svg';

interface QRLogoProps {
  logo: ImageSourcePropType;
  logoBackgroundColor: string;
  logoBorderRadius: number;
  logoMargin: number;
  logoSize: number;
  size: number;
}

function QRLogo({
  logo,
  logoBackgroundColor,
  logoBorderRadius,
  logoMargin,
  logoSize,
  size,
}: QRLogoProps): JSX.Element {
  const logoPosition = (size - logoSize - logoMargin * 2) / 2;
  const logoBackgroundSize = logoSize + logoMargin * 2;
  const logoBackgroundBorderRadius =
    logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius;

  return (
    <G x={logoPosition} y={logoPosition}>
      <Defs>
        <ClipPath id="clip-logo-background">
          <Rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            rx={logoBackgroundBorderRadius}
            ry={logoBackgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id="clip-logo">
          <Rect
            width={logoSize}
            height={logoSize}
            rx={logoBorderRadius}
            ry={logoBorderRadius}
          />
        </ClipPath>
      </Defs>
      <G>
        <Rect
          width={logoBackgroundSize}
          height={logoBackgroundSize}
          fill={logoBackgroundColor}
          clipPath="url(#clip-logo-background)"
        />
      </G>
      <G x={logoMargin} y={logoMargin}>
        <Image
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid slice"
          href={logo}
          clipPath="url(#clip-logo)"
        />
      </G>
    </G>
  );
}

export default QRLogo;
