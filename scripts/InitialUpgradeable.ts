import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  for (const account of signers) {
    let address = await account.getAddress();
    console.log(
      address,
      (await ethers.provider.getBalance(address)).toString()
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
