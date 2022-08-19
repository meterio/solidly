import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Verify } from "../../Verify";
import { Misc } from "../../Misc";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const routerJson = Misc.getContract(await signer.getChainId(), "Router");
  if (routerJson.address != ethers.constants.AddressZero) {

    const lib = await Deploy.deployLibrary(signer, routerJson.address)

    const data = ''
      + 'SolidlyLibrary: ' + lib.address + '\n'

    console.log(data);
    Misc.saveFile(await signer.getChainId(), "SolidlyLibrary", lib.address)

    await Misc.wait(5);

    await Verify.verify(lib.address);
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
