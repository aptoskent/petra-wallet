// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Box, Flex, Input, Text, useColorMode, VStack } from '@chakra-ui/react';
import { useTransferFlow } from 'core/hooks/useTransferFlow';
import React, { useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  secondaryBorderColor,
  secondaryLightBorderColor,
  secondaryTextColor,
} from '@petra/core/colors';
import MaskedInput from '@hariria/react-text-mask';
import { createNumberMask } from '@hariria/text-mask-addons';
import {
  CreatableSelect,
  type InputProps,
  type MultiValue,
  type SingleValue,
  type ValueContainerProps,
  type IndicatorsContainerProps,
  type ControlProps,
} from 'chakra-react-select';
import { mempoolBuckets } from '@petra/core/constants';
import numbro from 'numbro';
import { OCTA_UNIT } from '@petra/core/utils/coin';

/**
 * Text mask for the max gas input
 */
const maxGasMaskOptions = {
  allowDecimal: false,
  allowLeadingZeroes: false,
  // limit length of integer numbers
  allowNegative: false,
  decimalLimit: 0,
  decimalSymbol: '.',
  includeThousandsSeparator: true,
  // this would be more than the supply of APT,
  // we can change the mask options once other coins are introduced
  integerLimit: 9,
  prefix: '',
  // how many digits allowed after the decimal
  suffix: ' gas units',
  thousandsSeparatorSymbol: ',',
};

const gasMask = createNumberMask(maxGasMaskOptions);

/**
 * Text mask for the max gas input
 */
const gasUnitPriceMaskOptions = {
  allowDecimal: false,
  allowLeadingZeroes: false,
  // limit length of integer numbers
  allowNegative: false,
  decimalLimit: 0,
  decimalSymbol: '.',
  includeThousandsSeparator: true,
  // this would be more than the supply of APT,
  // we can change the mask options once other coins are introduced
  integerLimit: 7,
  prefix: '',
  // how many digits allowed after the decimal
  suffix: ` ${OCTA_UNIT}`,
  thousandsSeparatorSymbol: ',',
};

const gasUnitPriceMask = createNumberMask(gasUnitPriceMaskOptions);

const gasUnitSelectOptions = mempoolBuckets.map((bucket) => ({
  label: `${numbro(bucket).format('0,0')} OCTA`,
  value: bucket,
}));
type GasUnitSelectOptionType = typeof gasUnitSelectOptions;
type SingleGasUnitSelectOptionType = GasUnitSelectOptionType[number];

/**
 * Custom Select input component used for Gas Unit Price
 *
 * Allows a text-masked component to be used in the select component for
 * TransferFlowAdvancedView so that the select input can not be negative,
 * have decimals, and be formatted properly with the thousands separator
 * while also have select input suggestions come up in the dropdown with
 * the autofill features you would expect from a select component
 */
export function CustomGasUnitPriceInput(
  props: InputProps<SingleGasUnitSelectOptionType, true>,
) {
  const {
    formMethods: { register },
  } = useTransferFlow();
  const { onChange: propsOnChange } = props;

  const { onChange: gasUnitPriceOcta, ref: maxGasRef } =
    register('gasUnitPriceOcta');

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement> | undefined,
    maskedInputOnChangeCallback: (
      event: React.ChangeEvent<HTMLElement>,
    ) => void,
  ): void => {
    if (e) {
      gasUnitPriceOcta(e);
      maskedInputOnChangeCallback(e);
      if (propsOnChange) {
        propsOnChange(e);
      }
    }
  };

  return (
    <MaskedInput
      width="100%"
      mask={gasUnitPriceMask}
      render={(ref, inputProps) => (
        <Input
          {...inputProps}
          autoComplete="off"
          textAlign="left"
          variant="filled"
          placeholder="Default"
          fontSize="md"
          borderRightRadius={0}
          fontWeight={600}
          _focusVisible={{
            outline: 'none',
          }}
          {...register('gasUnitPriceOcta', { valueAsNumber: false })}
          // eslint-disable-next-line react/prop-types
          onChange={(e) => inputOnChange(e, inputProps.onChange)}
          ref={(e) => {
            ref(e!);
            maxGasRef(e);
          }}
        />
      )}
    />
  );
}

/**
 * Custom Select value component container
 * Overrides padding on default select value container
 */
export function CustomSelectValueContainer({
  children,
}: ValueContainerProps<SingleGasUnitSelectOptionType, true>) {
  return <Box w="100%">{children}</Box>;
}

/**
 * Custom Select Control component
 * Overrides borderWidth on default select container
 */
export function CustomControlContainer({
  children,
}: ControlProps<SingleGasUnitSelectOptionType, true>) {
  return (
    <Flex w="100%" borderWidth={0} borderRadius=".5rem">
      {children}
    </Flex>
  );
}

/**
 * Custom Select single value component
 * Overrides font color on normal single value component
 */
export function CustomSingleValue() {
  return null;
}

const secondaryCustomIndicatorContainerBgColor = {
  dark: 'gray.600',
  light: 'gray.100',
};

/**
 * Custom Select component indicator container
 * Overrides bgColor on default indicator container component
 */
export function CustomIndicatorsContainer({
  children,
}: IndicatorsContainerProps<SingleGasUnitSelectOptionType, true>) {
  const { colorMode } = useColorMode();
  return (
    <Flex
      alignItems="center"
      bgColor={secondaryCustomIndicatorContainerBgColor[colorMode]}
      borderRightRadius=".5rem"
    >
      {children}
    </Flex>
  );
}

/**
 * Advanced transfer flow view
 *
 * Includes:
 * 1. Gas Unit Price Input
 * 2. Max Gas Units Input
 *
 * Gas fee = Gas unit price * gas units
 */
export default function TransferFlowAdvancedView() {
  const { colorMode } = useColorMode();
  const {
    advancedView,
    formMethods: {
      clearErrors,
      formState: { errors },
      register,
      setError,
      setValue,
    },
  } = useTransferFlow();
  const intl = useIntl();

  const { onChange: maxGasOnChange, ref: maxGasRef } = register('maxGasUnits');

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement> | undefined,
    maskedInputOnChangeCallback: (
      event: React.ChangeEvent<HTMLElement>,
    ) => void,
  ): void => {
    maxGasOnChange(e!);
    maskedInputOnChangeCallback(e!);
  };

  const selectOnChange = (
    newValue: MultiValue<SingleGasUnitSelectOptionType>,
  ) => {
    try {
      const recastNewValue =
        newValue as unknown as SingleValue<SingleGasUnitSelectOptionType>;
      const regexReplacedValue = Number(
        recastNewValue?.value.toString().replace(/[^0-9.]/g, ''),
      );
      clearErrors('gasUnitPriceOcta');
      setValue('gasUnitPriceOcta', regexReplacedValue.toString());
    } catch (err) {
      setError('gasUnitPriceOcta', {
        message: intl.formatMessage({
          defaultMessage:
            'Gas unit price entered is invalid or too high, must be less than 20,000 OCTA',
        }),
      });
    }
  };

  const maxGasErrorComponent = useMemo(() => {
    if (errors.gasUnitPriceOcta) {
      return (
        <Text pt={2} fontSize="xs" color="red.400">
          {errors.gasUnitPriceOcta.message?.toString()}
        </Text>
      );
    }
    return null;
  }, [errors.gasUnitPriceOcta]);

  return advancedView ? (
    <VStack
      width="100%"
      height="100%"
      py={4}
      borderTopWidth="1px"
      borderColor={secondaryBorderColor[colorMode]}
      spacing={6}
    >
      <Text px={4} width="100%" textAlign="left" fontSize="lg" fontWeight={500}>
        <FormattedMessage defaultMessage="Advanced options" />
      </Text>
      <VStack width="100%" alignItems="flex-start" px={4}>
        <Text
          fontSize="sm"
          textAlign="left"
          color={secondaryTextColor[colorMode]}
          pb={0}
        >
          <FormattedMessage defaultMessage="Gas unit price (in octa)" />
        </Text>
        <Box width="100%">
          <CreatableSelect
            selectedOptionStyle="color"
            selectedOptionColor="salmon"
            options={gasUnitSelectOptions}
            maxMenuHeight={128}
            onChange={selectOnChange}
            placeholder=""
            components={{
              IndicatorsContainer: CustomIndicatorsContainer,
              Input: CustomGasUnitPriceInput,
              SingleValue: CustomSingleValue,
              ValueContainer: CustomSelectValueContainer,
            }}
            isClearable
          />
          {maxGasErrorComponent}
        </Box>
      </VStack>
      <VStack width="100%" alignItems="flex-start" px={4}>
        <Text
          fontSize="sm"
          textAlign="left"
          color={secondaryTextColor[colorMode]}
          pb={0}
        >
          <FormattedMessage defaultMessage="Max gas units" />
        </Text>
        <MaskedInput
          mask={gasMask}
          render={(ref, props) => (
            <Input
              {...props}
              autoComplete="off"
              textAlign="left"
              variant="filled"
              placeholder="Default"
              fontSize="md"
              fontWeight={600}
              _focusVisible={{
                outline: 'none',
              }}
              borderWidth="1px"
              borderColor={secondaryLightBorderColor[colorMode]}
              {...register('maxGasUnits', { valueAsNumber: false })}
              // eslint-disable-next-line react/prop-types
              onChange={(e) => inputOnChange(e, props.onChange)}
              ref={(e) => {
                ref(e!);
                maxGasRef(e);
              }}
            />
          )}
        />
      </VStack>
    </VStack>
  ) : null;
}
