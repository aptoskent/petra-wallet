// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGElement>
  >;
  const url: string;
  export default url;
}

declare module '*.png' {
  const url: string;
  export default url;
}
