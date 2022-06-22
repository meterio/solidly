
const {ethers} = require("hardhat")

 


async function main() {

  const [deployer] = await ethers.getSigners();

	console.log(
	"Deploying contracts with the account:",
	deployer.address
	);
  const Token = await ethers.getContractFactory("BaseV1");
  const Gauges = await ethers.getContractFactory("BaseV1GaugeFactory");
  const Bribes = await ethers.getContractFactory("BaseV1BribeFactory");
  const Core = await ethers.getContractFactory("BaseV1Factory");
  const Factory = await ethers.getContractFactory("BaseV1Router01");
  const Ve = await ethers.getContractFactory("contracts/ve.sol:ve");
  const Ve_dist = await ethers.getContractFactory("contracts/ve_dist.sol:ve_dist");
  const BaseV1Voter = await ethers.getContractFactory("BaseV1Voter");
  const BaseV1Minter = await ethers.getContractFactory("BaseV1Minter");

  const token = await Token.deploy();
  const gauges = await Gauges.deploy();
  const bribes = await Bribes.deploy();
  const core = await Core.deploy();
  const factory = await Factory.deploy(core.address, "0x8A419Ef4941355476cf04933E90Bf3bbF2F73814");
  const ve = await Ve.deploy(token.address);
  const ve_dist = await Ve_dist.deploy(ve.address);
  const voter = await BaseV1Voter.deploy(ve.address, core.address, gauges.address, bribes.address);
  const minter = await BaseV1Minter.deploy(voter.address, ve.address, ve_dist.address);
  console.log("minter.address ", minter.address)
  console.log("voter.address ", voter.address)
  console.log("token.address ", token.address)
  console.log("gauges.address ", gauges.address)
  console.log("factory.address ", core.address)
  console.log("ve.address ", ve.address)
  console.log("ve_dist.address ", ve_dist.address)
  console.log("router.address", factory.address)
  


  await token.setMinter(minter.address);
  await ve.setVoter(voter.address);
  await ve_dist.setDepositor(minter.address);
  await voter.initialize(["0x8A419Ef4941355476cf04933E90Bf3bbF2F73814",
  "0x4cb6cEf87d8cADf966B455E8BD58ffF32aBA49D1",
  "0x3e5a2a4812d319ded22479a88ed708c6b55ca0b1", 
  "0x1B80E7dA342981314f4032434fE0def21B90Ec20", 
  "0xb0D0410D3D158a9b38c36e5aAB80264BC5272a20",
"0x4e5c590D2fa8Aa3bC85342690eCfc33cF1c27eBB"
], minter.address);
  await minter.initialize([ve.address], [
  ethers.BigNumber.from("800000000000000000000000"),
  ethers.BigNumber.from("2376588000000000000000000"),
  ethers.BigNumber.from("1331994000000000000000000"),
  ethers.BigNumber.from("1118072000000000000000000"),
  ethers.BigNumber.from("1070472000000000000000000"),
  ethers.BigNumber.from("1023840000000000000000000"),
  ethers.BigNumber.from("864361000000000000000000"),
  ethers.BigNumber.from("812928000000000000000000"),
  ethers.BigNumber.from("795726000000000000000000"),
  ethers.BigNumber.from("763362000000000000000000"),
  ethers.BigNumber.from("727329000000000000000000"),
  ethers.BigNumber.from("688233000000000000000000"),
  ethers.BigNumber.from("681101000000000000000000"),
  ethers.BigNumber.from("677507000000000000000000"),
  ethers.BigNumber.from("676304000000000000000000"),
  ethers.BigNumber.from("642992000000000000000000"),
  ethers.BigNumber.from("609195000000000000000000"),
  ethers.BigNumber.from("598412000000000000000000"),
  ethers.BigNumber.from("591573000000000000000000"),
  ethers.BigNumber.from("587431000000000000000000"),
  ethers.BigNumber.from("542785000000000000000000"),
  ethers.BigNumber.from("536754000000000000000000"),
  ethers.BigNumber.from("518240000000000000000000"),
  ethers.BigNumber.from("511920000000000000000000"),
  ethers.BigNumber.from("452870000000000000000000")], ethers.BigNumber.from("100000000000000000000000000"));

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
