// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import makeIcon from './makeIcon';

export default makeIcon('AptosLogoSVG', ({ color, size = 35 }) => (
  <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
    <Path
      d="M26.4879 11.4425H23.4629C23.1106 11.4425 22.7755 11.292 22.5421 11.0295L21.3151 9.64869C21.1322 9.44264 20.8697 9.32465 20.5935 9.32465C20.3174 9.32465 20.0549 9.44264 19.8719 9.64869L18.8194 10.8329C18.4748 11.2202 17.9806 11.4425 17.4608 11.4425H0.902003C0.430897 12.7814 0.123097 14.1956 -2.28882e-05 15.6636H15.632C15.9064 15.6636 16.1698 15.5516 16.3596 15.3541L17.8156 13.8408C17.9977 13.6518 18.2483 13.5449 18.5116 13.5449H18.5714C18.8476 13.5449 19.1101 13.6629 19.2931 13.869L20.52 15.2498C20.7534 15.5123 21.0886 15.6628 21.4408 15.6628H34.2C34.0769 14.1956 33.7699 12.7806 33.298 11.4416H26.487L26.4879 11.4425Z"
      fill={color}
    />
    <Path
      d="M9.45971 24.5385C9.73416 24.5385 9.9975 24.4265 10.1873 24.229L11.6434 22.7157C11.8255 22.5267 12.076 22.4198 12.3385 22.4198H12.3983C12.6745 22.4198 12.937 22.5378 13.12 22.7439L14.3469 24.1247C14.5803 24.3872 14.9155 24.5377 15.2677 24.5377H32.5593C33.2065 23.2047 33.6819 21.7734 33.964 20.2746H17.3668C17.0145 20.2746 16.6793 20.1242 16.4459 19.8617L15.219 18.4808C15.036 18.2748 14.7735 18.1568 14.4974 18.1568C14.2212 18.1568 13.9587 18.2748 13.7758 18.4808L12.7232 19.665C12.3787 20.0523 11.8845 20.2746 11.3647 20.2746H0.235107C0.518112 21.7734 0.992637 23.2047 1.63987 24.5377H9.45885L9.45971 24.5385Z"
      fill={color}
    />
    <Path
      d="M21.7264 6.82974C22.0009 6.82974 22.2642 6.71774 22.454 6.52023L23.9101 5.00688C24.0922 4.81793 24.3427 4.71105 24.606 4.71105H24.6659C24.9421 4.71105 25.2045 4.82904 25.3875 5.0351L26.6144 6.41592C26.8479 6.67841 27.183 6.82889 27.5353 6.82889H30.8236C27.6917 2.68214 22.7105 0 17.1 0C11.4895 0 6.50825 2.68214 3.37638 6.82889L21.7264 6.82974Z"
      fill={color}
    />
    <Path
      d="M10.6242 28.764C10.272 28.764 9.9368 28.6135 9.70338 28.351L8.47645 26.9702C8.29348 26.7641 8.031 26.6461 7.75483 26.6461C7.47867 26.6461 7.21618 26.7641 7.03321 26.9702L5.98071 28.1543C5.63614 28.5417 5.14195 28.764 4.62211 28.764H4.552C7.68472 32.1079 12.1461 34.2009 17.1 34.2009C22.0539 34.2009 26.5144 32.1079 29.648 28.764H10.6242Z"
      fill={color}
    />
  </Svg>
));