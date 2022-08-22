import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import {  Ve } from "../../../typechain";

async function main() {
  const [deployer, admin] = await ethers.getSigners();
  const veJson = Misc.getContract(await deployer.getChainId(), "Ve");
  if (veJson.address != ethers.constants.AddressZero) {
    console.info("find ve:", veJson.address);
    const ve = await ethers.getContractAt("Ve", veJson.address, admin) as Ve;
    let receipt = await ve.merge(2,1);
    console.info(`merge:`, receipt.hash);
  } else {
    console.log("No voter address")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
