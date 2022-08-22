import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { Ve, VoltVoter } from "../../../typechain";

async function main() {
  const [deployer, admin] = await ethers.getSigners();
  const veJson = Misc.getContract(await deployer.getChainId(), "Ve");
  const voterJson = Misc.getContract(await deployer.getChainId(), "Voter");
  if (veJson.address != ethers.constants.AddressZero && voterJson.address != ethers.constants.AddressZero) {
    console.info("find ve:", veJson.address);
    console.info("find voter:", voterJson.address);
    const ve = await ethers.getContractAt("Ve", veJson.address, admin) as Ve;
    const voter = await ethers.getContractAt("VoltVoter", voterJson.address, admin) as VoltVoter;
    let weight = await ve.balanceOfNFT(1);
    console.info("weight:", weight.toString());
    let pool = await voter.pools(0);
    console.info("pool:", pool);

    let receipt = await voter.vote(1, [pool], [weight]);
    console.info(`vote:`, receipt.hash);
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
