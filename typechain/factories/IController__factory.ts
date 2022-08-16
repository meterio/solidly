/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IController, IControllerInterface } from "../IController";

const _abi = [
  {
    inputs: [],
    name: "veDist",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "voter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IController__factory {
  static readonly abi = _abi;
  static createInterface(): IControllerInterface {
    return new utils.Interface(_abi) as IControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IController {
    return new Contract(address, _abi, signerOrProvider) as IController;
  }
}
