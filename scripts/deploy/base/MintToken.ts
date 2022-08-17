import { ethers } from "hardhat";
import { Volt } from "../../../typechain";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  const signer = (await ethers.getSigners())[0];
  const address = "0x51f280284f9273B0B115124AB94Bd3e2AE3a6BD2";
  const to = "0x0070dF68e2C13df22F55324edd56f2075eB6b8bB";
  const amount = parseUnits('190000');

  const token = await ethers.getContractAt("Volt",address,signer) as Volt;
  const receipt = await token.mint(to,amount);
  console.log(await receipt.wait());

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
