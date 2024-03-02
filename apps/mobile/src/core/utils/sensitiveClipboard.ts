// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import { NativeModules } from 'react-native';

const { SensitiveClipboard } = NativeModules;
interface SensitiveClipboardInterface {
  /**
   * Set content of string type and have it be cleared after `duration` (seconds).
   * You can use following code to set clipboard content
   *
   * `Clipboard.setString('hello world', 5); // Cleared after 5 seconds`
   *
   * @param content the content to be stored in the clipboard.
   * @param duration the duration in seconds for which the content should be stored.
   */
  setString: (content: string, duration: number) => Promise<void>;
}
/**
 * A secure `Clipboard` implementation that can be used to store sensitive data.
 */
export default SensitiveClipboard as SensitiveClipboardInterface;
