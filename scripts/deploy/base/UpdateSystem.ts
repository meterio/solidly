import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { MeterTestnetAddresses } from "../../addresses/MeterTestnetAddresses";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const factoryJson = Misc.getContract(await signer.getChainId(), "Factory");
  const controllerJson = Misc.getContract(await signer.getChainId(), "Controller");
  const veJson = Misc.getContract(await signer.getChainId(), "Ve");
  const tokenJson = Misc.getContract(await signer.getChainId(), "Volt");
  if (factoryJson.address != ethers.constants.AddressZero) {
    const [
      veDist,
      gaugesFactory,
      bribesFactory,
      voter,
      minter,
    ] = await Deploy.updateVoltSystem(
      signer,
      controllerJson.address,
      tokenJson.address,
      factoryJson.address,
      veJson.address,
      [
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
      ]
    )

    const data = ''
      + 'veDist: ' + veDist.address + '\n'
      + 'gaugesFactory: ' + gaugesFactory.address + '\n'
      + 'bribesFactory: ' + bribesFactory.address + '\n'
      + 'voter: ' + voter.address + '\n'
      + 'minter: ' + minter.address + '\n'

    console.log(data);
    Misc.saveFile(await signer.getChainId(), "VeDist", veDist.address);
    Misc.saveFile(await signer.getChainId(), "GaugesFactory", gaugesFactory.address);
    Misc.saveFile(await signer.getChainId(), "BribesFactory", bribesFactory.address);
    Misc.saveFile(await signer.getChainId(), "Voter", voter.address);
    Misc.saveFile(await signer.getChainId(), "Minter", minter.address);

    await Misc.wait(5);

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
