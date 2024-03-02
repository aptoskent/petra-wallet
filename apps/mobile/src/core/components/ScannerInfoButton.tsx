// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { HIT_SLOPS } from 'shared';
import { customColors } from '@petra/core/colors';
import { testProps } from 'e2e/config/testProps';
import InfoIcon from 'shared/assets/svgs/info_circle_icon';
import { usePrompt } from 'core/providers/PromptProvider';
import { i18nmock } from 'strings';
import SendToFriend from 'shared/assets/svgs/send_to_friend';
import BottomSheetModalContent from './BottomSheetModalContent';
import InstructionListItem from './InstructionListItem';

const instructions = [
  {
    description: i18nmock('general:scanner.sendFriendsDescription'),
    icon: SendToFriend,
    title: i18nmock('general:scanner.sendFriends'),
  },
];
function ScannerInfoButton() {
  const { showPrompt } = usePrompt();
  const showInfoModal = () => {
    showPrompt(
      <BottomSheetModalContent
        title={i18nmock('general:scanner.scanQrTo')}
        body={
          <View>
            {instructions.map((props) => (
              <InstructionListItem {...props} />
            ))}
          </View>
        }
      />,
    );
  };
  return (
    <TouchableOpacity
      onPress={showInfoModal}
      hitSlop={HIT_SLOPS.smallSlop}
      style={{ marginHorizontal: 16 }}
      {...testProps('scanner-info')}
    >
      <InfoIcon color={customColors.white} />
    </TouchableOpacity>
  );
}

export default ScannerInfoButton;
