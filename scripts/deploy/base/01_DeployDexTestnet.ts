import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { Verify } from "../../Verify";
import { MeterTestnetAddresses } from "../../addresses/MeterTestnetAddresses";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const [factory, router] = await Deploy.deployDex(signer, MeterTestnetAddresses.WMTR_TOKEN);

  const lib = await Deploy.deployLibrary(signer, router.address)

  const data = ''
    + 'factory: ' + factory.address + '\n'
    + 'router: ' + router.address + '\n'
    + 'SolidlyLibrary: ' + lib.address + '\n'

  console.log(data);
  Misc.saveFile(await signer.getChainId(), "Factory", factory.address);
  Misc.saveFile(await signer.getChainId(), "Router", router.address);
  Misc.saveFile(await signer.getChainId(), "SolidlyLibrary", lib.address);

  await Verify.verify(factory.address);
  await Verify.verify(router.address);
  await Verify.verify(lib.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
