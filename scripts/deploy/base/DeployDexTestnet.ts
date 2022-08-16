import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { MeterTestnetAddresses } from "../../addresses/MeterTestnetAddresses";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const [factory, router] = await Deploy.deployDex(signer, MeterTestnetAddresses.WMTR_TOKEN)

  const data = ''
    + 'factory: ' + factory.address + '\n'
    + 'router: ' + router.address + '\n'

  console.log(data);
  Misc.saveFile(await signer.getChainId(), "Factory", factory.address);
  Misc.saveFile(await signer.getChainId(), "Router", router.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
