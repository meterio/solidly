import { ethers } from "hardhat";
import { Misc } from "../../Misc";
import {  VoltFactory, VoltPair, VoltVoter } from "../../../typechain";

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
      console.info("allPairsLength:", allPairsLength);
      for (let i = 0; i < allPairsLength.toNumber(); i++) {
        let pair = await factory.allPairs(i);
        console.info(`pair_${i}:`, pair);
        let pairContract = await ethers.getContractAt("VoltPair", pair, admin) as VoltPair;
        let metadata = await pairContract.metadata();

        let token0 = metadata.t0;
        console.info(`token0:`, token0);
        let isWhitelisted0 = await voter.isWhitelisted(token0);
        console.info(`isWhitelisted:`, isWhitelisted0);

        let token1 = metadata.t1;
        console.info(`token1:`, token1);
        let isWhitelisted1 = await voter.isWhitelisted(token1);
        console.info(`isWhitelisted:`, isWhitelisted1);

        if (isWhitelisted0 && isWhitelisted1) {
          const gauge = await voter.gauges(pair);
          if (gauge == ethers.constants.AddressZero) {
            let receipt = await voter.createGauge(pair);
            console.info(`createGauge:`, receipt.hash);
          } else {
            console.info(`gauge:`, gauge);
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
