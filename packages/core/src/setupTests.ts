// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// jsdom does not define these objects.
import { TextDecoder, TextEncoder } from 'util';

// @ts-ignore
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
