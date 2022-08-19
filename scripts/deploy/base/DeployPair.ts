import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Verify } from "../../Verify";
import { Misc } from "../../Misc";

async function main() {
  const signer = (await ethers.getSigners())[0];


    const lib = await Deploy.deployPair(signer)

    const data = ''
      + 'SolidlyLibrary: ' + lib.address + '\n'

    console.log(data);
    Misc.saveFile(await signer.getChainId(), "SolidlyLibrary", lib.address)

    await Misc.wait(5);

    await Verify.verify(lib.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
