// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions

// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';

// jsdom does not define these objects.
import { TextDecoder, TextEncoder } from 'util';

// @ts-ignore
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
