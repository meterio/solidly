

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { deployContract, getContract } from "./scripts/deployTool";
import {
  BaseV1Factory,
  BaseV1Router01,
  BaseV1,
  Ve,
  VeDist,
  BaseV1GaugeFactory,
  BaseV1BribeFactory,
  BaseV1Voter,
  BaseV2Minter,
  Erc20,
  BaseV1Pair,
  Gauge,
  Bribe,
  SolidlyLibrary
} from "./typechain";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { BigNumber } from "ethers";
var dotenv = require("dotenv");
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address,
      (await hre.ethers.provider.getBalance(account.address)).toString());
  }
});


task("deploy", "deploy contract")
  .addParam("wtoken", "wrapped token")
  .setAction(
    async ({ wtoken }, { ethers, run, network }) => {
      await run("compile");
      const [deployer] = await ethers.getSigners();

      const factory = await deployContract(
        "BaseV1Factory",
        network.name,
        ethers.getContractFactory,
        deployer,
        []
      ) as BaseV1Factory;

      const router = await deployContract(
        "BaseV1Router01",
        network.name,
        ethers.getContractFactory,
        deployer,
        [factory.address, wtoken]
      ) as BaseV1Router01;

      const token = await deployContract(
        "BaseV1",
        network.name,
        ethers.getContractFactory,
        deployer,
        []
      ) as BaseV1;

      const ve = await deployContract(
        "contracts/ve.sol:ve",
        network.name,
        ethers.getContractFactory,
        deployer,
        [token.address]
      ) as Ve;

      const ve_dist = await deployContract(
        "contracts/ve_dist.sol:ve_dist",
        network.name,
        ethers.getContractFactory,
        deployer,
        [ve.address]
      ) as VeDist;

      const gaugeFactory = await deployContract(
        "BaseV1GaugeFactory",
        network.name,
        ethers.getContractFactory,
        deployer,
        []
      ) as BaseV1GaugeFactory;

      const bribeFactory = await deployContract(
        "BaseV1BribeFactory",
        network.name,
        ethers.getContractFactory,
        deployer,
        []
      ) as BaseV1BribeFactory;

      const voter = await deployContract(
        "BaseV1Voter",
        network.name,
        ethers.getContractFactory,
        deployer,
        [ve.address, factory.address, gaugeFactory.address, bribeFactory.address]
      ) as BaseV1Voter;

      const minter = await deployContract(
        "BaseV2Minter",
        network.name,
        ethers.getContractFactory,
        deployer,
        [voter.address, ve.address, ve_dist.address]
      ) as BaseV2Minter;

      const library = await deployContract(
        "solidly_library",
        network.name,
        ethers.getContractFactory,
        deployer,
        [router.address]
      ) as SolidlyLibrary;

    }
  );

  task("deploy-lib", "deploy contract")
  .addParam("router", "wrapped token")
  .setAction(
    async ({ router }, { ethers, run, network }) => {
      await run("compile");
      const [deployer] = await ethers.getSigners();

      const library = await deployContract(
        "solidly_library",
        network.name,
        ethers.getContractFactory,
        deployer,
        [router]
      ) as SolidlyLibrary;

    }
  );
task("deploy-token", "deploy contract")
  .addParam("factory", "factory address")
  .setAction(
    async ({ factory }, { ethers, run, network }) => {
      await run("compile");
      const [wallet1, wallet2, wallet3, deployer] = await ethers.getSigners();

      const token = await deployContract(
        "BaseV1",
        network.name,
        ethers.getContractFactory,
        deployer,
        []
      ) as BaseV1;

      const ve = await deployContract(
        "contracts/ve.sol:ve",
        network.name,
        ethers.getContractFactory,
        deployer,
        [token.address]
      ) as Ve;

      const ve_dist = await deployContract(
        "contracts/ve_dist.sol:ve_dist",
        network.name,
        ethers.getContractFactory,
        deployer,
        [ve.address]
      ) as VeDist;

      const gaugeFactory = await deployContract(
        "BaseV1GaugeFactory",
        network.name,
        ethers.getContractFactory,
        deployer,
        []
      ) as BaseV1GaugeFactory;

      const bribeFactory = await deployContract(
        "BaseV1BribeFactory",
        network.name,
        ethers.getContractFactory,
        deployer,
        []
      ) as BaseV1BribeFactory;

      const voter = await deployContract(
        "BaseV1Voter",
        network.name,
        ethers.getContractFactory,
        deployer,
        [ve.address, factory, gaugeFactory.address, bribeFactory.address]
      ) as BaseV1Voter;

      await ve.setVoter(voter.address);

      const minter = await deployContract(
        "BaseV2Minter",
        network.name,
        ethers.getContractFactory,
        deployer,
        [voter.address, ve.address, ve_dist.address]
      ) as BaseV2Minter;

    }
  );


task("deploy-router", "deploy contract")
  .addParam("factory", "factory address")
  .addParam("wtoken", "wrapped token")
  .setAction(
    async ({ factory, wtoken }, { ethers, run, network }) => {
      await run("compile");
      const [deployer] = await ethers.getSigners();

      const router = await deployContract(
        "BaseV1Router01",
        network.name,
        ethers.getContractFactory,
        deployer,
        [factory, wtoken]
      ) as BaseV1Router01;
    }
  );

//0x1631605EE936D4E1Ffe1be02D8a97608A1483B3D

task("create-gauge", "deploy contract")
  .setAction(
    async ({ }, { ethers, run, network }) => {
      await run("compile");
      const [deployer] = await ethers.getSigners();
      const pool = "0x1631605EE936D4E1Ffe1be02D8a97608A1483B3D";
      const voterAddr = "0xa79fb8e162490a0d2fb63733f7fb396285e91c38";
      const baseV1 = "0x883cED020E7bF54039cBC986b7fDcd2033E90c2a";
      let receipt;

      const volt = await ethers.getContractAt("BaseV1", baseV1, deployer) as BaseV1;
      await volt.approve(voterAddr, ethers.constants.MaxUint256);

      const pair = await ethers.getContractAt("BaseV1Pair", pool, deployer) as BaseV1Pair;
      const tokenA = await pair.token0();
      const tokenB = await pair.token1();

      const voter = await ethers.getContractAt("BaseV1Voter", voterAddr, deployer) as BaseV1Voter;

      const isWhiteListA = await voter.isWhitelisted(tokenA);
      if (isWhiteListA) {
        console.log(tokenA, isWhiteListA);
      } else {
        receipt = await voter.whitelist(tokenA, 0);
        console.log(await receipt.wait())
      }
      const isWhiteListB = await voter.isWhitelisted(tokenB);
      if (isWhiteListB) {
        console.log(tokenB, isWhiteListB);
      } else {
        receipt = await voter.whitelist(tokenB, 0);
        console.log(await receipt.wait())
      }

      receipt = await voter.createGauge(pool);
      console.log(await receipt.wait())
    }
  );


task("deposit-gauge", "deploy contract")
  .setAction(
    async ({ }, { ethers, run, network }) => {
      await run("compile");
      const [deployer] = await ethers.getSigners();
      const pool = "0x17C73Fe073373796917DAFb0673D48D3A535e52A";
      const voterAddr = "0xa79fb8e162490a0d2fb63733f7fb396285e91c38";
      const baseV1 = "0x883cED020E7bF54039cBC986b7fDcd2033E90c2a";
      const gaugeAddr = "0x6642c7beb379c1649a50dfa859003a0d1de413b4";
      const owner = "0x57e7e16a2326dc41d02402103a73b4464a8b3eeb";
      const veAddr = "0x9372cE90523ac41b3aaa37e9a9aACD9F558bcc39";
      let receipt;

      const ve = await ethers.getContractAt("contracts/ve.sol:ve",veAddr,deployer)as Ve;
      const gauge = await ethers.getContractAt("Gauge",gaugeAddr,deployer) as Gauge;
      const stake = await gauge.stake();
      const stakeInstant = await ethers.getContractAt("BaseV1",stake,deployer) as BaseV1;
      const allowance = await stakeInstant.allowance(owner,gaugeAddr);
      const ownerOf = await ve.ownerOf(1);
      const tokenIds = await gauge.tokenIds(owner);
      const voter = await ethers.getContractAt("BaseV1Voter",voterAddr,deployer) as BaseV1Voter;
      const isGauge = await voter.isGauge(gaugeAddr);
      const isVoter = await ve.voter();
      const isApprovedOrOwner = await ve.isApprovedOrOwner(owner,1);
      const totalWeight = await voter.totalWeight();
      const weight = await ve.balanceOfNFT(1);
      const gaugesPool = await voter.gauges(pool);
      const votesTokenIdPool = await voter.votes(1,pool);
      const poolWeight = BigNumber.from(100).mul(weight).div(100);
      const poolForGauge = await voter.poolForGauge(gaugeAddr);
      const supplied = await voter.weights(poolForGauge);
      const bribeAddr = await voter.bribes(gaugeAddr);
      const bribe = await ethers.getContractAt("Bribe",bribeAddr,deployer) as Bribe;
      const bribesFactory = await bribe.factory();


      console.log(
        allowance,
        ownerOf,
        tokenIds,
        isGauge,
        isVoter,
        isApprovedOrOwner,
        totalWeight,
        weight,
        gaugesPool,
        votesTokenIdPool,
        poolWeight,
        poolForGauge,
        supplied,
        bribeAddr,
        bribesFactory
        );
    }
  );
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers",
            "metadata",
            "storageLayout"
          ],
          "": [
            "ast"
          ]
        }
      }
    },
  },
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
    metertest: {
      url: `https://rpctest.meter.io`,
      chainId: 83,
      gasPrice: 500000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
    metermain: {
      url: `https://rpc.meter.io`,
      chainId: 82,
      gasPrice: 500000000000,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

