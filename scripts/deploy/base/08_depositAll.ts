import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import { Gauge, VoltFactory, VoltPair, VoltVoter } from "../../../typechain";

async function main() {
  const [deployer, admin] = await ethers.getSigners();
  const factoryJson = Misc.getContract(await deployer.getChainId(), "Factory");
  const voterJson = Misc.getContract(await deployer.getChainId(), "Voter");
  if (voterJson.address != ethers.constants.AddressZero) {
    console.info("find voter:", voterJson.address);
    const voter = await ethers.getContractAt("VoltVoter", voterJson.address, admin) as VoltVoter;
    if (factoryJson.address != ethers.constants.AddressZero) {
      console.info("find factory:", factoryJson.address);
      const factory = await ethers.getContractAt("VoltFactory", factoryJson.address, admin) as VoltFactory;
      const allPairsLength = await factory.allPairsLength();
      console.info("allPairsLength:", allPairsLength.toString());
      for (let i = 0; i < allPairsLength.toNumber(); i++) {
        let pair = await factory.allPairs(i);
        console.info(`pair_${i}:`, pair);
        let pairContract = await ethers.getContractAt("VoltPair", pair, admin) as VoltPair;
        let balance = await pairContract.balanceOf(admin.address);
        console.info(`balance_${i}:`, balance.toString());
        if (balance.gt(0)) {
          let gauge = await voter.gauges(pair);
          if (gauge != ethers.constants.AddressZero) {
            console.info("find gauge:", gauge);
            let gaugeContract = await ethers.getContractAt("Gauge", gauge, admin) as Gauge;
            let receipt = await pairContract.approve(gauge, ethers.constants.MaxUint256);
            console.info(`approve:`, receipt.hash);
            receipt = await gaugeContract.depositAll(1);
            console.info(`depositAll:`, receipt.hash);
          }
        }
      }
    } else {
      console.log("No factory address")
    }
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
