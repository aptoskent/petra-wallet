// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/**
 * Removes the center square of cells from the matrix.
 *
 * @param {number[][]} matrix The matrix to remove the center square from.
 * @param {number} cells The number of cells to remove from the center of the matrix.
 */
export default (e: number[][], cells: number) => {
  const matrix = e;

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  // Ensure that the logoWidth is valid and not larger than the array dimensions
  const width = Math.min(cells, numRows, numCols);

  // Calculate the starting row and column indices for the square
  const startRow = Math.floor((numRows - width) / 2);
  const startCol = Math.floor((numCols - width) / 2);

  // Remove the square of cells from the array
  for (let row = startRow; row < startRow + width; row += 1) {
    for (let col = startCol; col < startCol + width; col += 1) {
      matrix[row][col] = 0;
    }
  }

  return matrix;
};
