/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BaseV2Minter, BaseV2MinterInterface } from "../BaseV2Minter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "__voter",
        type: "address",
      },
      {
        internalType: "address",
        name: "__ve",
        type: "address",
      },
      {
        internalType: "address",
        name: "__ve_dist",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ve_dist_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voter_amount",
        type: "uint256",
      },
    ],
    name: "Send",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
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
    name: "_token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_ve",
    outputs: [
      {
        internalType: "contract IVotingEscrow",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_ve_dist",
    outputs: [
      {
        internalType: "contract IVeDist",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_voter",
    outputs: [
      {
        internalType: "contract IBaseV1Voter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "active_period",
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
        internalType: "uint256",
        name: "_ve_dist_ratio",
        type: "uint256",
      },
    ],
    name: "adminSetVeRatio",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getRoleMemberIndex",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "update_period",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ve_dist_ratio",
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
    name: "ve_dist_ratio_max",
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
];

const _bytecode =
  "0x6101006040523480156200001257600080fd5b50604051620010b5380380620010b58339810160408190526200003591620001f4565b816001600160a01b031663fc0c546a6040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000074573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200009a91906200023e565b6001600160a01b0390811660805283811660a05282811660c052811660e0526224ea00620000c981426200025c565b620000d591906200027f565b600255620000e5600033620000ee565b505050620002ad565b620000fa8282620000fe565b5050565b600082815260208181526040909120620001239183906200097c62000165821b17901c565b15620000fa5760405133906001600160a01b0383169084907f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d90600090a45050565b60006200017c836001600160a01b03841662000185565b90505b92915050565b6000818152600183016020526040812054620001ce575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556200017f565b5060006200017f565b80516001600160a01b0381168114620001ef57600080fd5b919050565b6000806000606084860312156200020a57600080fd5b6200021584620001d7565b92506200022560208501620001d7565b91506200023560408501620001d7565b90509250925092565b6000602082840312156200025157600080fd5b6200017c82620001d7565b6000826200027a57634e487b7160e01b600052601260045260246000fd5b500490565b6000816000190483118215151615620002a857634e487b7160e01b600052601160045260246000fd5b500290565b60805160a05160c05160e051610d966200031f6000396000818161015601528181610664015281816107100152610783015260006102000152600081816101bd0152818161081901526108d10152600081816102b0015281816105bb01528181610696015261084b0152610d966000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c806391d14854116100a2578063ca15c87311610071578063ca15c8731461027c578063d13996081461028f578063d547741f14610298578063ecd0c0c3146102ab578063ed29fc11146102d257600080fd5b806391d1485414610235578063a217fddf14610258578063af9c894d14610260578063b990868c1461027357600080fd5b80633db9b42a116100e95780633db9b42a146101b85780634486645a146101df5780634e0df3f6146101e85780638dd598fb146101fb5780639010d07c1461022257600080fd5b8063248a9ca31461011b5780632c6b2f0c146101515780632f2ff15d1461019057806336568abe146101a5575b600080fd5b61013e610129366004610bfc565b60009081526020819052604090206002015490565b6040519081526020015b60405180910390f35b6101787f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610148565b6101a361019e366004610c15565b6102da565b005b6101a36101b3366004610c15565b61036d565b6101787f000000000000000000000000000000000000000000000000000000000000000081565b61013e61271081565b61013e6101f6366004610c15565b6103e7565b6101787f000000000000000000000000000000000000000000000000000000000000000081565b610178610230366004610c51565b610412565b610248610243366004610c15565b610431565b6040519015158152602001610148565b61013e600081565b6101a361026e366004610bfc565b610449565b61013e60015481565b61013e61028a366004610bfc565b610491565b61013e60025481565b6101a36102a6366004610c15565b6104a8565b6101787f000000000000000000000000000000000000000000000000000000000000000081565b61013e610529565b6000828152602081905260409020600201546102f69033610431565b61035f5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e60448201526e0818591b5a5b881d1bc819dc985b9d608a1b60648201526084015b60405180910390fd5b6103698282610991565b5050565b6001600160a01b03811633146103dd5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610356565b61036982826109ea565b6000828152602081815260408083206001600160a01b03851684526001019091529020545b92915050565b600082815260208190526040812061042a9083610a43565b9392505050565b600082815260208190526040812061042a9083610a4f565b610454600033610431565b61048c5760405162461bcd60e51b81526020600482015260096024820152683337b93134b23232b760b91b6044820152606401610356565b600155565b600081815260208190526040812061040c90610a71565b6000828152602081905260409020600201546104c49033610431565b6103dd5760405162461bcd60e51b815260206004820152603060248201527f416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e60448201526f2061646d696e20746f207265766f6b6560801b6064820152608401610356565b60006105358133610431565b61056d5760405162461bcd60e51b81526020600482015260096024820152683337b93134b23232b760b91b6044820152606401610356565b60025461057d6224ea0082610c89565b4210610977576224ea006105918142610ca1565b61059b9190610cc3565b60028190556040516370a0823160e01b81523060048201529091506000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa15801561060a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062e9190610ce2565b90506000612710600154836106439190610cc3565b61064d9190610ca1565b60405163a9059cbb60e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018390529192507f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb906044016020604051808303816000875af11580156106e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107059190610cfb565b61070e57600080fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663811a40fe6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561076957600080fd5b505af115801561077d573d6000803e3d6000fd5b505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663b21ed5026040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156107dc57600080fd5b505af11580156107f0573d6000803e3d6000fd5b50505050600081836108029190610d1d565b60405163095ea7b360e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018390529192507f00000000000000000000000000000000000000000000000000000000000000009091169063095ea7b3906044016020604051808303816000875af1158015610896573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108ba9190610cfb565b50604051633c6b16ab60e01b8152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690633c6b16ab90602401600060405180830381600087803b15801561091d57600080fd5b505af1158015610931573d6000803e3d6000fd5b505060015460408051918252602082018690523393507fb3a7f4e19ac1e31fc41d825d7a63c4af7b79cda95d9abfb66c36e6987706bf9792500160405180910390a25050505b905090565b600061042a836001600160a01b038416610a7b565b60008281526020819052604090206109a9908261097c565b156103695760405133906001600160a01b0383169084907f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d90600090a45050565b6000828152602081905260409020610a029082610aca565b156103695760405133906001600160a01b0383169084907ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b90600090a45050565b600061042a8383610adf565b6001600160a01b0381166000908152600183016020526040812054151561042a565b600061040c825490565b6000818152600183016020526040812054610ac25750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561040c565b50600061040c565b600061042a836001600160a01b038416610b09565b6000826000018281548110610af657610af6610d34565b9060005260206000200154905092915050565b60008181526001830160205260408120548015610bf2576000610b2d600183610d1d565b8554909150600090610b4190600190610d1d565b9050818114610ba6576000866000018281548110610b6157610b61610d34565b9060005260206000200154905080876000018481548110610b8457610b84610d34565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610bb757610bb7610d4a565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061040c565b600091505061040c565b600060208284031215610c0e57600080fd5b5035919050565b60008060408385031215610c2857600080fd5b8235915060208301356001600160a01b0381168114610c4657600080fd5b809150509250929050565b60008060408385031215610c6457600080fd5b50508035926020909101359150565b634e487b7160e01b600052601160045260246000fd5b60008219821115610c9c57610c9c610c73565b500190565b600082610cbe57634e487b7160e01b600052601260045260246000fd5b500490565b6000816000190483118215151615610cdd57610cdd610c73565b500290565b600060208284031215610cf457600080fd5b5051919050565b600060208284031215610d0d57600080fd5b8151801515811461042a57600080fd5b600082821015610d2f57610d2f610c73565b500390565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220395aadfa0f6170ada2864ff7634e933594a853942ee28f4b7f6a7991b22a453f64736f6c634300080b0033";

export class BaseV2Minter__factory extends ContractFactory {
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
    __voter: string,
    __ve: string,
    __ve_dist: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BaseV2Minter> {
    return super.deploy(
      __voter,
      __ve,
      __ve_dist,
      overrides || {}
    ) as Promise<BaseV2Minter>;
  }
  getDeployTransaction(
    __voter: string,
    __ve: string,
    __ve_dist: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      __voter,
      __ve,
      __ve_dist,
      overrides || {}
    );
  }
  attach(address: string): BaseV2Minter {
    return super.attach(address) as BaseV2Minter;
  }
  connect(signer: Signer): BaseV2Minter__factory {
    return super.connect(signer) as BaseV2Minter__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BaseV2MinterInterface {
    return new utils.Interface(_abi) as BaseV2MinterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BaseV2Minter {
    return new Contract(address, _abi, signerOrProvider) as BaseV2Minter;
  }
}
