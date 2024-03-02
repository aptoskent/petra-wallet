// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ApiError } from 'aptos';
import { Event, EventHandle } from '../types';
import useRestApi from '../hooks/useRestApi';

export const defaultEventQueryStep = 20;

interface EventProviderState {
  address: string;
  buffer: Event[];
  creationNum: number;
  cursor: number;
  isDone: boolean;
  isError: boolean;
}

/**
 * Factory for building an event provider that fetches events from the fullnode REST API.
 */
export default function useEventProviderFactory(
  eventQueryStep: number = defaultEventQueryStep,
) {
  const { getEvents } = useRestApi();

  return (eventHandle: EventHandle) => {
    const state: EventProviderState = {
      address: eventHandle.guid.id.addr,
      buffer: [],
      creationNum: Number(eventHandle.guid.id.creation_num),
      cursor: Number(eventHandle.counter),
      isDone: false,
      isError: false,
    };

    /**
     * Main method for fetching and buffering more events for the handle.
     * Returns the lowest version currently in the buffer
     */
    async function fetchMore() {
      // Load more events into current buffers
      const start = Math.max(state.cursor - eventQueryStep, 0);
      const limit = state.cursor - state.buffer.length - start;

      if (limit > 0 && !state.isError) {
        try {
          const newEvents = await getEvents(
            state.address,
            state.creationNum,
            start,
            limit,
          );
          state.buffer.push(...newEvents);
          if (newEvents.length !== limit) {
            // eslint-disable-next-line no-console
            console.error(`Expected ${limit} events, got ${newEvents.length}`);
            state.isError = true;
          }
        } catch (err) {
          if (err instanceof ApiError && err.errorCode === 'internal_error') {
            const { message } = JSON.parse(err.message);
            const match = message.match(/expected: \d+, actual: (\d+)$/);
            if (match) {
              const newStart = Number(match[1]);
              const newLimit = state.cursor - state.buffer.length - newStart;
              if (newLimit > 0) {
                const newEvents = await getEvents(
                  state.address,
                  state.creationNum,
                  newStart,
                  newLimit,
                );
                state.buffer.push(...newEvents);
              }
            }
          }
          state.isError = true;
        }
      }

      return !state.isError && state.buffer.length > 0
        ? state.buffer[state.buffer.length - 1].version
        : 0;
    }

    function extract(fromVersion: number) {
      const shouldNotExtract = (e: Event) => e.version < fromVersion;
      const firstIdxNotToExtract = state.buffer.findIndex((e) =>
        shouldNotExtract(e),
      );
      const nToExtract =
        firstIdxNotToExtract >= 0 ? firstIdxNotToExtract : state.buffer.length;
      const extracted = state.buffer.splice(0, nToExtract);

      state.cursor = Math.max(state.cursor - nToExtract, 0);
      state.isDone =
        (state.cursor === 0 || state.isError) && state.buffer.length === 0;
      return extracted;
    }

    return {
      creationNum: state.creationNum,
      extract,
      fetchMore,
      isDone: () => state.isDone,
    };
  };
}

export type EventProviderFactory = ReturnType<typeof useEventProviderFactory>;
export type EventProvider = ReturnType<EventProviderFactory>;
