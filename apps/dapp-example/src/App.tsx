// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-console */
import './App.css';
import {
  HexString,
  MaybeHexString,
  TransactionBuilderABI,
  TxnBuilderTypes,
  BCS,
} from 'aptos';
import React, { ChangeEvent, useEffect, useState } from 'react';
import nacl from 'tweetnacl';

export type AnyNumber = bigint | number;
export type Bytes = Uint8Array;

const {
  EntryFunction,
  StructTag,
  TransactionPayloadEntryFunction,
  TypeTagStruct,
} = TxnBuilderTypes;

export const TOKEN_ABIS = [
  // aptos-token/build/AptosToken/abis/token/create_collection_script.abi
  '01186372656174655F636F6C6C656374696F6E5F736372697074000000000000000000000000000000000000000000000000000000000000000305746F6B656E3020637265617465206120656D70747920746F6B656E20636F6C6C656374696F6E207769746820706172616D65746572730005046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000B6465736372697074696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000375726907000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700076D6178696D756D020E6D75746174655F73657474696E670600',
  // aptos-token/build/AptosToken/abis/token/create_token_script.abi
  '01136372656174655F746F6B656E5F736372697074000000000000000000000000000000000000000000000000000000000000000305746F6B656E1D2063726561746520746F6B656E20776974682072617720696E70757473000D0A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000B6465736372697074696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000762616C616E636502076D6178696D756D020375726907000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E670015726F79616C74795F70617965655F61646472657373041A726F79616C74795F706F696E74735F64656E6F6D696E61746F720218726F79616C74795F706F696E74735F6E756D657261746F72020E6D75746174655F73657474696E6706000D70726F70657274795F6B6579730607000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000F70726F70657274795F76616C7565730606010E70726F70657274795F74797065730607000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700',
  // aptos-token/build/AptosToken/abis/token/direct_transfer_script.abi
  '01166469726563745f7472616e736665725f736372697074000000000000000000000000000000000000000000000000000000000000000305746f6b656e0000051063726561746f72735f61646472657373040a636f6c6c656374696f6e07000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e6700046e616d6507000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e67001070726f70657274795f76657273696f6e0206616d6f756e7402',
  // aptos-token/build/AptosToken/abis/token_transfers/offer_script.abi
  '010C6F666665725F73637269707400000000000000000000000000000000000000000000000000000000000000030F746F6B656E5F7472616E7366657273000006087265636569766572040763726561746F72040A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67001070726F70657274795F76657273696F6E0206616D6F756E7402',
  // aptos-token/build/AptosToken/abis/token_transfers/claim_script.abi
  '010C636C61696D5F73637269707400000000000000000000000000000000000000000000000000000000000000030F746F6B656E5F7472616E73666572730000050673656E646572040763726561746F72040A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67001070726F70657274795F76657273696F6E02',
  // aptos-token/build/AptosToken/abis/token_transfers/cancel_offer_script.abi
  '011363616E63656C5F6F666665725F73637269707400000000000000000000000000000000000000000000000000000000000000030F746F6B656E5F7472616E7366657273000005087265636569766572040763726561746F72040A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67001070726F70657274795F76657273696F6E02',
  // aptos-token/build/AptosToken/abis/token/mutate_token_properties.abi
  '01176d75746174655f746f6b656e5f70726f70657274696573000000000000000000000000000000000000000000000000000000000000000305746f6b656eba02206d75746174652074686520746f6b656e2070726f706572747920616e64207361766520746865206e65772070726f706572747920696e20546f6b656e53746f72650a2069662074686520746f6b656e2070726f70657274795f76657273696f6e20697320302c2077652077696c6c206372656174652061206e65772070726f70657274795f76657273696f6e2070657220746f6b656e20746f2067656e65726174652061206e657720746f6b656e5f69642070657220746f6b656e0a2069662074686520746f6b656e2070726f70657274795f76657273696f6e206973206e6f7420302c2077652077696c6c206a75737420757064617465207468652070726f70657274794d617020616e642075736520746865206578697374696e6720746f6b656e5f6964202870726f70657274795f76657273696f6e2900090b746f6b656e5f6f776e6572040763726561746f72040f636f6c6c656374696f6e5f6e616d6507000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e67000a746f6b656e5f6e616d6507000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e670016746f6b656e5f70726f70657274795f76657273696f6e0206616d6f756e7402046b6579730607000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e67000676616c7565730606010574797065730607000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e6700',
  // aptos-token/build/AptosToken/abis/token/opt_in_direct_transfer.abi
  '01166f70745f696e5f6469726563745f7472616e73666572000000000000000000000000000000000000000000000000000000000000000305746f6b656e000001066f70745f696e00',
  // aptos-token/build/AptosToken/abis/token/burn.abi
  '01046275726e000000000000000000000000000000000000000000000000000000000000000305746f6b656e20204275726e206120746f6b656e2062792074686520746f6b656e206f776e657200051063726561746f72735f61646472657373040a636f6c6c656374696f6e07000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e6700046e616d6507000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e67001070726f70657274795f76657273696f6e0206616d6f756e7402',
  // aptos-token/build/AptosToken/abis/token/burn_by_creator.abi
  '010f6275726e5f62795f63726561746f72000000000000000000000000000000000000000000000000000000000000000305746f6b656e6a204275726e206120746f6b656e2062792063726561746f72207768656e2074686520746f6b656e2773204255524e41424c455f42595f43524541544f5220697320747275650a2054686520746f6b656e206973206f776e65642061742061646472657373206f776e65720005056f776e6572040a636f6c6c656374696f6e07000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e6700046e616d6507000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e67001070726f70657274795f76657273696f6e0206616d6f756e7402',
];

const sendToSelfBytecode =
  'a11ceb0b0500000007010006020604030a0b041502051712072935085' +
  'e20000000010002000408000203020300010505010100010402060c03' +
  '0001060c010501080003060c05030a6170746f735f636f696e04636f6' +
  '96e067369676e65720a616464726573735f6f66094170746f73436f69' +
  '6e087472616e736665720000000000000000000000000000000000000' +
  '000000000000000000000000001000001060a000b0011000b01380002';

const ipfsUrl =
  'ipfs://bafybeibf75g6wku4pwupmqskzfoyshuwvsh7anypf7s24cydmyxtcidyym/2787.json';
const royaltyPayeeAddress =
  '0x5aa4efe9703ffba6082906721756da68b9f7e8d256ed719cf49c40cab3938650';

function buildSendToSelfScriptPayload() {
  const bytecode = new HexString(sendToSelfBytecode).toUint8Array();
  const args = [new TxnBuilderTypes.TransactionArgumentU64(BigInt(100))];
  const script = new TxnBuilderTypes.Script(bytecode, [], args);
  return new TxnBuilderTypes.TransactionPayloadScript(script);
}

function createTokenWithMutabilityConfig(
  account: undefined,
  collectionName: string,
  name: string,
  description: string,
  supply: AnyNumber,
  uri: string,
  max: AnyNumber,
  royalty_payee_address: MaybeHexString,
  royalty_points_denominator: AnyNumber = 0,
  royalty_points_numerator: AnyNumber = 0,
  property_keys: Array<string> = [],
  property_values: Array<Bytes> = [],
  property_types: Array<string> = [],
  mutability_config: Array<boolean> = [false, false, false, false, false],
) {
  const txnBuilder = new TransactionBuilderABI(
    TOKEN_ABIS.map((abi) => new HexString(abi).toUint8Array()),
  );
  const payload = txnBuilder.buildTransactionPayload(
    '0x3::token::create_token_script',
    [],
    [
      collectionName,
      name,
      description,
      supply,
      max,
      uri,
      royalty_payee_address,
      royalty_points_denominator,
      royalty_points_numerator,
      mutability_config,
      property_keys,
      property_values,
      property_types,
    ],
  );

  return payload;
}

const createCollectionPayload = (
  name: string,
  description: string,
  uri: string,
  maxAmount: number | BigInt,
) => {
  const transactionBuilder = new TransactionBuilderABI(
    TOKEN_ABIS.map((abi) => new HexString(abi).toUint8Array()),
  );
  const payload = transactionBuilder.buildTransactionPayload(
    '0x3::token::create_collection_script',
    [],
    [name, description, uri, maxAmount, [false, false, false]],
  );
  return payload;
};

function App() {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [altAddress, setAltAddress] = useState<string>('0xAltAddress');
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean | undefined>(
    undefined,
  );
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [isSubmittingTransaction, setIsSubmittingTransaction] =
    useState<boolean>(false);
  const [isSigningTransaction, setIsSigningTransaction] =
    useState<boolean>(false);
  const [isSigningMessage, setIsSigningMessage] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isCreatingToken, setIsCreatingToken] = useState<boolean>(false);
  const [isCreatingCollection, setIsCreatingCollection] =
    useState<boolean>(false);
  const [collectionAndTokenName, setCollectionAndTokenName] = useState<string>(
    'randomCollectionAndTokenName',
  );
  const [coinSymbol, setCoinSymbol] = useState<string>('MOON');
  const [coinName, setCoinName] = useState<string>('moon_coin');
  const [coinDecimals, setCoinDecimals] = useState<number>(14);
  const [isRegisteringCoin, setIsRegisteringCoin] = useState<boolean>(false);
  const coinStructTag = `${address}::${coinName}::${coinSymbol}`;

  const collectionAndTokenNameOnChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCollectionAndTokenName(event.target.value);
  };

  const coinNameOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCoinName(event.target.value);
  };

  const coinDecimalsOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setCoinDecimals(value);
  };

  const altAddressOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAltAddress(event.target.value);
  };

  const coinSymbolOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCoinSymbol(event.target.value);
  };

  const transaction = {
    arguments: [address, 717],
    function: '0x1::coin::transfer',
    type: 'entry_function_payload',
    type_arguments: ['0x1::aptos_coin::AptosCoin'],
  };

  const uInt8ArrayTransaction = {
    arguments: [address, new Uint8Array(2)],
    function: '0x1::coin::transfer',
    type: 'entry_function_payload',
    type_arguments: ['0x1::aptos_coin::AptosCoin'],
  };

  useEffect(() => {
    async function fetchStatus() {
      const isAlreadyConnected = await window.aptos.isConnected();
      setIsConnected(isAlreadyConnected);
      if (isAlreadyConnected) {
        const [activeAccount, activeNetworkName] = await Promise.all([
          window.aptos.account(),
          window.aptos.network(),
        ]);
        setAddress(activeAccount.address);
        setPublicKey(activeAccount.publicKey);
        setNetwork(activeNetworkName);
      } else {
        setAddress(undefined);
        setPublicKey(undefined);
        setNetwork(undefined);
      }
    }

    window.aptos.onAccountChange(async (account: any) => {
      if (account.address) {
        setIsConnected(true);
        setAddress(account.address);
        setPublicKey(account.publicKey);
        setNetwork(await window.aptos.network());
      } else {
        setIsConnected(false);
        setAddress(undefined);
        setPublicKey(undefined);
        setNetwork(undefined);
      }
    });

    window.aptos.onNetworkChange((params: any) => {
      setNetwork(params.networkName);
    });

    window.aptos.onDisconnect(() => {
      console.log('Disconnected');
    });

    fetchStatus();
  }, []);

  const connectOnClick = async () => {
    if (isConnected) {
      await window.aptos.disconnect();
      setIsConnected(false);
      setAddress(undefined);
      setPublicKey(undefined);
      setNetwork(undefined);
    } else {
      const activeAccount = await window.aptos.connect();
      const activeNetworkName = await window.aptos.network();
      setIsConnected(true);
      setAddress(activeAccount.address);
      setPublicKey(activeAccount.publicKey);
      setNetwork(activeNetworkName);
    }
  };

  const submitTransactionOnClick = async () => {
    if (!isSubmittingTransaction) {
      setIsSubmittingTransaction(true);
      try {
        const pendingTransaction = await window.aptos.signAndSubmitTransaction(
          transaction,
        );
        console.log(pendingTransaction);
      } catch (error) {
        console.error(error);
      }
      setIsSubmittingTransaction(false);
    }
  };

  const createCollectionOnClick = async () => {
    if (!isCreatingToken) {
      setIsCreatingCollection(true);
      try {
        const collectionTxnPayload = createCollectionPayload(
          collectionAndTokenName,
          'random',
          ipfsUrl,
          10000,
        );
        const pendingTransaction = await window.aptos.signAndSubmitTransaction(
          collectionTxnPayload,
        );
        console.log(pendingTransaction);
      } catch (error) {
        console.error(error);
      }
      setIsCreatingCollection(false);
    }
  };

  const createTokenOnClick = async () => {
    if (!isCreatingToken) {
      setIsCreatingToken(true);
      try {
        const tokenTxnPayload = createTokenWithMutabilityConfig(
          undefined,
          collectionAndTokenName,
          collectionAndTokenName,
          "Alice's simple token",
          2,
          ipfsUrl,
          1000,
          royaltyPayeeAddress,
          1,
          0,
          ['TOKEN_BURNABLE_BY_OWNER'],
          [BCS.bcsSerializeBool(true)],
          ['bool'],
          [false, false, false, false, true],
        );
        const pendingTransaction = await window.aptos.signAndSubmitTransaction(
          tokenTxnPayload,
        );
        console.log(pendingTransaction);
      } catch (error) {
        console.error(error);
      }
      setIsCreatingToken(false);
    }
  };

  const registerCoinOnClick = async () => {
    setIsRegisteringCoin(true);
    const selectedCoin = coinStructTag;
    if (!selectedCoin) {
      throw new Error('Ensure the selected coin input is filled in');
    }

    let typeArgs: TxnBuilderTypes.TypeTag[] = [];

    try {
      typeArgs = [new TypeTagStruct(StructTag.fromString(selectedCoin))];

      const entryFunction = EntryFunction.natural(
        '0x1::managed_coin',
        'register',
        typeArgs,
        [],
      );

      const payload = new TransactionPayloadEntryFunction(entryFunction);
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(
        payload,
      );
      console.log(pendingTransaction);

      setIsRegisteringCoin(false);
    } catch (err) {
      console.log(err);
      setIsRegisteringCoin(false);
    }
  };

  const submitBCSTransactionOnClick = async () => {
    if (!isSubmittingTransaction) {
      setIsSubmittingTransaction(true);
      try {
        const payload = buildSendToSelfScriptPayload();
        const pendingTransaction = await window.aptos.signAndSubmitTransaction(
          payload,
        );
        console.log(pendingTransaction);
      } catch (error) {
        console.error(error);
      }
      setIsSubmittingTransaction(false);
    }
  };

  const submitBCSCoinTransferPayloadOnClick = async () => {
    const serializedTxnPayload =
      '0x0200000000000000000000000000000000000000000000000000000000000000010d6170746f735f6163636f756e740e7472616e736665725f636f696e73010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e000220c548e1a9be477f2dd3ec381da1e000a3b1108d86c7f847f70fa54002ddcf72b808cd02000000000000';
    const deserializer = new BCS.Deserializer(
      new HexString(serializedTxnPayload).toUint8Array(),
    );
    const deserializedTransactionPayload =
      TxnBuilderTypes.TransactionPayloadEntryFunction.deserialize(deserializer);
    const pendingTransaction = await window.aptos.signTransaction(deserializedTransactionPayload);
    const hexstringTxn = HexString.fromUint8Array(pendingTransaction);
    console.log(hexstringTxn.toString());
  };

  const signTransactionOnClick = async () => {
    if (!isSubmittingTransaction) {
      setIsSigningTransaction(true);
      try {
        const signedTransaction = await window.aptos.signTransaction(
          transaction,
        );
        console.log(signedTransaction);
      } catch (error) {
        console.error(error);
      }
      setIsSigningTransaction(false);
    }
  };

  const signBCSTransactionOnClick = async () => {
    if (!isSubmittingTransaction) {
      setIsSubmittingTransaction(true);
      try {
        const payload = buildSendToSelfScriptPayload();
        const pendingTransaction = await window.aptos.signTransaction(
          payload,
          {},
        );
        console.log(pendingTransaction);
      } catch (error) {
        console.error(error);
      }
      setIsSubmittingTransaction(false);
    }
  };

  const signUInt8ArrayTransactionOnClick = async () => {
    if (!isSubmittingTransaction) {
      setIsSigningTransaction(true);
      try {
        const signedTransaction = await window.aptos.signTransaction(
          uInt8ArrayTransaction,
        );
        console.log(signedTransaction);
      } catch (error) {
        console.error(error);
      }
      setIsSigningTransaction(false);
    }
  };

  const signMessageOnClick = async () => {
    if (!isSigningMessage && address) {
      setIsSigningMessage(true);
      try {
        const response = await window.aptos.signMessage({
          address: true,
          application: true,
          chainId: true,
          message: 'Hello \nfriend',
          nonce: Date.now().toString(),
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      setIsSigningMessage(false);
    }
  };

  const verifyOnClick = async () => {
    if (!isVerifying && address) {
      setIsVerifying(true);
      try {
        const nonce = Date.now().toString();
        const response = await window.aptos.signMessage({
          message: 'Hello',
          nonce,
        });
        // Remove the 0x prefix
        const key = publicKey!.slice(2, 66);
        const verified = nacl.sign.detached.verify(
          new TextEncoder().encode(response.fullMessage),
          new HexString(response.signature).toUint8Array(),
          new HexString(key).toUint8Array(),
        );
        console.log(verified);
      } catch (error) {
        console.error(error);
      }
      setIsVerifying(false);
    }
  };

  const isConnectedOnClick = async () => {
    console.log(await window.aptos.connect());
    console.log(await window.aptos.isConnected());
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{isConnected ? `Address: ${address}` : 'Not Connected'}</p>
        <p>{`Network: ${network}`}</p>
        <code style={{ fontSize: '12px' }}>Alt address</code>
        <input
          placeholder="Alt address"
          defaultValue={altAddress}
          value={altAddress}
          onChange={altAddressOnChange}
          style={{ width: 'calc(200px - 8px)' }}
        />
        <code style={{ fontSize: '12px' }}>Collection and token name</code>
        <input
          placeholder="Collection and token name"
          defaultValue={collectionAndTokenName}
          value={collectionAndTokenName}
          onChange={collectionAndTokenNameOnChange}
          style={{ width: 'calc(200px - 8px)' }}
        />
        <code style={{ fontSize: '12px' }}>Coin name</code>
        <input
          placeholder="Coin name"
          defaultValue={coinName}
          value={coinName}
          onChange={coinNameOnChange}
          style={{ width: 'calc(200px - 8px)' }}
        />
        <code style={{ fontSize: '12px' }}>Coin symbol</code>
        <input
          placeholder="Coin symbol"
          defaultValue={coinSymbol}
          value={coinSymbol}
          onChange={coinSymbolOnChange}
          style={{ width: 'calc(200px - 8px)' }}
        />
        <code style={{ fontSize: '12px' }}>Coin decimals</code>
        <input
          placeholder="Coin decimals"
          defaultValue={coinDecimals}
          value={coinDecimals}
          onChange={coinDecimalsOnChange}
          style={{ width: 'calc(200px - 8px)' }}
        />
        <button className="Button" type="button" onClick={connectOnClick}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
        <button className="Button" type="button" onClick={registerCoinOnClick}>
          {isRegisteringCoin
            ? 'Submitting...'
            : 'Submit register coin transaction'}
        </button>
        <button
          className="Button"
          type="button"
          onClick={submitTransactionOnClick}
        >
          {isSubmittingTransaction ? 'Submitting...' : 'Submit Transaction'}
        </button>
        <button
          className="Button"
          type="button"
          onClick={createCollectionOnClick}
        >
          {isCreatingCollection
            ? 'Submitting...'
            : 'Submit create collection transaction'}
        </button>
        <button className="Button" type="button" onClick={createTokenOnClick}>
          {isCreatingToken
            ? 'Submitting...'
            : 'Submit create token transaction'}
        </button>
        <button
          className="Button"
          type="button"
          onClick={submitBCSTransactionOnClick}
        >
          {isSubmittingTransaction ? 'Submitting...' : 'Submit BCS transaction'}
        </button>
        <button
          className="Button"
          type="button"
          onClick={signTransactionOnClick}
        >
          {isSigningTransaction ? 'Sigining...' : 'Sign Transaction'}
        </button>
        <button
          className="Button"
          type="button"
          onClick={signUInt8ArrayTransactionOnClick}
        >
          {isSigningTransaction ? 'Sigining...' : 'Sign Uint8Array Transaction'}
        </button>
        <button
          className="Button"
          type="button"
          onClick={signBCSTransactionOnClick}
        >
          {isSigningTransaction ? 'Signing...' : 'Sign BCS transaction'}
        </button>
        <button className="Button" type="button" onClick={signMessageOnClick}>
          {isSigningMessage ? 'Signing...' : 'Sign Message'}
        </button>
        <button className="Button" type="button" onClick={verifyOnClick}>
          {isVerifying ? 'Verifying...' : 'Verify Message'}
        </button>
        <button className="Button" type="button" onClick={isConnectedOnClick}>
          isConnected
        </button>
        <button className="Button" type="button" onClick={submitBCSCoinTransferPayloadOnClick}>
          Click me homie for that BCS special special
        </button>
      </header>
    </div>
  );
}

export default App;
