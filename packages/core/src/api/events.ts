// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

export interface AccountChangeEventArgs {
  address: string;
  publicKey: string;
}

export interface NetworkChangeEventArgs {
  chainId?: string;
  name: string;
  url?: string;
}

type PetraEventNameToArgs = {
  accountChange: AccountChangeEventArgs;
  disconnect: undefined;
  networkChange: NetworkChangeEventArgs;
};

export type PetraEventName = keyof PetraEventNameToArgs;
export type PetraEventArgs<EventName extends PetraEventName> =
  PetraEventNameToArgs[EventName];

export type PetraEvents = {
  [EventName in PetraEventName]: {
    args: PetraEventArgs<EventName>;
    name: EventName;
  };
};

export type PetraEvent = PetraEvents[PetraEventName];

export function isPetraEvent(event?: any): event is PetraEvent {
  return event !== undefined && typeof event.name === 'string';
}
