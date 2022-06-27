import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import {
  Token,
  Ve,
  BaseV1Router01,
  BaseV1Pair,
  BaseV1GaugeFactory,
  BaseV1Voter,
  Gauge,
  Bribe,
  BaseV1Factory
} from "../typechain";

describe("washtrade", function () {

  let token: ContractFactory;
  let ust: Token;
  let mim: Token;
  let dai: Token;
  let ve_underlying: Token;
  let ve: Ve;
  let factory: BaseV1Factory;
  let router: BaseV1Router01;
  let pair: BaseV1Pair;
  let pair2: BaseV1Pair;
  let pair3: BaseV1Pair;
  let gauges_factory: BaseV1GaugeFactory;
  let gauge3: Gauge;
  let bribe3: Bribe;
  let owner: SignerWithAddress;
  let owner2: SignerWithAddress;
  let owner3: SignerWithAddress;
  let voter: BaseV1Voter;

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
    ve_underlying = await token.deploy('VE', 'VE', 18, owner.address) as Token;
    await ve_underlying.mint(owner.address, ethers.BigNumber.from("10000000000000000000000000"));
    await ve_underlying.mint(owner2.address, ethers.BigNumber.from("10000000000000000000000000"));
    await ve_underlying.mint(owner3.address, ethers.BigNumber.from("10000000000000000000000000"));
    const vecontract = await ethers.getContractFactory("contracts/ve.sol:ve");
    ve = await vecontract.deploy(ve_underlying.address) as Ve;

    await ust.deployed();
    await mim.deployed();
  });

  it("create lock", async function () {
    await ve_underlying.approve(ve.address, ethers.BigNumber.from("1000000000000000000"));
    await ve.create_lock(ethers.BigNumber.from("1000000000000000000"), 4 * 365 * 86400);
    expect(await ve.balanceOfNFT(1)).to.above(ethers.BigNumber.from("995063075414519385"));
    expect(await ve_underlying.balanceOf(ve.address)).to.be.equal(ethers.BigNumber.from("1000000000000000000"));
  });

  it("ve merge", async function () {
    await ve_underlying.approve(ve.address, ethers.BigNumber.from("1000000000000000000"));
    await ve.create_lock(ethers.BigNumber.from("1000000000000000000"), 4 * 365 * 86400);
    expect(await ve.balanceOfNFT(2)).to.above(ethers.BigNumber.from("995063075414519385"));
    expect(await ve_underlying.balanceOf(ve.address)).to.be.equal(ethers.BigNumber.from("2000000000000000000"));
    await ve.merge(2, 1);
    expect(await ve.balanceOfNFT(1)).to.above(ethers.BigNumber.from("1990039602248405587"));
    expect(await ve.balanceOfNFT(2)).to.equal(ethers.BigNumber.from("0"));
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

  it("deploy BaseV1Voter", async function () {
    const BaseV1GaugeFactory = await ethers.getContractFactory("BaseV1GaugeFactory");
    gauges_factory = await BaseV1GaugeFactory.deploy() as BaseV1GaugeFactory;
    await gauges_factory.deployed();
    const BaseV1BribeFactory = await ethers.getContractFactory("BaseV1BribeFactory");
    const bribe_factory = await BaseV1BribeFactory.deploy();
    await bribe_factory.deployed();
    const BaseV1Voter = await ethers.getContractFactory("BaseV1Voter");
    voter = await BaseV1Voter.deploy(ve.address, factory.address, gauges_factory.address, bribe_factory.address);
    await voter.deployed();
    await voter.initialize([ust.address, mim.address, dai.address, ve_underlying.address], owner.address);

    expect(await voter.length()).to.equal(0);
  });

  it("deploy BaseV1Factory gauge", async function () {
    const pair_1000 = ethers.BigNumber.from("1000000000");

    await ve_underlying.approve(voter.address, ethers.BigNumber.from("500000000000000000000000"));
    await voter.createGauge(pair3.address);
    expect(await voter.gauges(pair.address)).to.not.equal(0x0000000000000000000000000000000000000000);

    const gauge_address3 = await voter.gauges(pair3.address);
    const bribe_address3 = await voter.bribes(gauge_address3);

    const Gauge = await ethers.getContractFactory("Gauge");
    gauge3 = await Gauge.attach(gauge_address3);

    const Bribe = await ethers.getContractFactory("Bribe");
    bribe3 = await Bribe.attach(bribe_address3);
    const total = await pair3.balanceOf(owner.address);
    await pair3.approve(gauge3.address, total);
    await gauge3.deposit(total, 0);
    expect(await gauge3.totalSupply()).to.equal(total);
    expect(await gauge3.earned(ve.address, owner.address)).to.equal(0);
  });

  it("BaseV1Router01 pair3 getAmountsOut & swapExactTokensForTokens", async function () {
    const mim_1000000 = ethers.BigNumber.from("1000000000000000000000000");
    const route = { from: mim.address, to: dai.address, stable: true }
    const route2 = { from: dai.address, to: mim.address, stable: true }

    for (let i = 0; i < 10; i++) {
      expect((await router.getAmountsOut(mim_1000000, [route]))[1]).to.be.equal(await pair3.getAmountOut(mim_1000000, mim.address));

      const before = await mim.balanceOf(owner.address);
      const expected_output_pair = await pair3.getAmountOut(mim_1000000, mim.address);
      const expected_output = await router.getAmountsOut(mim_1000000, [route]);
      await mim.approve(router.address, mim_1000000);
      await router.swapExactTokensForTokens(mim_1000000, expected_output[1], [route], owner.address, Date.now());


      expect((await router.getAmountsOut(mim_1000000, [route2]))[1]).to.be.equal(await pair3.getAmountOut(mim_1000000, dai.address));

      const before2 = await dai.balanceOf(owner.address);
      const expected_output_pair2 = await pair3.getAmountOut(mim_1000000, dai.address);
      const expected_output2 = await router.getAmountsOut(mim_1000000, [route2]);
      await dai.approve(router.address, mim_1000000);
      await router.swapExactTokensForTokens(mim_1000000, expected_output2[1], [route2], owner.address, Date.now());
    }
  });

  it("gauge reset", async function () {
    await ve.setVoter(voter.address);
    await voter.reset(1);
  });

  it("gauge poke self", async function () {
    await voter.poke(1);
  });

  it("gauge vote & bribe balanceOf", async function () {
    await voter.vote(1, [pair3.address, pair2.address], [5000, 5000]);
    expect(await voter.totalWeight()).to.not.equal(0);
    expect(await bribe3.balanceOf(1)).to.not.equal(0);
  });

  it("bribe claim rewards", async function () {
    await bribe3.getReward(1, [mim.address, dai.address]);
    await ethers.provider.send("evm_increaseTime", [691200])
    await ethers.provider.send("evm_mine", [])
    await bribe3.getReward(1, [mim.address, dai.address]);
  });

  it("distribute and claim fees", async function () {

    await ethers.provider.send("evm_increaseTime", [691200])
    await ethers.provider.send("evm_mine", [])
    await bribe3.getReward(1, [mim.address, dai.address]);

    await voter.distributeFees([gauge3.address])
  });

  it("bribe claim rewards", async function () {
    console.log(await bribe3.earned(mim.address, 1));
    console.log(await mim.balanceOf(owner.address));
    console.log(await mim.balanceOf(bribe3.address));
    await bribe3.batchRewardPerToken(mim.address, 200);
    await bribe3.batchRewardPerToken(dai.address, 200);
    await bribe3.getReward(1, [mim.address, dai.address]);
    await ethers.provider.send("evm_increaseTime", [691200])
    await ethers.provider.send("evm_mine", [])
    console.log(await bribe3.earned(mim.address, 1));
    console.log(await mim.balanceOf(owner.address));
    console.log(await mim.balanceOf(bribe3.address));
    await bribe3.getReward(1, [mim.address, dai.address]);
    console.log(await bribe3.earned(mim.address, 1));
    console.log(await mim.balanceOf(owner.address));
    console.log(await mim.balanceOf(bribe3.address));
  });

});
