// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { G, GProps, Path, Rect } from 'react-native-svg';

const getAdjustedValues = (cellSize: number) => ({
  cell: cellSize + cellSize * 0.02, // Adjusted cell to avoid gaps between cells
  halfCell: cellSize / 2 + cellSize * 0.02, // Adjusted halfCell to avoid gaps between cells
});

interface RoundedCornerMarkerProps extends GProps {
  backgroundColor: string;
  cellSize: number;
  color: string;
}

export function RoundedCornerMarker({
  backgroundColor,
  cellSize,
  color,
  ...props
}: RoundedCornerMarkerProps): JSX.Element {
  const { cell, halfCell } = getAdjustedValues(cellSize);

  const getArc = (endX: number, endY: number) =>
    `A ${cell * 2} ${cell * 2} 0 0 1 ${endX} ${endY}`;

  return (
    <G {...props}>
      {/* Background fill */}
      <Rect width={cell * 7} height={cell * 7} fill={backgroundColor} />

      {/* Marker */}
      <G>
        {/* Outer */}
        <Path
          d={`M ${cell * 2} ${halfCell} H${cell * 5} ${getArc(
            cell * 7 - halfCell,
            cell * 2,
          )} V${cell * 7 - halfCell} H${cell * 2} ${getArc(
            halfCell,
            cell * 5,
          )} V${cell * 2} ${getArc(cell * 2, halfCell)} z`}
          strokeWidth={cell}
          stroke={color}
          clipPath="url(#clip-corner-marker)"
        />

        {/* Inner */}
        <Rect
          x={cell * 2}
          y={cell * 2}
          width={cell * 3}
          height={cell * 3}
          rx={halfCell}
          ry={halfCell}
          fill={color}
          clipPath="url(#clip-corner-marker)"
        />
      </G>
    </G>
  );
}

interface QRMatrixProps {
  cellSize: number;
  color: string;
  matrix: number[][];
}

export function QRMatrix({
  cellSize,
  color,
  matrix,
}: QRMatrixProps): JSX.Element {
  const { cell, halfCell } = getAdjustedValues(cellSize);

  const elements: JSX.Element[] = [];

  const getArc = (endX: number, endY: number) =>
    `A ${halfCell} ${halfCell} 0 0 1 ${endX} ${endY}`;

  // Map each cell to a single Path element. Each element will have its individual
  // rounded corners based on its adjacent cells.
  matrix.forEach((row, rowIndex) =>
    row.forEach((column, columnIndex) => {
      // Valid cells are 1, invalid cells are 0
      if (column === 1) {
        const hasTopAdjacent =
          rowIndex > 0 && matrix[rowIndex - 1][columnIndex];
        const hasLeftAdjacent =
          columnIndex > 0 && matrix[rowIndex][columnIndex - 1];
        const hasBottomAdjacent =
          rowIndex < matrix.length - 1 && matrix[rowIndex + 1][columnIndex];
        const hasRightAdjacent =
          columnIndex < row.length - 1 && matrix[rowIndex][columnIndex + 1];

        // Rounded corners
        const topRightRounded = getArc(cell, halfCell);
        const bottomRightRounded = getArc(halfCell, cell);
        const bottomLeftRounded = getArc(0, halfCell);
        const topLeftRounded = getArc(halfCell, 0);

        // Sharp corners
        const topRight = `L ${cell} 0 L ${cell} ${halfCell}`;
        const bottomRight = `L ${cell} ${cell} L ${halfCell} ${cell}`;
        const bottomLeft = `L 0 ${cell} L 0 ${halfCell}`;
        const topLeft = `L 0 0 L ${halfCell} 0`;

        // If we have an adjacent, remove the rounded corresponding corners
        const top =
          hasTopAdjacent || hasRightAdjacent ? topRight : topRightRounded;
        const right =
          hasBottomAdjacent || hasRightAdjacent
            ? bottomRight
            : bottomRightRounded;
        const bottom =
          hasBottomAdjacent || hasLeftAdjacent ? bottomLeft : bottomLeftRounded;
        const left =
          hasTopAdjacent || hasLeftAdjacent ? topLeft : topLeftRounded;

        // Join the pathes
        const path = `M${halfCell} 0 ${top} ${right} ${bottom} ${left} Z`;

        // Add the element to the array
        elements.push(
          <G
            // eslint-disable-next-line react/no-array-index-key
            key={`${rowIndex}-${columnIndex}`}
            translateX={columnIndex * cellSize}
            translateY={rowIndex * cellSize}
            fill={color}
          >
            <Path d={path} />
          </G>,
        );
      }
    }),
  );

  return <>{elements.map((e) => e)}</>;
}
