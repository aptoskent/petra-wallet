// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line max-classes-per-file
class Pipe<T> {
  private buffer: T[] = [];

  private resolve?: (value: T) => void;

  push(value: T) {
    if (this.resolve !== undefined) {
      this.resolve(value);
      this.resolve = undefined;
    } else {
      this.buffer.push(value);
    }
  }

  async pop() {
    if (this.buffer.length > 0) {
      return this.buffer.shift()!;
    }
    return new Promise<T>((resolve) => {
      this.resolve = resolve;
    });
  }
}

type MessageListener = (this: Window, event: { data: any }) => void;

export default class MockWindow {
  postMessage = jest.spyOn(window, 'postMessage');

  addEventListener = jest.spyOn(window, 'addEventListener');

  removeEventListener = jest.spyOn(window, 'removeEventListener');

  private messagePipe = new Pipe<any>();

  private listenerPipe = new Pipe<MessageListener>();

  readonly listeners: Set<MessageListener> = new Set();

  constructor() {
    this.postMessage.mockImplementation((message) => {
      this.messagePipe.push(message);
    });

    this.addEventListener.mockImplementation((type, listener: any) => {
      expect(type).toEqual('message');
      this.listenerPipe.push(listener);
    });

    this.removeEventListener.mockImplementation((type, listener: any) => {
      expect(type).toEqual('message');
      expect(this.listeners.has(listener)).toBeTruthy();
      this.listeners.delete(listener);
    });
  }

  async waitForMessage() {
    const message = this.messagePipe.pop();
    expect(this.postMessage).toHaveBeenCalled();
    return message;
  }

  async sendMessage(response: any) {
    const listener = await this.listenerPipe.pop();
    expect(this.addEventListener).toHaveBeenCalled();
    this.listeners.add(listener);
    listener.call(window, { data: response });
  }
}
