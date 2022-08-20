import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { MeterTestnetAddresses } from "../../addresses/MeterTestnetAddresses";
import { Controller, Minter, VeDist, VoltVoter, VoltVoterUpgradeable } from "../../../typechain";
import { Verify } from "../../Verify";

async function main() {
  const [deployer, admin] = await ethers.getSigners();

  const factoryJson = Misc.getContract(await deployer.getChainId(), "Factory");
  const tokenJson = Misc.getContract(await deployer.getChainId(), "Token");
  if (factoryJson.address != ethers.constants.AddressZero && tokenJson.address != ethers.constants.AddressZero) {
    const [
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
    ] = await Deploy.deployUpgradeableSystem(
      deployer,
      admin,
      tokenJson.address,
      factoryJson.address,
    )

    const data = ''
      + 'controller Impl: ' + controllerImpl.address + '\n'
      + 'controller Proxy: ' + controllerProxy.address + '\n'
      + 'gaugesFactory: ' + gaugesFactory.address + '\n'
      + 'bribesFactory: ' + bribesFactory.address + '\n'
      + 've Impl: ' + veImpl.address + '\n'
      + 've Proxy: ' + veProxy.address + '\n'
      + 'veDist Impl: ' + veDistImpl.address + '\n'
      + 'veDist Proxy: ' + veDistProxy.address + '\n'
      + 'voter Impl: ' + voterImpl.address + '\n'
      + 'voter Proxy: ' + voterProxy.address + '\n'
      + 'minter Impl: ' + minterImpl.address + '\n'
      + 'minter Proxy: ' + minterProxy.address + '\n'

    const vedist = await ethers.getContractAt("VeDist", veDistProxy.address, admin) as VeDist;
    let receipt;
    receipt = await vedist.setDepositor(minterProxy.address);
    console.log(await receipt.wait());
    const controller = await ethers.getContractAt("Controller", controllerProxy.address, admin) as Controller;
    receipt = await controller.setVeDist(veDistProxy.address);
    console.log(await receipt.wait());
    receipt = await controller.setVoter(voterProxy.address);
    console.log(await receipt.wait());
    const minter = await ethers.getContractAt("Minter", minterProxy.address, admin) as Minter;
    receipt = await minter.grantRole(ethers.constants.HashZero, voterProxy.address);
    console.log(await receipt.wait());

    const voterTokens = [
      MeterTestnetAddresses.ETH_TOKEN,
      MeterTestnetAddresses.MTRG_TOKEN,
      MeterTestnetAddresses.SUBTC_TOKEN,
      MeterTestnetAddresses.SUETH_TOKEN,
      MeterTestnetAddresses.SUMER_TOKEN,
      MeterTestnetAddresses.SUUSD_TOKEN,
      MeterTestnetAddresses.USDC_TOKEN,
      MeterTestnetAddresses.USDT_TOKEN,
      MeterTestnetAddresses.WBTC_TOKEN,
      MeterTestnetAddresses.WMTR_TOKEN,
      tokenJson.address
    ]
    const voter = await ethers.getContractAt("VoltVoterUpgradeable", voterProxy.address, admin) as VoltVoterUpgradeable;
    receipt = await voter.init(voterTokens, minterProxy.address);
    console.log(await receipt.wait());

    console.log(data);
    Misc.saveFile(await deployer.getChainId(), "ControllerImpl", controllerImpl.address);
    Misc.saveFile(await deployer.getChainId(), "Controller", controllerProxy.address);
    Misc.saveFile(await deployer.getChainId(), "GaugesFactory", gaugesFactory.address);
    Misc.saveFile(await deployer.getChainId(), "BribesFactory", bribesFactory.address);
    Misc.saveFile(await deployer.getChainId(), "VeImpl", veImpl.address);
    Misc.saveFile(await deployer.getChainId(), "Ve", veProxy.address);
    Misc.saveFile(await deployer.getChainId(), "VeDistImpl", veDistImpl.address);
    Misc.saveFile(await deployer.getChainId(), "VeDist", veDistProxy.address);
    Misc.saveFile(await deployer.getChainId(), "VoterImpl", voterImpl.address);
    Misc.saveFile(await deployer.getChainId(), "Minter", minterProxy.address);

    await Misc.wait(5);

    await Verify.verifyAll();
  } else {
    console.log("No factory address")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
