/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  UniswapV2ERC20,
  UniswapV2ERC20Interface,
} from "../UniswapV2ERC20";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "chainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604080518082018252600a8152692ab734b9bbb0b8102b1960b11b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527fbfcc8ef98ffbf7b6c3fec7bf5185b566b9863e35a9d83acd49ad6824b5969738818401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6606082015246608082018190523060a0808401919091528451808403909101815260c0909201909352805191012060035560055561093d806100f66000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c5780639a8a0592116100665780639a8a05921461022a578063a9059cbb14610233578063d505accf14610246578063dd62ed3e1461025b57600080fd5b806370a08231146101c55780637ecebe00146101e557806395d89b411461020557600080fd5b806323b872dd116100c857806323b872dd1461016857806330adf81f1461017b578063313ce567146101a25780633644e515146101bc57600080fd5b806306fdde03146100ef578063095ea7b31461012e57806318160ddd14610151575b600080fd5b6101186040518060400160405280600a8152602001692ab734b9bbb0b8102b1960b11b81525081565b604051610125919061070a565b60405180910390f35b61014161013c36600461077b565b610286565b6040519015158152602001610125565b61015a60005481565b604051908152602001610125565b6101416101763660046107a5565b61029d565b61015a7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b6101aa601281565b60405160ff9091168152602001610125565b61015a60035481565b61015a6101d33660046107e1565b60016020526000908152604090205481565b61015a6101f33660046107e1565b60046020526000908152604090205481565b610118604051806040016040528060068152602001652aa72496ab1960d11b81525081565b61015a60055481565b61014161024136600461077b565b610331565b610259610254366004610803565b61033e565b005b61015a610269366004610876565b600260209081526000928352604080842090915290825290205481565b6000610293338484610557565b5060015b92915050565b6001600160a01b03831660009081526002602090815260408083203384529091528120546000191461031c576001600160a01b03841660009081526002602090815260408083203384529091529020546102f790836105b9565b6001600160a01b03851660009081526002602090815260408083203384529091529020555b61032784848461060f565b5060019392505050565b600061029333848461060f565b428410156103885760405162461bcd60e51b8152602060048201526012602482015271155b9a5cddd85c158c8e881156141254915160721b60448201526064015b60405180910390fd5b6003546001600160a01b038816600090815260046020526040812080549192917f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918b918b918b9190876103db836108bf565b909155506040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810187905260e0016040516020818303038152906040528051906020012060405160200161045492919061190160f01b81526002810192909252602282015260420190565b60408051601f198184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa1580156104bf573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116158015906104f55750886001600160a01b0316816001600160a01b0316145b6105415760405162461bcd60e51b815260206004820152601c60248201527f556e697377617056323a20494e56414c49445f5349474e415455524500000000604482015260640161037f565b61054c898989610557565b505050505050505050565b6001600160a01b0383811660008181526002602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6000826105c683826108d8565b91508111156102975760405162461bcd60e51b815260206004820152601560248201527464732d6d6174682d7375622d756e646572666c6f7760581b604482015260640161037f565b6001600160a01b03831660009081526001602052604090205461063290826105b9565b6001600160a01b03808516600090815260016020526040808220939093559084168152205461066190826106b5565b6001600160a01b0380841660008181526001602052604090819020939093559151908516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906105ac9085815260200190565b6000826106c283826108ef565b91508110156102975760405162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6164642d6f766572666c6f7760601b604482015260640161037f565b600060208083528351808285015260005b818110156107375785810183015185820160400152820161071b565b81811115610749576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b038116811461077657600080fd5b919050565b6000806040838503121561078e57600080fd5b6107978361075f565b946020939093013593505050565b6000806000606084860312156107ba57600080fd5b6107c38461075f565b92506107d16020850161075f565b9150604084013590509250925092565b6000602082840312156107f357600080fd5b6107fc8261075f565b9392505050565b600080600080600080600060e0888a03121561081e57600080fd5b6108278861075f565b96506108356020890161075f565b95506040880135945060608801359350608088013560ff8116811461085957600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561088957600080fd5b6108928361075f565b91506108a06020840161075f565b90509250929050565b634e487b7160e01b600052601160045260246000fd5b6000600182016108d1576108d16108a9565b5060010190565b6000828210156108ea576108ea6108a9565b500390565b60008219821115610902576109026108a9565b50019056fea26469706673582212209d1ffbb3faf222a66a1d2361f71cb99dc7f1fbec87cea349c13b82d7f1b4342f64736f6c634300080d0033";

export class UniswapV2ERC20__factory extends ContractFactory {
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
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<UniswapV2ERC20> {
    return super.deploy(overrides || {}) as Promise<UniswapV2ERC20>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): UniswapV2ERC20 {
    return super.attach(address) as UniswapV2ERC20;
  }
  connect(signer: Signer): UniswapV2ERC20__factory {
    return super.connect(signer) as UniswapV2ERC20__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UniswapV2ERC20Interface {
    return new utils.Interface(_abi) as UniswapV2ERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapV2ERC20 {
    return new Contract(address, _abi, signerOrProvider) as UniswapV2ERC20;
  }
}
