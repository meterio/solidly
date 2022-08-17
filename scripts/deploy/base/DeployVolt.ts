import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Verify } from "../../Verify";
import { Misc } from "../../Misc";

async function main() {
  const signer = (await ethers.getSigners())[0];

  const token = await Deploy.deployVolt(signer)

  const data = ''
    + 'Volt Token: ' + token.address + '\n'

  console.log(data);
  Misc.saveFile(await signer.getChainId(),"Volt",token.address)

  await Misc.wait(5);

  await Verify.verify(token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
