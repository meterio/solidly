import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Verify } from "../../Verify";
import { Misc } from "../../Misc";
import { writeFileSync, mkdirSync } from "fs";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const token = await Deploy.deployVolt(signer)

  const data = ''
    + 'Volt Token: ' + token.address + '\n'

  console.log(data);
  Misc.saveFile(await signer.getChainId(),"Volt",token.address)

  await Misc.wait(5);

  await Verify.verify(token.address);
  // await Verify.verifyWithArgs(core[0].address, [core[2].address]);
  // await Verify.verifyWithArgs(core[1].address, [core[0].address, MaticAddresses.WMATIC_TOKEN]);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
