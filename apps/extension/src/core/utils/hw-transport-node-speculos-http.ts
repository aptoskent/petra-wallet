// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
import axios, { AxiosInstance } from 'axios';
import Transport from '@ledgerhq/hw-transport';

export type SpeculosHttpTransportOpts = {
  baseURL?: string;
  timeout?: number;
};

/**
 * Speculos TCP transport implementation
 *
 * @example
 * import SpeculosHttpTransport from "@ledgerhq/hw-transport-node-speculos-http";
 * const transport = await SpeculosHttpTransport.open();
 * const res = await transport.send(0xE0, 0x01, 0, 0);
 */
export default class HwTransportNodeSpeculosHttp extends Transport {
  instance: AxiosInstance;

  opts: SpeculosHttpTransportOpts;

  eventStream: any; // ReadStream?

  constructor(instance: AxiosInstance, opts: SpeculosHttpTransportOpts) {
    super();
    this.instance = instance;
    this.opts = opts;
  }

  static isSupported = (): Promise<boolean> => Promise.resolve(true);

  // this transport is not discoverable
  static list = (): any => Promise.resolve([]);

  static listen = () => ({
    unsubscribe: () => {},
  });

  static open = (
    opts: SpeculosHttpTransportOpts,
  ): Promise<HwTransportNodeSpeculosHttp> =>
    new Promise((resolve) => {
      const resolvedOpts = {
        baseURL: 'http://localhost:5000',
        ...opts,
      };

      const instance = axios.create(resolvedOpts);
      const transport = new HwTransportNodeSpeculosHttp(instance, opts);
      resolve(transport);
    });

  /**
   * Press and release button
   * buttons available: left, right, both
   * @param {*} but
   */
  button = (but: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const action = { action: 'press-and-release' };
      this.instance
        .post(`/button/${but}`, action)
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });

  async exchange(apdu: Buffer): Promise<any> {
    const hex = apdu.toString('hex');
    return this.instance.post('/apdu', { data: hex }).then((r) => {
      // r.data is {"data": "hex value of response"}
      const { data } = r.data;
      return Buffer.from(data, 'hex');
    });
  }

  async close() {
    // close event stream
    if (this.eventStream) {
      this.eventStream.destroy();
    }
  }
}
