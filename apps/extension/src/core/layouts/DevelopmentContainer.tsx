// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-console */

import { HexString, TxnBuilderTypes } from 'aptos';
import React, { useState } from 'react';
import {
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  ConnectionResponseArgs,
  SignTransactionResponseArgs,
} from '@petra/core/approval';
import { useAppState } from '@petra/core/hooks/useAppState';
import { DappInfo } from '@petra/core/types';

import { makeWindowPersistentStorage } from 'core/storage/window';
import { PromptApprovalClient, WindowPromptConnection } from 'shared/approval';

const approvalClient = new PromptApprovalClient(
  makeWindowPersistentStorage(),
  WindowPromptConnection.open,
);

interface SimulatedExtensionContainerProps {
  children: JSX.Element;
}

export const boxShadow = 'rgba(149, 157, 165, 0.2) 0px 0px 8px 4px';

const extensionDimensions = ['375px', '600px'];
const fullscreenDimensions = ['100vw', 'calc(100vh - 72px)'];

const secondaryFlexBgColor = {
  dark: 'gray.800',
  light: 'gray.100',
};

const secondaryHeaderBgColor = {
  dark: 'gray.700',
  light: 'white',
};

const localOrigin = window && window.location.origin;
const localDappInfo: DappInfo = {
  domain: localOrigin,
  imageURI: window && `${localOrigin}/icon128.png`,
  name: 'Petra Dev',
};

const sendToSelfBytecode =
  'a11ceb0b0500000007010006020604030a0b041502051712072935085' +
  'e20000000010002000408000203020300010505010100010402060c03' +
  '0001060c010501080003060c05030a6170746f735f636f696e04636f6' +
  '96e067369676e65720a616464726573735f6f66094170746f73436f69' +
  '6e087472616e736665720000000000000000000000000000000000000' +
  '000000000000000000000000001000001060a000b0011000b01380002';

const moonpayScriptBytecode =
  'a11ceb0b0500000006010006030617041d06052323074646088c01400000000101020103030100' +
  '00040105010000050302010002060602010001040204030405060c0a020a0a020a0a020a040105' +
  '0001060c0109000101040a020a0a020a0a020a0404636f696e067369676e65720a7065675f6272' +
  '696467650a616464726573735f6f661569735f6163636f756e745f726567697374657265640872' +
  '65676973746572046d696e74000000000000000000000000000000000000000000000000000000' +
  '00000000015c341dec2396029a7713cb59decee89635a6f851a5fe528fc39761ec2ddbf99a0100' +
  '0001140a0011000c050b05380009210309050c0b003801050e0b00010b010b020b030b04380202';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildSomePayload() {
  return {
    arguments: [
      '0x01000000030d00b70db7e8b3b2372279f2acc6088b65d109b724f828b26b8700e7a7f2f9967c675c25291841eb085268b5620e7dc8e7f4c2f44fda1023cea4ffe71f517a54567e0001d587d5757b22fd454de052d5fbd2b5622866a3c3f46d72ce2317bb40fb35a0bb2f213549ac18b307adfee2933ca66d69729bb5ffdd1cd1b493c1c54801a77b080003d55439819813feef1fc0d2c0d7c0d518e014aa1cef04201f0823c765e0beca76640c242a8cfcf3b2f1aa07128075955ffeb276ced4bd0bfcea4aff656e6a8e420004d7c6b18cf1babba51c2fb7317707df66b6c6b7be43e103afb4b65bc1377485b90f7991e3cd7cca754c00f7c277b3ef45255559565dfedc6b85d48b120036274b010696f6b8b3f5c16fa1e90c3f21f5d7c7435efe153ae3d316a9149cd5aaa00f4f243ddb4e46ea819a8e7cc166e000f867a4126df0b45363309af153f24417a1415f01076a7c3504008ec34dbe160d3ef36ad293799952b707b7980e8afdb9c2b1e4f85a688fd5eb2da22e4adb698eadcef33f7e4d7ae32493b7f3a4d2aade902770813a000a05bfc3178ff7ffa972933adb87d72412e2cb9032aaa9486d3ba6d644bb74af0d7321e90757e3df38bbd8c3968028573719a9bd88e18ac947936b78dc6461b5b4000cd532177e1c0a54577ed87a18ea13884a2281a8518d2c6091d9aef0f2c62eca656c1e5e26ca2122bc0b27882c1abdf0f1e4e731d2cbf8dabfc701d87ad54b15d8000db6f642c55fa65e1a247d6a3181ca324849613957c495572d150eb1114e8af48747e7bf8eb2e9da1f0ca195575b322e91f6c655889e503d2957c11600e0646c4d010e17b6bed5527fae03ae8e06e79627143f347edb41a7a66c4051e7855231cd9d86086086b4161376a7ccf87aa2bf63234dbf6aab99e916ae115f65f7103df57b43010f942eea92a7ed5c23f7773eb242d9b2e07ab1e7fbab3d9c4b58d50e2d14f44dde7ed8ec815ed90700d418fbdfeb5ce01244c872455e3fad96f40963e7353869e90010b9719142716812c8c92aa9687ed7cdfb5a0aed61dd894ea6c56914f840cf569475f2b34ab5980271024ebc93d1c2153647966ced0c64049fabb7da61e5c877a90112ef4376d830903142e92c6fe7339b081a6e7188621266ab60cc817076f87a09ac72b0b76db9fb2aa26d6f78806dbc3380b0d634bd73a44cd7a8a09092fac4554300642f3a073519010000020000000000000000000000003ee18b2214aff97000d974cf647e7c347e8fa585000000000001ab3c01010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200023d78ef065f4dd973dd755b33028137184cd72a76410c3252936e3be502142b3300160000000000000000000000000000000000000000000000000000000000000000',
    ],
    function:
      '0x576410486a2da45eee6c949c995670112ddf2fbeedab20350d506328eefc9d4f::complete_transfer::submit_vaa_and_register_entry',
    type: 'entry_function_payload' as const,
    type_arguments: [
      '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T',
    ],
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildTestJsonPayload(address: string) {
  return {
    arguments: [address, 717],
    function: '0x1::coin::transfer',
    type: 'entry_function_payload',
    type_arguments: ['0x1::aptos_coin::AptosCoin'],
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildSendToSelfScriptPayload() {
  const bytecode = new HexString(sendToSelfBytecode).toUint8Array();
  const args = [new TxnBuilderTypes.TransactionArgumentU64(100n)];
  const script = new TxnBuilderTypes.Script(bytecode, [], args);
  return new TxnBuilderTypes.TransactionPayloadScript(script);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildMoonpayScriptPayload() {
  const coinModule =
    '0x5c341dec2396029a7713cb59decee89635a6f851a5fe528fc39761ec2ddbf99a::celer_coin_manager';
  const coinName = `${coinModule}::UsdcCoin`;
  const coinNameStruct = TxnBuilderTypes.StructTag.fromString(coinName);

  const bytecode = new HexString(moonpayScriptBytecode).toUint8Array();
  const args = [new TxnBuilderTypes.TransactionArgumentU64(100n)];
  const typeArgs = [new TxnBuilderTypes.TypeTagStruct(coinNameStruct)];
  const script = new TxnBuilderTypes.Script(bytecode, typeArgs, args);
  return new TxnBuilderTypes.TransactionPayloadScript(script);
}

/**
 * This container is used to wrap the extension app and provide useful development functionalities
 * @param children the wrapped app
 */
export default function DevelopmentContainer({
  children,
}: SimulatedExtensionContainerProps) {
  const { colorMode, setColorMode } = useColorMode();
  const [simulatedDimensions, setSimulatedDimensions] =
    useState(extensionDimensions);

  const isFullScreen = simulatedDimensions[0] === '100vw';
  const changeDimensionsToExtension = () =>
    setSimulatedDimensions(extensionDimensions);
  const changeDimensionsToFullscreen = () =>
    setSimulatedDimensions(fullscreenDimensions);

  const { activeAccountAddress } = useAppState();

  const promptConnect = async () => {
    const result = (await approvalClient.request(localDappInfo, {
      type: 'connect',
    })) as ConnectionResponseArgs;
    console.log('Result', result);
  };

  const promptSignAndSubmitTransaction = async () => {
    if (!activeAccountAddress) {
      return;
    }
    const payload = buildSomePayload();
    // const bcsPayload = buildSendToSelfScriptPayload();
    // const payload = ensurePayloadSerialized(bcsPayload);
    const result = (await approvalClient.request(localDappInfo, {
      payload,
      type: 'signTransaction',
    })) as SignTransactionResponseArgs;
    console.log('Result', result);
  };

  const promptSignMessage = async () => {
    const message = "Si sta come d'autunno, sugli alberi, le foglie";
    const result = await approvalClient.request(localDappInfo, {
      fullMessage: message,
      message,
      type: 'signMessage',
    });
    console.log('Result', result);
  };

  return (
    <VStack w="100vw" h="100vh" spacing={0}>
      <Flex
        flexDirection="row-reverse"
        w="100%"
        py={4}
        bgColor={secondaryHeaderBgColor[colorMode]}
      >
        <HStack spacing={4} pr={4}>
          <Button onClick={promptConnect}>Connect</Button>
          <Button onClick={promptSignAndSubmitTransaction}>
            Sign transaction
          </Button>
          <Button onClick={promptSignMessage}>Sign message</Button>
          <Button onClick={changeDimensionsToExtension}>Extension</Button>
          <Button onClick={changeDimensionsToFullscreen}>Full screen</Button>
          <IconButton
            aria-label="dark mode"
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={() =>
              setColorMode(colorMode === 'dark' ? 'light' : 'dark')
            }
          />
        </HStack>
      </Flex>
      <Center w="100%" h="100%" bgColor={secondaryFlexBgColor[colorMode]}>
        <Center
          maxW={simulatedDimensions[0]}
          maxH={simulatedDimensions[1]}
          w={simulatedDimensions[0]}
          h={simulatedDimensions[1]}
          borderRadius=".5rem"
          boxShadow={isFullScreen ? undefined : boxShadow}
        >
          {children}
        </Center>
      </Center>
    </VStack>
  );
}
