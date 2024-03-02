// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { ImageSourcePropType } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';
import QRLogo from './QRLogo';
import { QRMatrix, RoundedCornerMarker } from './QRMatrix';
import genMatrix from './genMatrix';
import removeMatrixCenter from './removeMatrixCenter';

export interface QRCodeProps {
  backgroundColor: string;
  color?: string;
  logo?: ImageSourcePropType;
  logoBackgroundColor?: string;
  logoBorderRadius?: number;
  logoMargin?: number;
  logoSize?: number;
  onError?: (error: unknown) => void;
  quietZone?: number;
  size?: number;
  value: string;
}

function QRCode({
  value = 'this is a QR code',
  size = 100,
  color = 'black',
  backgroundColor = 'white',
  logo,
  logoSize = size * 0.2,
  logoBackgroundColor = 'transparent',
  logoMargin = 0,
  logoBorderRadius = 0,
  quietZone = 0,
  onError,
}: QRCodeProps): JSX.Element | null {
  const result = useMemo(() => {
    try {
      const matrix = genMatrix(value, 'M');

      const cellSize = size / matrix.length;

      // Make sure the logo size is even
      let logoCells = (logoSize + logoMargin * 2) / cellSize;
      if (Math.floor(logoCells) % 2 === 1) logoCells += 1;

      return {
        cellSize,
        matrix: removeMatrixCenter(matrix, logoCells),
      };
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error);
      } else {
        // Pass the error when no handler presented
        throw error;
      }
    }

    return undefined;
  }, [value, size, logoSize, logoMargin, onError]);

  if (!result) return null;

  const { cellSize, matrix } = result;

  return (
    <Svg
      viewBox={[
        -quietZone,
        -quietZone,
        size + quietZone * 2,
        size + quietZone * 2,
      ].join(' ')}
      width={size}
      height={size}
    >
      <G>
        <Rect
          x={-quietZone}
          y={-quietZone}
          width={size + quietZone * 2}
          height={size + quietZone * 2}
          fill={backgroundColor}
        />
      </G>
      <G>
        {/* Render the matrix for the QRCode */}
        <QRMatrix cellSize={cellSize} matrix={matrix} color={color} />

        {/* Top Left */}
        <RoundedCornerMarker
          cellSize={cellSize}
          backgroundColor={backgroundColor}
          color={color}
        />

        {/* Top Right */}
        <RoundedCornerMarker
          cellSize={cellSize}
          backgroundColor={backgroundColor}
          color={color}
          translateX={size}
          transform="scale(-1, 1)"
        />

        {/* Bottom Left */}
        <RoundedCornerMarker
          cellSize={cellSize}
          backgroundColor={backgroundColor}
          color={color}
          translateY={size}
          transform="scale(1, -1)"
        />
      </G>

      {logo && (
        <QRLogo
          size={size}
          logo={logo}
          logoSize={logoSize}
          logoBackgroundColor={logoBackgroundColor}
          logoBorderRadius={logoBorderRadius}
          logoMargin={logoMargin}
        />
      )}
    </Svg>
  );
}

export default QRCode;
