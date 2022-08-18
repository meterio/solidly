import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { MeterTestnetAddresses } from "../../addresses/MeterTestnetAddresses";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const factoryJson = Misc.getContract(await signer.getChainId(), "Factory");
  if (factoryJson.address != ethers.constants.AddressZero) {
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
      ],
      factoryJson.address,
      [
        signer.address,
        '0x3DFd98C0176f2b686E3a62957dA038Aca24911Da',
        '0x57e7e16a2326dc41d02402103a73b4464a8b3eeb'
      ],
      '100000000'
    )

    const data = ''
      + 'controller: ' + controller.address + '\n'
      + 'token: ' + token.address + '\n'
      + 'gaugesFactory: ' + gaugesFactory.address + '\n'
      + 'bribesFactory: ' + bribesFactory.address + '\n'
      + 've: ' + ve.address + '\n'
      + 'veDist: ' + veDist.address + '\n'
      + 'voter: ' + voter.address + '\n'
      + 'minter: ' + minter.address + '\n'

    console.log(data);
    Misc.saveFile(await signer.getChainId(), "Controller", controller.address);
    Misc.saveFile(await signer.getChainId(), "Token", token.address);
    Misc.saveFile(await signer.getChainId(), "GaugesFactory", gaugesFactory.address);
    Misc.saveFile(await signer.getChainId(), "BribesFactory", bribesFactory.address);
    Misc.saveFile(await signer.getChainId(), "Ve", ve.address);
    Misc.saveFile(await signer.getChainId(), "VeDist", veDist.address);
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
