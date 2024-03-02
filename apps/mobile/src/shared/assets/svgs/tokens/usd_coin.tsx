// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon from 'shared/assets/svgs/makeIcon';

export default makeIcon('USDCoin', ({ size = 44 }) => (
  <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <Path
      d="M0 22C0 9.84974 9.84974 0 22 0C34.1503 0 44 9.84974 44 22C44 34.1503 34.1503 44 22 44C9.84974 44 0 34.1503 0 22Z"
      fill="#2775CA"
    />
    <Path
      d="M28.3092 25.0828C28.3092 21.8752 26.3842 20.7752 22.5342 20.3154C19.7842 19.948 19.2342 19.2154 19.2342 17.9328C19.2342 16.6502 20.1516 15.8252 21.9842 15.8252C23.6342 15.8252 24.5516 16.3752 25.0092 17.7502C25.1016 18.0252 25.3766 18.2078 25.6516 18.2078H27.119C27.4864 18.2078 27.7614 17.9328 27.7614 17.5654V17.473C27.394 15.4556 25.744 13.898 23.6364 13.7154V11.5154C23.6364 11.148 23.3614 10.873 22.9038 10.7828H21.5288C21.1614 10.7828 20.8864 11.0578 20.7962 11.5154V13.623C18.0462 13.9904 16.3038 15.823 16.3038 18.1154C16.3038 21.1404 18.1364 22.3328 21.9864 22.7904C24.5538 23.248 25.3788 23.798 25.3788 25.2654C25.3788 26.7328 24.0962 27.7404 22.3538 27.7404C19.9712 27.7404 19.1462 26.7328 18.8712 25.3578C18.7788 24.9904 18.5038 24.8078 18.2288 24.8078H16.6712C16.3038 24.8078 16.0288 25.0828 16.0288 25.4502V25.5426C16.3962 27.835 17.8614 29.485 20.8864 29.9426V32.1426C20.8864 32.51 21.1614 32.785 21.619 32.8752H22.994C23.3614 32.8752 23.6364 32.6002 23.7266 32.1426V29.9426C26.4744 29.4828 28.3092 27.5578 28.3092 25.0828Z"
      fill="white"
    />
    <Path
      d="M17.5842 34.7078C10.4342 32.1404 6.76682 24.1654 9.42662 17.1078C10.8016 13.2578 13.8266 10.3252 17.5842 8.95018C17.9516 8.76758 18.1342 8.49258 18.1342 8.03278V6.75018C18.1342 6.38278 17.9516 6.10778 17.5842 6.01758C17.4918 6.01758 17.3092 6.01758 17.2168 6.10998C8.50922 8.85998 3.74182 18.1176 6.49182 26.8274C8.14182 31.96 12.0842 35.9024 17.2168 37.5524C17.5842 37.735 17.9494 37.5524 18.0418 37.185C18.1342 37.0926 18.1342 37.0024 18.1342 36.8176V35.535C18.1342 35.2578 17.8592 34.8926 17.5842 34.7078ZM27.2994 6.10778C26.932 5.92518 26.5668 6.10778 26.4744 6.47518C26.382 6.56758 26.382 6.65778 26.382 6.84258V8.12518C26.382 8.49258 26.657 8.85778 26.932 9.04258C34.082 11.61 37.7494 19.585 35.0896 26.6426C33.7146 30.4926 30.6896 33.4252 26.932 34.8002C26.5646 34.9828 26.382 35.2578 26.382 35.7176V37.0002C26.382 37.3676 26.5646 37.6426 26.932 37.7328C27.0244 37.7328 27.207 37.7328 27.2994 37.6404C36.007 34.8904 40.7744 25.6328 38.0244 16.923C36.3744 11.7002 32.3418 7.75778 27.2994 6.10778Z"
      fill="white"
    />
  </Svg>
));
