import { ethers } from "hardhat";
import { Misc } from "./Misc";
import { MeterTestnetAddresses } from "./addresses/MeterTestnetAddresses";
import { UniswapV2ERC20, VoltRouter01 } from "../typechain";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers);
  const signer = signers[2];

  const routerJson = Misc.getContract(await signer.getChainId(), "Router");
  if (routerJson.address != ethers.constants.AddressZero) {
    const tokenA = await ethers.getContractAt("UniswapV2ERC20",MeterTestnetAddresses.ETH_TOKEN,signer) as UniswapV2ERC20;
    const tokenB = await ethers.getContractAt("UniswapV2ERC20",MeterTestnetAddresses.USDC_TOKEN,signer) as UniswapV2ERC20;
    let receipt;
    receipt = await tokenA.approve(routerJson.address,ethers.constants.MaxUint256);
    console.log(await receipt.wait());
    receipt = await tokenB.approve(routerJson.address,ethers.constants.MaxUint256);
    console.log(await receipt.wait());

    const router = await ethers.getContractAt("VoltRouter01", routerJson.address, signer) as VoltRouter01;
    receipt = await router.addLiquidity(
      MeterTestnetAddresses.ETH_TOKEN,
      MeterTestnetAddresses.USDC_TOKEN,
      false,
      parseUnits('100'),
      parseUnits('190000'),
      parseUnits('100'),
      parseUnits('190000'),
      signer.address,
      '99999999999'
    );
    console.log(await receipt.wait());

  } else {
    console.log("No factory address")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
