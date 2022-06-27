import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import {
  Token,
  Ve,
  BaseV1Factory,
  BaseV1Router01,
  BaseV1Pair,
  BaseV1
} from "../typechain";


describe("oracles", function () {

  let token: ContractFactory;
  let ust: Token;
  let mim: Token;
  let dai: Token;
  let ve_underlying: BaseV1;
  let ve: Ve;
  let factory: BaseV1Factory;
  let router: BaseV1Router01;
  let pair: BaseV1Pair;
  let pair2: BaseV1Pair;
  let pair3: BaseV1Pair;
  let owner: SignerWithAddress;
  let owner2: SignerWithAddress;
  let owner3: SignerWithAddress;

  it("deploy base coins", async function () {
    [owner, owner2, owner3] = await ethers.getSigners();
    token = await ethers.getContractFactory("Token");
    ust = await token.deploy('ust', 'ust', 6, owner.address) as Token;
    await ust.mint(owner.address, ethers.BigNumber.from("1000000000000000000"));
    await ust.mint(owner2.address, ethers.BigNumber.from("1000000000000000000"));
    await ust.mint(owner3.address, ethers.BigNumber.from("1000000000000000000"));
    mim = await token.deploy('MIM', 'MIM', 18, owner.address) as Token;
    await mim.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await mim.mint(owner2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await mim.mint(owner3.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    dai = await token.deploy('DAI', 'DAI', 18, owner.address) as Token;
    await dai.mint(owner.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await dai.mint(owner2.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    await dai.mint(owner3.address, ethers.BigNumber.from("1000000000000000000000000000000"));
    ve_underlying = await token.deploy('VE', 'VE', 18, owner.address) as BaseV1;
    await ve_underlying.mint(owner.address, ethers.BigNumber.from("10000000000000000000000000"));
    await ve_underlying.mint(owner2.address, ethers.BigNumber.from("10000000000000000000000000"));
    await ve_underlying.mint(owner3.address, ethers.BigNumber.from("10000000000000000000000000"));
    const vecontract = await ethers.getContractFactory("contracts/ve.sol:ve");
    ve = await vecontract.deploy(ve_underlying.address) as Ve;

    await ust.deployed();
    await mim.deployed();
  });

  it("deploy BaseV1Factory and test pair length", async function () {
    const BaseV1Factory = await ethers.getContractFactory("BaseV1Factory");
    factory = await BaseV1Factory.deploy();
    await factory.deployed();

    expect(await factory.allPairsLength()).to.equal(0);
  });

  it("deploy BaseV1Router and test factory address", async function () {
    const BaseV1Router = await ethers.getContractFactory("BaseV1Router01");
    router = await BaseV1Router.deploy(factory.address, owner.address);
    await router.deployed();

    expect(await router.factory()).to.equal(factory.address);
  });

  it("deploy pair via BaseV1Factory owner", async function () {
    const ust_1 = ethers.BigNumber.from("1000000");
    const mim_1 = ethers.BigNumber.from("1000000000000000000");
    const dai_1 = ethers.BigNumber.from("1000000000000000000");
    await mim.approve(router.address, mim_1);
    await ust.approve(router.address, ust_1);
    await router.addLiquidity(mim.address, ust.address, true, mim_1, ust_1, 0, 0, owner.address, Date.now());
    await mim.approve(router.address, mim_1);
    await ust.approve(router.address, ust_1);
    await router.addLiquidity(mim.address, ust.address, false, mim_1, ust_1, 0, 0, owner.address, Date.now());
    await mim.approve(router.address, mim_1);
    await dai.approve(router.address, dai_1);
    await router.addLiquidity(mim.address, dai.address, true, mim_1, dai_1, 0, 0, owner.address, Date.now());
    expect(await factory.allPairsLength()).to.equal(3);
  });

  it("confirm pair for mim-ust", async function () {
    const create2address = await router.pairFor(mim.address, ust.address, true);
    const BaseV1Pair = await ethers.getContractFactory("BaseV1Pair");
    const address = await factory.getPair(mim.address, ust.address, true);
    const allpairs0 = await factory.allPairs(0);
    pair = await BaseV1Pair.attach(address);
    const address2 = await factory.getPair(mim.address, ust.address, false);
    pair2 = await BaseV1Pair.attach(address2);
    const address3 = await factory.getPair(mim.address, dai.address, true);
    pair3 = await BaseV1Pair.attach(address3);

    expect(pair.address).to.equal(create2address);
  });

  it("confirm tokens for mim-ust", async function () {
    const [token0, token1] = await router.sortTokens(ust.address, mim.address);
    expect((await pair.token0()).toUpperCase()).to.equal(token0.toUpperCase());
    expect((await pair.token1()).toUpperCase()).to.equal(token1.toUpperCase());
  });

  it("mint & burn tokens for pair mim-ust", async function () {
    const ust_1 = ethers.BigNumber.from("1000000");
    const mim_1 = ethers.BigNumber.from("1000000000000000000");
    const before_balance = await ust.balanceOf(owner.address);
    await ust.transfer(pair.address, ust_1);
    await mim.transfer(pair.address, mim_1);
    await pair.mint(owner.address);
    expect(await pair.getAmountOut(ust_1, ust.address)).to.equal(ethers.BigNumber.from("945128557522723966"));
  });

  it("BaseV1Router01 addLiquidity", async function () {
    const ust_1000 = ethers.BigNumber.from("100000000000");
    const mim_1000 = ethers.BigNumber.from("100000000000000000000000");
    const mim_100000000 = ethers.BigNumber.from("100000000000000000000000000");
    const dai_100000000 = ethers.BigNumber.from("100000000000000000000000000");
    const expected_2000 = ethers.BigNumber.from("2000000000000");
    await ust.approve(router.address, ust_1000);
    await mim.approve(router.address, mim_1000);
    await router.addLiquidity(mim.address, ust.address, true, mim_1000, ust_1000, mim_1000, ust_1000, owner.address, Date.now());
    await ust.approve(router.address, ust_1000);
    await mim.approve(router.address, mim_1000);
    await router.addLiquidity(mim.address, ust.address, false, mim_1000, ust_1000, mim_1000, ust_1000, owner.address, Date.now());
    await dai.approve(router.address, dai_100000000);
    await mim.approve(router.address, mim_100000000);
    await router.addLiquidity(mim.address, dai.address, true, mim_100000000, dai_100000000, 0, 0, owner.address, Date.now());
  });

  it("BaseV1Router01 pair1 getAmountsOut & swapExactTokensForTokens", async function () {
    const ust_1 = ethers.BigNumber.from("1000000");
    const route = { from: ust.address, to: mim.address, stable: true }

    expect((await router.getAmountsOut(ust_1, [route]))[1]).to.be.equal(await pair.getAmountOut(ust_1, ust.address));

    const before = await mim.balanceOf(owner.address);
    const expected_output_pair = await pair.getAmountOut(ust_1, ust.address);
    const expected_output = await router.getAmountsOut(ust_1, [route]);
    await ust.approve(router.address, ust_1);
    await router.swapExactTokensForTokens(ust_1, expected_output[1], [route], owner.address, Date.now());
    await ethers.provider.send("evm_increaseTime", [1801])
    await ethers.provider.send("evm_mine", [])
    await ust.approve(router.address, ust_1);
    await router.swapExactTokensForTokens(ust_1, 0, [route], owner.address, Date.now());
    await ethers.provider.send("evm_increaseTime", [1801])
    await ethers.provider.send("evm_mine", [])
    await ust.approve(router.address, ust_1);
    await router.swapExactTokensForTokens(ust_1, 0, [route], owner.address, Date.now());
    await ethers.provider.send("evm_increaseTime", [1801])
    await ethers.provider.send("evm_mine", [])
    await ust.approve(router.address, ust_1);
    await router.swapExactTokensForTokens(ust_1, 0, [route], owner.address, Date.now());
    const fees = await pair.fees()
    expect(await ust.balanceOf(fees)).to.be.equal(400);
    const b = await ust.balanceOf(owner.address);
    await pair.claimFees();
    expect(await ust.balanceOf(owner.address)).to.be.above(b);
  });

  it("oracle", async function () {
    const ust_1000 = ethers.BigNumber.from("1000000000");
    const mim_1000 = ethers.BigNumber.from("1000000000000000000000");

    expect(await pair.current(ust.address, ust_1000)).to.equal(ethers.BigNumber.from("999999491983679298588"));
    expect(await pair.current(mim.address, mim_1000)).to.equal(ethers.BigNumber.from("999999507"));
    expect(await pair.quote(mim.address, mim_1000, 1)).to.equal(ethers.BigNumber.from("999999506"));
  });

});
