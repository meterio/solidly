/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IVoterInterface extends ethers.utils.Interface {
  functions: {
    "attachTokenToGauge(uint256,address)": FunctionFragment;
    "detachTokenFromGauge(uint256,address)": FunctionFragment;
    "distribute(address)": FunctionFragment;
    "emitDeposit(uint256,address,uint256)": FunctionFragment;
    "emitWithdraw(uint256,address,uint256)": FunctionFragment;
    "notifyRewardAmount(uint256)": FunctionFragment;
    "ve()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "attachTokenToGauge",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "detachTokenFromGauge",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "distribute", values: [string]): string;
  encodeFunctionData(
    functionFragment: "emitDeposit",
    values: [BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "emitWithdraw",
    values: [BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "notifyRewardAmount",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "ve", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "attachTokenToGauge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "detachTokenFromGauge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "distribute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "emitDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "emitWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "notifyRewardAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ve", data: BytesLike): Result;

  events: {};
}

export class IVoter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IVoterInterface;

  functions: {
    attachTokenToGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    detachTokenFromGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    distribute(
      _gauge: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    emitDeposit(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    emitWithdraw(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ve(overrides?: CallOverrides): Promise<[string]>;
  };

  attachTokenToGauge(
    _tokenId: BigNumberish,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  detachTokenFromGauge(
    _tokenId: BigNumberish,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  distribute(
    _gauge: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  emitDeposit(
    _tokenId: BigNumberish,
    account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  emitWithdraw(
    _tokenId: BigNumberish,
    account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  notifyRewardAmount(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ve(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    attachTokenToGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    detachTokenFromGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    distribute(_gauge: string, overrides?: CallOverrides): Promise<void>;

    emitDeposit(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    emitWithdraw(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    ve(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    attachTokenToGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    detachTokenFromGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    distribute(
      _gauge: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    emitDeposit(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    emitWithdraw(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ve(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    attachTokenToGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    detachTokenFromGauge(
      _tokenId: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    distribute(
      _gauge: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    emitDeposit(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    emitWithdraw(
      _tokenId: BigNumberish,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ve(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
