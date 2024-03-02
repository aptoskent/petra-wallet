// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  VStack,
  Input,
  Text,
  useColorMode,
  Tooltip,
  Button,
  HStack,
  Box,
} from '@chakra-ui/react';
import { secondaryTextColor } from '@petra/core/colors';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import MaskedInput from '@hariria/react-text-mask';
import { createNumberMask } from '@hariria/text-mask-addons';
import { keyframes } from '@emotion/react';
import { useTransferFlow } from 'core/hooks/useTransferFlow';
import TransferFlowAdvancedView from './TransferFlowAdvancedView';
import SelectCoin from './SelectCoin';

const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  30% {
    transform: translate3d(30px, 0, 0);
  }

  40%, 43% {
    transform: translate3d(-15px, 0, 0);
  }

  60% {
    transform: translate3d(4px, 0, 0);
  }

  70% {
    transform: translate3d(-15px, 0, 0);
  }

  90% {
    transform: translate3d(-4px, 0, 0);
  }
`;

interface GetAmountInputFontSizeProps {
  amount?: string;
  unit: string;
}

function getAmountInputFontSize({ amount, unit }: GetAmountInputFontSizeProps) {
  const amountAndUnitStringLength =
    amount && unit ? amount.length + unit.length : 0;
  if (!amount || amountAndUnitStringLength < 7) {
    return 64;
  }
  if (amountAndUnitStringLength < 10) {
    return 48;
  }
  if (amountAndUnitStringLength < 16) {
    return 32;
  }
  if (amountAndUnitStringLength < 20) {
    return 24;
  }
  return 18;
}

export default function TransferInput() {
  const {
    advancedView,
    advancedViewOnClick,
    amountString,
    canSubmitForm,
    coinBalanceTypeAgnostic,
    coinDecimals,
    coinSymbol,
    estimatedGasFeeApt,
    formMethods: { register },
    formSubmissionErrorText,
    shouldBalanceShake,
  } = useTransferFlow();
  const { colorMode } = useColorMode();
  const amountInputFontSize = useMemo(
    () => getAmountInputFontSize({ amount: amountString, unit: coinSymbol }),
    [amountString, coinSymbol],
  );

  const defaultMaskOptions = useMemo(
    () => ({
      allowDecimal: true,
      allowLeadingZeroes: false,
      // limit length of integer numbers
      allowNegative: false,
      decimalLimit: coinDecimals >= 0 && coinDecimals <= 8 ? coinDecimals : 8,
      decimalSymbol: '.',
      includeThousandsSeparator: true,
      // this would be more than the supply of APT,
      // we can change the mask options once other coins are introduced
      integerLimit: 10,
      prefix: '',
      // how many digits allowed after the decimal
      suffix: ` ${coinSymbol}`,
      thousandsSeparatorSymbol: ',',
    }),
    [coinSymbol, coinDecimals],
  );

  const currencyMask = useMemo(
    () => createNumberMask(defaultMaskOptions),
    [defaultMaskOptions],
  );

  const { onChange: amountOnChange, ref: amountRef } = register('amount');

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement> | undefined,
    maskedInputOnChangeCallback: (
      event: React.ChangeEvent<HTMLElement>,
    ) => void,
  ): void => {
    amountOnChange(e!);
    maskedInputOnChangeCallback(e!);
  };

  const gasFeeTooltipLabel = useMemo(() => {
    if (!canSubmitForm) {
      return formSubmissionErrorText;
    }
    return (
      <FormattedMessage
        defaultMessage="Network fee: {networkFee}"
        values={{ networkFee: estimatedGasFeeApt }}
      />
    );
  }, [estimatedGasFeeApt, formSubmissionErrorText, canSubmitForm]);

  const transferTextColor = canSubmitForm
    ? secondaryTextColor[colorMode]
    : 'red.400';

  const advancedViewText = advancedView ? (
    <FormattedMessage defaultMessage="Normal view" />
  ) : (
    <FormattedMessage defaultMessage="Advanced view" />
  );

  return (
    <VStack
      spacing={0}
      height="100%"
      position="relative"
      overflowY="auto"
      overflowX="hidden"
    >
      <HStack w="100%" justifyContent="space-between" alignItems="center">
        <Box zIndex={2} position="absolute" top={4} left={4}>
          <SelectCoin />
        </Box>
        <Button
          top={3}
          right={4}
          color={secondaryTextColor[colorMode]}
          zIndex={2}
          fontSize="xs"
          variant="unstyled"
          position="absolute"
          onClick={advancedViewOnClick}
        >
          {advancedViewText}
        </Button>
      </HStack>
      <MaskedInput
        mask={currencyMask}
        render={(ref, props) => (
          <Input
            {...props}
            autoComplete="off"
            textAlign="center"
            variant="filled"
            placeholder="0"
            pt={32}
            pb={40}
            fontSize={amountInputFontSize}
            borderRadius="0px"
            backgroundColor="transparent"
            _focusVisible={{
              outline: 'none',
            }}
            {...register('amount', { valueAsNumber: false })}
            // eslint-disable-next-line react/prop-types
            onChange={(e) => inputOnChange(e, props.onChange)}
            ref={(e) => {
              ref(e!);
              amountRef(e);
            }}
          />
        )}
      />
      <Tooltip label={gasFeeTooltipLabel}>
        <Text
          fontSize="sm"
          color={transferTextColor}
          position="absolute"
          top={48}
          animation={
            shouldBalanceShake ? `${bounce} 1s ease infinite` : undefined
          }
        >
          <FormattedMessage
            defaultMessage="Balance: {balance}, fees: {fees}"
            values={{
              balance: coinBalanceTypeAgnostic,
              fees: estimatedGasFeeApt,
            }}
          />
        </Text>
      </Tooltip>
      <TransferFlowAdvancedView />
    </VStack>
  );
}
