import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { MeterTestnetAddresses } from "../../addresses/MeterTestnetAddresses";
import {  Ve,  Volt } from "../../../typechain";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  const [deployer, admin] = await ethers.getSigners();
  const veJson = Misc.getContract(await deployer.getChainId(), "Ve");
  const tokenJson = Misc.getContract(await deployer.getChainId(), "Token");
  if (veJson.address != ethers.constants.AddressZero && tokenJson.address != ethers.constants.AddressZero) {
    console.info("find ve:", veJson.address);
    console.info("find token:", tokenJson.address);
    const ve = await ethers.getContractAt("Ve", veJson.address, admin) as Ve;
    const token = await ethers.getContractAt("Volt", tokenJson.address, admin) as Volt;
    let receipt = await token.approve(ve.address, ethers.constants.MaxUint256);
    console.info(`approve:`, receipt.hash);
    const lockDuration = 86400 * 365 * 4;
    receipt = await ve.createLock(parseUnits("100000"), lockDuration);
    console.info(`createLock:`, receipt.hash);
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
