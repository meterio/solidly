import { Deploy } from "../Deploy";
import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { MinterUpgradeable } from "../../../typechain";

async function main() {
  const [deployer, admin] = await ethers.getSigners();
  const minterJson = Misc.getContract(await deployer.getChainId(), "Minter");
  if (minterJson.address != ethers.constants.AddressZero) {
    let receipt;
    console.info("find minter:", minterJson.address);
    const minter = await ethers.getContractAt("MinterUpgradeable", minterJson.address, admin) as MinterUpgradeable;
    let activeperiod = await minter.activeperiod();
    console.info("activeperiod:",activeperiod);
    receipt = await minter.setActiveperiod(0);
    console.info(`setActiveperiod:`, receipt.hash);

    receipt = await minter.adminSetVeRatio(3000);
    console.info(`adminSetVeRatio:`, receipt.hash);

    receipt = await minter.updatePeriod();
    console.info(`updatePeriod:`, receipt.hash);
  } else {
    console.log("No minter address")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
