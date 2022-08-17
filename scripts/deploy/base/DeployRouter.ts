import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { MeterTestnetAddresses } from "../../addresses/MeterTestnetAddresses";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const factoryJson = Misc.getContract(await signer.getChainId(), "Factory");
  if (factoryJson.address != ethers.constants.AddressZero) {

    const router = await Deploy.deployVoltRouter01(signer, factoryJson.address, MeterTestnetAddresses.WMTR_TOKEN);

    await Misc.wait(5);
    // await Verify.verifyWithArgs(router.address, [factoryJson.address, MeterTestnetAddresses.WMTR_TOKEN]);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
