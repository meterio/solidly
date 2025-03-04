/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BaseV1Fees, BaseV1FeesInterface } from "../BaseV1Fees";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "claimFeesFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60e060405234801561001057600080fd5b5060405161037038038061037083398101604081905261002f91610066565b336080526001600160a01b0391821660a0521660c052610099565b80516001600160a01b038116811461006157600080fd5b919050565b6000806040838503121561007957600080fd5b6100828361004a565b91506100906020840161004a565b90509250929050565b60805160a05160c0516102ab6100c5600039600060b601526000608501526000605001526102ab6000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063533cf5ce14610030575b600080fd5b61004361003e3660046101d0565b610045565b005b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461007a57600080fd5b81156100ab576100ab7f000000000000000000000000000000000000000000000000000000000000000084846100e1565b80156100dc576100dc7f000000000000000000000000000000000000000000000000000000000000000084836100e1565b505050565b6000836001600160a01b03163b116100f857600080fd5b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b17905291516000928392908716916101549190610211565b6000604051808303816000865af19150503d8060008114610191576040519150601f19603f3d011682016040523d82523d6000602084013e610196565b606091505b50915091508180156101c05750805115806101c05750808060200190518101906101c0919061024c565b6101c957600080fd5b5050505050565b6000806000606084860312156101e557600080fd5b83356001600160a01b03811681146101fc57600080fd5b95602085013595506040909401359392505050565b6000825160005b818110156102325760208186018101518583015201610218565b81811115610241576000828501525b509190910192915050565b60006020828403121561025e57600080fd5b8151801515811461026e57600080fd5b939250505056fea264697066735822122010171b5283f346c0409f9a33f60ff5c4a9145ae3ddf67b954c51dc183d5261e664736f6c634300080b0033";

export class BaseV1Fees__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _token0: string,
    _token1: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BaseV1Fees> {
    return super.deploy(
      _token0,
      _token1,
      overrides || {}
    ) as Promise<BaseV1Fees>;
  }
  getDeployTransaction(
    _token0: string,
    _token1: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_token0, _token1, overrides || {});
  }
  attach(address: string): BaseV1Fees {
    return super.attach(address) as BaseV1Fees;
  }
  connect(signer: Signer): BaseV1Fees__factory {
    return super.connect(signer) as BaseV1Fees__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BaseV1FeesInterface {
    return new utils.Interface(_abi) as BaseV1FeesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BaseV1Fees {
    return new Contract(address, _abi, signerOrProvider) as BaseV1Fees;
  }
}
