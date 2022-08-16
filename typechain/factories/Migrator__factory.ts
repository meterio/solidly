/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Migrator, MigratorInterface } from "../Migrator";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IUniswapV2Factory",
        name: "_oldFactory",
        type: "address",
      },
      {
        internalType: "contract IRouter",
        name: "_router",
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
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "getOldPair",
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
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
      {
        internalType: "bool",
        name: "stable",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountBMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
      {
        internalType: "bool",
        name: "stable",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountBMin",
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
    name: "migrateWithPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "oldFactory",
    outputs: [
      {
        internalType: "contract IUniswapV2Factory",
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
        internalType: "uint256",
        name: "amountA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserveA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserveB",
        type: "uint256",
      },
    ],
    name: "quoteLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amountB",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountBMin",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amountA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountB",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "contract IRouter",
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
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "sortTokens",
    outputs: [
      {
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "token1",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161138538038061138583398101604081905261002f91610078565b600080546001600160a01b039384166001600160a01b031991821617909155600180549290931691161790556100b2565b6001600160a01b038116811461007557600080fd5b50565b6000806040838503121561008b57600080fd5b825161009681610060565b60208401519092506100a781610060565b809150509250929050565b6112c4806100c16000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063a15eb1a41161005b578063a15eb1a414610118578063ae5688681461012b578063e2dc85dc1461014c578063f887ea401461017457600080fd5b8063027929a21461008d5780631bd6dfe1146100a2578063544caa56146100d257806395da253c14610105575b600080fd5b6100a061009b366004610ec4565b610187565b005b6000546100b5906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100e56100e0366004610f64565b6102a1565b604080516001600160a01b039384168152929091166020830152016100c9565b6100b5610113366004610f64565b610374565b6100a0610126366004610f9d565b6103f2565b61013e61013936600461100b565b6104ac565b6040519081526020016100c9565b61015f61015a366004611037565b610565565b604080519283526020830191909152016100c9565b6001546100b5906001600160a01b031681565b6000805460405163e6a4390560e01b81526001600160a01b038d811660048301528c811660248301529091169063e6a4390590604401602060405180830381865afa1580156101da573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101fe9190611088565b60405163d505accf60e01b8152336004820152306024820152604481018a90526064810187905260ff8616608482015260a4810185905260c481018490529091506001600160a01b0382169063d505accf9060e401600060405180830381600087803b15801561026d57600080fd5b505af1158015610281573d6000803e3d6000fd5b505050506102948b8b8b8b8b8b8b6103f2565b5050505050505050505050565b600080826001600160a01b0316846001600160a01b0316036103005760405162461bcd60e51b81526020600482015260136024820152724944454e544943414c5f41444452455353455360681b60448201526064015b60405180910390fd5b826001600160a01b0316846001600160a01b031610610320578284610323565b83835b90925090506001600160a01b03821661036d5760405162461bcd60e51b815260206004820152600c60248201526b5a45524f5f4144445245535360a01b60448201526064016102f7565b9250929050565b6000805460405163e6a4390560e01b81526001600160a01b03858116600483015284811660248301529091169063e6a4390590604401602060405180830381865afa1580156103c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103eb9190611088565b9392505050565b428110156104365760405162461bcd60e51b8152602060048201526011602482015270135a59dc985d1bdc8e8811561412549151607a1b60448201526064016102f7565b6000806104468989888888610565565b9150915060008061045a8b8b8b878761074d565b9150915081841115610485576104853361047484876110bb565b6001600160a01b038e16919061087b565b80831115610294576102943361049b83866110bb565b6001600160a01b038d16919061087b565b60008084116104f35760405162461bcd60e51b8152602060048201526013602482015272125394d551919250d251539517d05353d55395606a1b60448201526064016102f7565b6000831180156105035750600082115b6105485760405162461bcd60e51b8152602060048201526016602482015275494e53554646494349454e545f4c495155494449545960501b60448201526064016102f7565b8261055383866110d2565b61055d91906110f1565b949350505050565b6000805460405163e6a4390560e01b81526001600160a01b03888116600483015287811660248301528392839291169063e6a4390590604401602060405180830381865afa1580156105bb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105df9190611088565b90506105f66001600160a01b0382163383896108e3565b60405163226bf2d160e21b815230600482015260009081906001600160a01b038416906389afcb449060240160408051808303816000875af1158015610640573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106649190611113565b9150915060006106748b8b6102a1565b509050806001600160a01b03168b6001600160a01b03161461069757818361069a565b82825b9096509450878610156106ef5760405162461bcd60e51b815260206004820152601f60248201527f4d69677261746f723a20494e53554646494349454e545f415f414d4f554e540060448201526064016102f7565b8685101561073f5760405162461bcd60e51b815260206004820152601f60248201527f4d69677261746f723a20494e53554646494349454e545f425f414d4f554e540060448201526064016102f7565b505050509550959350505050565b60008061075d8787878787610921565b60015460405163260f701f60e11b81529294509092506000916001600160a01b0390911690634c1ee03e9061079a908b908b908b90600401611137565b602060405180830381865afa1580156107b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107db9190611088565b90506107f16001600160a01b038916828561087b565b6108056001600160a01b038816828461087b565b6040516335313c2160e11b81523360048201526001600160a01b03821690636a627842906024016020604051808303816000875af115801561084b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086f919061115b565b50509550959350505050565b6040516001600160a01b0383166024820152604481018290526108de90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610b92565b505050565b6040516001600160a01b038085166024830152831660448201526064810182905261091b9085906323b872dd60e01b906084016108a7565b50505050565b6000806000600160009054906101000a90046001600160a01b03166001600160a01b031663c45a01556040518163ffffffff1660e01b8152600401602060405180830381865afa158015610979573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061099d9190611088565b6040516306801cc360e41b81529091506000906001600160a01b03831690636801cc30906109d3908c908c908c90600401611137565b602060405180830381865afa1580156109f0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a149190611088565b6001600160a01b031603610a97576040516320b7f73960e21b81526001600160a01b038216906382dfdce490610a52908b908b908b90600401611137565b6020604051808303816000875af1158015610a71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a959190611088565b505b600080610b1c600160009054906101000a90046001600160a01b03166001600160a01b031663c45a01556040518163ffffffff1660e01b8152600401602060405180830381865afa158015610af0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b149190611088565b8b8b8b610c64565b91509150816000148015610b2e575080155b15610b3e57869450859350610b85565b6000610b4b8884846104ac565b9050868111610b5f5787955093508361073f565b6000610b6c8884866104ac565b905088811115610b7e57610b7e611174565b9550869450505b5050509550959350505050565b6000610be7826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610d959092919063ffffffff16565b8051909150156108de5780806020019051810190610c05919061118a565b6108de5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016102f7565b6000806000610c7386866102a1565b509050600080886001600160a01b0316636801cc308989896040518463ffffffff1660e01b8152600401610ca993929190611137565b602060405180830381865afa158015610cc6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cea9190611088565b6001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015610d27573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d4b91906111c3565b506001600160701b031691506001600160701b03169150826001600160a01b0316886001600160a01b031614610d82578082610d85565b81815b909a909950975050505050505050565b60606001600160a01b0384163b610dee5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102f7565b600080856001600160a01b031685604051610e09919061123f565b6000604051808303816000865af19150503d8060008114610e46576040519150601f19603f3d011682016040523d82523d6000602084013e610e4b565b606091505b5091509150610e5b828286610e65565b9695505050505050565b60608315610e745750816103eb565b825115610e845782518084602001fd5b8160405162461bcd60e51b81526004016102f7919061125b565b6001600160a01b0381168114610eb357600080fd5b50565b8015158114610eb357600080fd5b6000806000806000806000806000806101408b8d031215610ee457600080fd5b8a35610eef81610e9e565b995060208b0135610eff81610e9e565b985060408b0135610f0f81610eb6565b975060608b0135965060808b0135955060a08b0135945060c08b0135935060e08b013560ff81168114610f4157600080fd5b809350506101008b013591506101208b013590509295989b9194979a5092959850565b60008060408385031215610f7757600080fd5b8235610f8281610e9e565b91506020830135610f9281610e9e565b809150509250929050565b600080600080600080600060e0888a031215610fb857600080fd5b8735610fc381610e9e565b96506020880135610fd381610e9e565b95506040880135610fe381610eb6565b969995985095966060810135965060808101359560a0820135955060c0909101359350915050565b60008060006060848603121561102057600080fd5b505081359360208301359350604090920135919050565b600080600080600060a0868803121561104f57600080fd5b853561105a81610e9e565b9450602086013561106a81610e9e565b94979496505050506040830135926060810135926080909101359150565b60006020828403121561109a57600080fd5b81516103eb81610e9e565b634e487b7160e01b600052601160045260246000fd5b6000828210156110cd576110cd6110a5565b500390565b60008160001904831182151516156110ec576110ec6110a5565b500290565b60008261110e57634e487b7160e01b600052601260045260246000fd5b500490565b6000806040838503121561112657600080fd5b505080516020909101519092909150565b6001600160a01b039384168152919092166020820152901515604082015260600190565b60006020828403121561116d57600080fd5b5051919050565b634e487b7160e01b600052600160045260246000fd5b60006020828403121561119c57600080fd5b81516103eb81610eb6565b80516001600160701b03811681146111be57600080fd5b919050565b6000806000606084860312156111d857600080fd5b6111e1846111a7565b92506111ef602085016111a7565b9150604084015163ffffffff8116811461120857600080fd5b809150509250925092565b60005b8381101561122e578181015183820152602001611216565b8381111561091b5750506000910152565b60008251611251818460208701611213565b9190910192915050565b602081526000825180602084015261127a816040850160208701611213565b601f01601f1916919091016040019291505056fea2646970667358221220cb62503d4db69f67697226fc976140da4bcab7c3e306c91708cbeae3885e5f3364736f6c634300080d0033";

export class Migrator__factory extends ContractFactory {
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
    _oldFactory: string,
    _router: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Migrator> {
    return super.deploy(
      _oldFactory,
      _router,
      overrides || {}
    ) as Promise<Migrator>;
  }
  getDeployTransaction(
    _oldFactory: string,
    _router: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_oldFactory, _router, overrides || {});
  }
  attach(address: string): Migrator {
    return super.attach(address) as Migrator;
  }
  connect(signer: Signer): Migrator__factory {
    return super.connect(signer) as Migrator__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MigratorInterface {
    return new utils.Interface(_abi) as MigratorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Migrator {
    return new Contract(address, _abi, signerOrProvider) as Migrator;
  }
}
