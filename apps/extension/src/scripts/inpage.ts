// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { PetraApiClient } from '@petra/core/api';

(window as any).aptos = new PetraApiClient();
(window as any).petra = (window as any).aptos;
