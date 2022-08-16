import {Deploy} from "../Deploy";
import {ethers} from "hardhat";
import {Verify} from "../../Verify";
import {Misc} from "../../Misc";
import {MeterTestnetAddresses} from "../../addresses/MeterTestnetAddresses";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const FACTORY = '0x1d21Db6cde1b18c7E47B0F7F42f4b3F68b9beeC9';

  const router = await Deploy.deployVoltRouter01(signer, FACTORY, MeterTestnetAddresses.WMTR_TOKEN);

  await Misc.wait(5);
  await Verify.verifyWithArgs(router.address, [FACTORY, MeterTestnetAddresses.WMTR_TOKEN]);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
