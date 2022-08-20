import { ethers, web3, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Logger } from "tslog";
import logSettings from "../../log_settings";
import { BigNumber, ContractFactory, utils } from "ethers";
import { Libraries, DeployOptions } from "hardhat-deploy/dist/types";
import { parseUnits } from "ethers/lib/utils";
import {
  BribeFactory,
  Controller,
  Volt,
  VoltFactory,
  Minter,
  VoltRouter01,
  VoltVoter,
  GaugeFactory,
  GovernanceTreasury,
  Token,
  Ve,
  VeDist,
  SolidlyLibrary,
  VoltPair,
  ControllerUpgradeable,
  VeUpgradeable,
  VeDistUpgradeable,
  VoltVoterUpgradeable,
  MinterUpgradeable
} from "../../typechain";
import { Misc } from "../Misc";
import { CoreAddresses } from "./CoreAddresses";

const log: Logger = new Logger(logSettings);

const libraries = new Map<string, string>([
  ['', '']
]);

export class Deploy {

  // ************ CONTRACT CONNECTION **************************

  public static async deployContract<T extends ContractFactory>(
    signer: SignerWithAddress,
    name: string,
    // tslint:disable-next-line:no-any
    ...args: any[]
  ) {
    log.info(`Deploying ${name}`);
    log.info("Account balance: " + utils.formatUnits(await signer.getBalance(), 18));
    const { deploy } = deployments;

    const gasPrice = await web3.eth.getGasPrice();
    log.info("Gas price: " + gasPrice);
    const lib: string | undefined = libraries.get(name);
    let _override: DeployOptions;
    if (lib) {
      log.info('DEPLOY LIBRARY', lib, 'for', name);
      const libAddress = (await Deploy.deployContract(signer, lib)).address;
      const librariesObj: Libraries = {};
      librariesObj[lib] = libAddress;
      _override = {
        from: signer.address,
        args: args,
        libraries: librariesObj,
        skipIfAlreadyDeployed: true
      }
    } else {
      _override = {
        from: signer.address,
        args: args,
        skipIfAlreadyDeployed: false
      }
    }
    const result = await deploy(name, _override);
    const instance = await ethers.getContractAt(name, result.address, signer);
    log.info('Deploy tx:', result.transactionHash);
    log.info('Receipt', result.address)
    return instance;
  }

  public static async deployVolt(signer: SignerWithAddress) {
    return (await Deploy.deployContract(signer, 'Volt')) as Volt;
  }

  public static async deployToken(signer: SignerWithAddress, name: string, symbol: string, decimal: number) {
    return (await Deploy.deployContract(signer, 'Token', name, symbol, decimal, signer.address)) as Token;
  }

  public static async deployGaugeFactory(signer: SignerWithAddress) {
    return (await Deploy.deployContract(signer, 'GaugeFactory')) as GaugeFactory;
  }

  public static async deployBribeFactory(signer: SignerWithAddress) {
    return (await Deploy.deployContract(signer, 'BribeFactory')) as BribeFactory;
  }

  public static async deployVoltFactory(signer: SignerWithAddress) {
    return (await Deploy.deployContract(signer, 'VoltFactory')) as VoltFactory;
  }

  public static async deployGovernanceTreasury(signer: SignerWithAddress) {
    return (await Deploy.deployContract(signer, 'GovernanceTreasury')) as GovernanceTreasury;
  }

  public static async deployVoltRouter01(
    signer: SignerWithAddress,
    factory: string,
    networkToken: string,
  ) {
    return (await Deploy.deployContract(signer, 'VoltRouter01', factory, networkToken)) as VoltRouter01;
  }

  public static async deployVe(signer: SignerWithAddress, token: string, controller: string) {
    return (await Deploy.deployContract(signer, 'Ve', token, controller)) as Ve;
  }

  public static async deployVeDist(signer: SignerWithAddress, ve: string) {
    return (await Deploy.deployContract(signer, 'VeDist', ve)) as VeDist;
  }

  public static async deployLibrary(signer: SignerWithAddress, router: string) {
    return (await Deploy.deployContract(signer, 'SolidlyLibrary', router)) as SolidlyLibrary;
  }

  public static async deployPair(signer: SignerWithAddress) {
    return (await Deploy.deployContract(signer, 'VoltPair')) as VoltPair;
  }

  public static async deployVoltVoter(
    signer: SignerWithAddress,
    ve: string,
    factory: string,
    gauges: string,
    bribes: string,
  ) {
    return (await Deploy.deployContract(
      signer,
      'VoltVoter',
      ve,
      factory,
      gauges,
      bribes,
    )) as VoltVoter;
  }

  public static async deployVoltMinter(
    signer: SignerWithAddress,
    ve: string,
    controller: string
  ) {
    return (await Deploy.deployContract(
      signer,
      'Minter',
      ve,
      controller
    )) as Minter;
  }

  public static async deployCore(
    signer: SignerWithAddress,
    networkToken: string,
    voterTokens: string[],
    initialHolder: string[],
    initialAmount: string
  ) {
    const [baseFactory, router] = await Deploy.deployDex(signer, networkToken);

    const [
      controller,
      token,
      gaugesFactory,
      bribesFactory,
      ve,
      veDist,
      voter,
      minter,
    ] = await Deploy.deployVoltSystem(
      signer,
      voterTokens,
      baseFactory.address,
      initialHolder,
      initialAmount
    );

    return new CoreAddresses(
      token as Volt,
      gaugesFactory as GaugeFactory,
      bribesFactory as BribeFactory,
      baseFactory as VoltFactory,
      router as VoltRouter01,
      ve as Ve,
      veDist as VeDist,
      voter as VoltVoter,
      minter as Minter
    );
  }


  public static async deployDex(
    signer: SignerWithAddress,
    networkToken: string,
  ) {
    const baseFactory = await Deploy.deployVoltFactory(signer);
    const router = await Deploy.deployVoltRouter01(signer, baseFactory.address, networkToken);

    return [baseFactory, router];
  }

  public static async deployVoltSystem(
    signer: SignerWithAddress,
    voterTokens: string[],
    baseFactory: string,
    initialHolder: string[],
    initialAmount: string
  ) {
    const controller = await Deploy.deployContract(signer, 'Controller') as Controller;
    const token = await Deploy.deployVolt(signer);
    const ve = await Deploy.deployVe(signer, token.address, controller.address);
    const gaugesFactory = await Deploy.deployGaugeFactory(signer);
    const bribesFactory = await Deploy.deployBribeFactory(signer);


    const veDist = await Deploy.deployVeDist(signer, ve.address);
    const voter = await Deploy.deployVoltVoter(signer, ve.address, baseFactory, gaugesFactory.address, bribesFactory.address);

    const minter = await Deploy.deployVoltMinter(signer, ve.address, controller.address);

    for (let i = 0; i < initialHolder.length; i++) {
      await Misc.runAndWait(() => token.mint(initialHolder[i], parseUnits(initialAmount)));
    }
    await Misc.runAndWait(() => veDist.setDepositor(minter.address));
    await Misc.runAndWait(() => controller.setVeDist(veDist.address));
    await Misc.runAndWait(() => controller.setVoter(voter.address));
    await Misc.runAndWait(() => minter.grantRole(ethers.constants.HashZero, voter.address));
    voterTokens.push(token.address);
    await Misc.runAndWait(() => voter.initialize(voterTokens, minter.address));

    return [
      controller,
      token,
      gaugesFactory,
      bribesFactory,
      ve,
      veDist,
      voter,
      minter,
    ];
  }

  public static async updateVoltSystem(
    signer: SignerWithAddress,
    controllerAddr: string,
    tokenAddr: string,
    baseFactory: string,
    veAddr: string,
    voterTokens: string[]
  ) {
    const controller = await ethers.getContractAt('Controller', controllerAddr, signer) as Controller;
    const veDist = await Deploy.deployVeDist(signer, veAddr);

    const gaugesFactory = await Deploy.deployGaugeFactory(signer);
    const bribesFactory = await Deploy.deployBribeFactory(signer);
    const voter = await Deploy.deployVoltVoter(signer, veAddr, baseFactory, gaugesFactory.address, bribesFactory.address);
    const minter = await Deploy.deployVoltMinter(signer, veAddr, controller.address);

    await Misc.runAndWait(() => veDist.setDepositor(minter.address));
    await Misc.runAndWait(() => controller.setVeDist(veDist.address));
    await Misc.runAndWait(() => controller.setVoter(voter.address));
    await Misc.runAndWait(() => minter.grantRole(ethers.constants.HashZero, voter.address));
    voterTokens.push(tokenAddr);
    await Misc.runAndWait(() => voter.initialize(voterTokens, minter.address));

    return [
      veDist,
      gaugesFactory,
      bribesFactory,
      voter,
      minter,
    ];
  }

  public static async deployUpgradeableSystem(
    deployer: SignerWithAddress,
    admin: SignerWithAddress,
    tokenAddr: string,
    baseFactory: string
  ) {
    const controllerImpl = await Deploy.deployContract(deployer, 'ControllerUpgradeable') as ControllerUpgradeable;
    const controllerProxy = await Deploy.deployContract(deployer, "TransparentUpgradeableProxy",
      controllerImpl.address,
      deployer.address,
      controllerImpl.interface.encodeFunctionData("initialize", [admin.address])
    );
    const veImpl = await Deploy.deployContract(deployer, "VeUpgradeable") as VeUpgradeable;
    const veProxy = await Deploy.deployContract(deployer, "TransparentUpgradeableProxy",
      veImpl.address,
      deployer.address,
      veImpl.interface.encodeFunctionData("initialize", [tokenAddr, controllerProxy.address])
    );
    const gaugesFactory = await Deploy.deployGaugeFactory(deployer);
    const bribesFactory = await Deploy.deployBribeFactory(deployer);

    const veDistImpl = await Deploy.deployContract(deployer, "VeDistUpgradeable") as VeDistUpgradeable;
    const veDistProxy = await Deploy.deployContract(deployer, "TransparentUpgradeableProxy",
      veDistImpl.address,
      deployer.address,
      veDistImpl.interface.encodeFunctionData("initialize", [veProxy.address, admin.address])
    ) as VeDistUpgradeable;
    const voterImpl = await Deploy.deployContract(deployer, "VoltVoterUpgradeable") as VoltVoterUpgradeable;
    const voterProxy = await Deploy.deployContract(deployer, "TransparentUpgradeableProxy",
      voterImpl.address,
      deployer.address,
      voterImpl.interface.encodeFunctionData("initialize", [veProxy.address, baseFactory, gaugesFactory.address, bribesFactory.address, admin.address])
    );

    const minterImpl = await Deploy.deployContract(deployer, "MinterUpgradeable") as MinterUpgradeable;
    const minterProxy = await Deploy.deployContract(deployer, "TransparentUpgradeableProxy",
      minterImpl.address,
      deployer.address,
      minterImpl.interface.encodeFunctionData("initialize", [veProxy.address, controllerProxy.address, admin.address])
    ) as MinterUpgradeable;

    return [
      controllerImpl,
      controllerProxy,
      gaugesFactory,
      bribesFactory,
      veImpl,
      veProxy,
      veDistImpl,
      veDistProxy,
      voterImpl,
      voterProxy,
      minterImpl,
      minterProxy,
    ];
  }
}
