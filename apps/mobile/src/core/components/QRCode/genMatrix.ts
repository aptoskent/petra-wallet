// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import QRCode, { QRCodeErrorCorrectionLevel } from 'qrcode';

/**
 * Generates a matrix of 1s and 0s from a QR code value.
 *
 * @param {string} value The value to generate a QR code from.
 * @param {string} errorCorrectionLevel The error correction level
 */
export default (
  value: string | QRCode.QRCodeSegment[],
  errorCorrectionLevel: QRCodeErrorCorrectionLevel,
): number[][] => {
  const arr = Array.prototype.slice.call(
    QRCode.create(value, { errorCorrectionLevel }).modules.data,
    0,
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    [],
  );
};
