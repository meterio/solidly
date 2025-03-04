import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { Contract, Signer, utils } from "ethers";

export const allowVerifyChain = [
  "mainnet",
  "ropsten",
  "rinkeby",
  "goerli",
  "kovan",
  "bsctest",
  "bscmain",
  "hecotest",
  "hecomain",
  "maticmain",
  "ftmtest",
  "ftmmain",
  "hoomain",
];

type AddressMap = { [name: string]: string };

export function compileSetting(version: string, runs: number) {
  return {
    version: version,
    settings: {
      optimizer: {
        enabled: true,
        runs: runs,
      }, outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
            "metadata", // <-- add this
          ]
        },
      },
    },
  };
}

export async function deployContract(
  name: string,
  network: string,
  getContractFactory: Function,
  signer: Signer,
  args: Array<any> = [],
  libraries: Object = {}
): Promise<Contract> {
  const factory = await getContractFactory(name, {
    signer: signer,
    libraries: libraries,
  });
  const contract = await factory.deploy(...args);
  console.log("Deploying", name);
  console.log("  to", contract.address);
  console.log("  in", contract.deployTransaction.hash);
  // console.log("  receipt", await contract.deployTransaction.wait());
  await saveFile(network, name, contract, args, libraries);
  return contract.deployed();
}

export function getContract(network: string, name: string) {
  const nameArr = name.split(":");
  const contractName = nameArr.length > 1 ? nameArr[1] : nameArr[0];
  const path = `./deployments/${network}/`;
  const latest = `${contractName}.json`;

  if (existsSync(path + latest)) {
    let json = JSON.parse(readFileSync(path + latest).toString());
    console.log("Deployed", name);
    console.log("  on", json.address);
    return json;
  } else {
    return "";
  }
}

export function expandDecimals(amount: any, decimals = 18) {
  return utils.parseUnits(String(amount), decimals);
}
export async function saveFile(
  network: string,
  name: string,
  contract: Contract,
  args: Array<any> = [],
  libraries: Object = {}
) {
  const nameArr = name.split(":");
  const contractName = nameArr.length > 1 ? nameArr[1] : nameArr[0];
  const path = `./deployments/${network}/`;
  const file = `${contractName}.json`;

  mkdirSync(path, { recursive: true });

  if (contractName != name) {
    writeFileSync(path + file, JSON.stringify({
      address: contract.address,
      constructorArguments: args,
      libraries: libraries,
      contract: name
    }));
  } else {
    writeFileSync(path + file, JSON.stringify({
      address: contract.address,
      constructorArguments: args,
      libraries: libraries
    }));
  }
}

type Config = {
  factory: string;
  router: string;
  wtoken: string;
  token: string;
  ve: string;
  ve_dist: string;
  gaugeFactory: string;
  bribeFactory: string;
  voter: string;
  minter: string;
  library: string;
}

export function loadConfig(network: string, proxy: boolean = false): Config {
  const path = `./deployments/${network}/`;
  const latest = proxy ? `config-proxy.json` : `config.json`;

  if (existsSync(path + latest)) {
    let json = JSON.parse(readFileSync(path + latest).toString()) as Config;
    return json;
  } else {

    let json: Config = {
      factory: "",
      router: "",
      wtoken: "",
      token: "",
      ve: "",
      ve_dist: "",
      gaugeFactory: "",
      bribeFactory: "",
      voter: "",
      minter: "",
      library: ""
    };
    return json;
  }
}

export function saveConfig(network: string, json: Config, proxy: boolean = false) {
  const path = `./deployments/${network}/`;
  const latest = proxy ? `config-proxy.json` : `config.json`;

  mkdirSync(path, { recursive: true });
  writeFileSync(path + latest, JSON.stringify(json));
}
