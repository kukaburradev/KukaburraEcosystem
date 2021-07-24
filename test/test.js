const { expect } = require("chai");
const { ethers } = require("hardhat");

const KUKA_STAKE_AMT = '50000000000000000000';
const MAX_KUKA_STAKE_MT = '100000000000000000000';
const BT_STAKE_AMT = '1000000000000000000000';
const MAX_BT_STAKE_AMT = '2000000000000000000000';

const BT_REWARD_AMT = '10000000000000000000';


describe("Forest - Staking 🐦KUKA for WKCS Token (no deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;



  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("WKCS")
    const bt = await BasicToken.deploy()
    await bt.deployed()

    await bt.deposit({value: BT_REWARD_AMT});


    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      bt.address,         //rewardsToken
      kuka.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      0,
      0,
      MAX_KUKA_STAKE_MT,
      false,
      true
    )
    await forest.deployed()

    await bt.transfer(forest.address, BT_REWARD_AMT);


    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000")   // 1000

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount(BT_REWARD_AMT)
    // approve and stake
    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check that feeAddress receives 0 tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });


  it("check postInteraction is sending tokens to the right address", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await kuka.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await kuka.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await kuka.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 🐦KUKA for WKCS Token (5% deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("WKCS")
    const bt = await BasicToken.deploy()
    await bt.deployed()

    await bt.deposit({value: BT_REWARD_AMT});


    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      bt.address,         //rewardsToken
      kuka.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      500000,
      1,
      MAX_KUKA_STAKE_MT,
      false,
      true
    )
    await forest.deployed()

    await bt.transfer(forest.address, BT_REWARD_AMT);


    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000")   // 1000

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount(BT_REWARD_AMT)
    // approve and stake
    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check postInteraction is sending tokens to the right address", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).gt(1)
  })


  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that feeAddress receives the fee tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await kuka.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await kuka.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await kuka.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 🐦KUKA for WKCS Token (10B deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("WKCS")
    const bt = await BasicToken.deploy()
    await bt.deployed()

    await bt.deposit({value: BT_REWARD_AMT});

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      bt.address,         //rewardsToken
      kuka.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      kuka.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      '10000000000000000000',
      0,
      2,
      MAX_KUKA_STAKE_MT,
      false,
      true
    )
    await forest.deployed()

    await bt.transfer(forest.address, BT_REWARD_AMT);


    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000")   // 1000

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount(BT_REWARD_AMT)
    // approve and stake
    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check postInteraction is sending tokens to the right address", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).gt(1)
  })

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that feeAddress receives the fee tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()
    // check that feeAddress receives the fee tokens
    expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await kuka.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await kuka.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await kuka.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 🐦KUKA for Basic Token (no deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;



  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("BasicToken")
    const bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      bt.address,         //rewardsToken
      kuka.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      0,
      0,
      MAX_KUKA_STAKE_MT,
      false,
      true
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    await bt.mint(forest.address, "1000000000000000000000")   // 1000

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("1000000000000000000000")

    // approve and stake
    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check that feeAddress receives 0 tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check postInteraction is sending tokens to the right address", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await kuka.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await kuka.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await kuka.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 🐦KUKA for Basic Token (5% deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("BasicToken")
    const bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      bt.address,         //rewardsToken
      kuka.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      500000,
      1,
      MAX_KUKA_STAKE_MT,
      false,
      true
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    await bt.mint(forest.address, "1000000000000000000000")   // 1000

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("1000000000000000000000")

    // approve and stake
    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check postInteraction is sending tokens to the right address", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).gt(1)
  })

  it("check that feeAddress receives the fee tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await kuka.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await kuka.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await kuka.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 🐦KUKA for Basic Token (10B deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("BasicToken")
    const bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      bt.address,         //rewardsToken
      kuka.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      kuka.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      '10000000000000000000',
      0,
      2,
      MAX_KUKA_STAKE_MT,
      false,
      true
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    await bt.mint(forest.address, "1000000000000000000000")   // 1000

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("1000000000000000000000")

    // approve and stake
    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check postInteraction is sending tokens to the right address", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).gt(1)
  })

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that feeAddress receives the fee tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()
    // check that feeAddress receives the fee tokens
    expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await kuka.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await kuka.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await kuka.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await kuka.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking Basic Token for KUKA (No Deposit Fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;
  var bt;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("BasicToken")
    bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      kuka.address,         //rewardsToken
      bt.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      0,
      0,
      MAX_BT_STAKE_AMT,
      true,
      false
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000000")   // 1000
    // transfer the rewards to the forest
    await kuka.connect(owner).transfer(forest.address,"100000000000000000000000")   // 100 trillion

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    bt.mint(addr1.address, "100000000000000000000000")
    bt.mint(addr2.address, "1000000000000000000000")
    bt.mint(addr3.address, "1000000000000000000000")


    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("100000000000000000000000")

    // approve and stake
    await bt.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(BT_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check that feeAddress receives 0 tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await bt.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check postInteraction does nothing", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await bt.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(BT_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received zero tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).equals(0)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await bt.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await bt.balanceOf(forest.address)).equals(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure that the token balance is equal to what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await bt.balanceOf(forest.address)).equals(totalStaked)
  });

  // it("make sure the forest isnt sweeping tokens badly", async function () {
  //   // store the balance before we transfer around a bunch of kuka
  //   const balance = await kuka.balanceOf(forest.address)

  //   await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

  //   await forest.connect(owner).sweep()

  //   // make sure the forest isnt sweeping tokens badly
  //   // ...use greater than check due to rounding/precision error of ~47 tokens 
  //   expect(await kuka.balanceOf(forest.address)).gt(balance)
  //   // expect(await kuka.balanceOf(forest.address)).equals(balance)
  // });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await bt.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(BT_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  // it("make sure the forest handles _maxTxValue()", async function () {
  //   // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()
  // });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(BT_STAKE_AMT);

    await forest.connect(owner).sweep()


    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(BT_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking Basic Token for KUKA (5% Deposit Fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;
  var bt;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("BasicToken")
    bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      kuka.address,         //rewardsToken
      bt.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      500000,
      1,
      MAX_BT_STAKE_AMT,
      true,
      false
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000000")   // 1000
    // transfer the rewards to the forest
    await kuka.connect(owner).transfer(forest.address,"100000000000000000000000")   // 100 trillion

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    bt.mint(addr1.address, "1000000000000000000000000")
    bt.mint(addr2.address, "1000000000000000000000000")
    bt.mint(addr3.address, "1000000000000000000000000")


    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("100000000000000000000000")

    // approve and stake
    await bt.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(BT_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check that feeAddress receives the fee tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await bt.connect(feeAddress).balanceOf(feeAddress.address)).gt(1)
  });

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check postInteraction does nothing", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await bt.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(BT_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received zero tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).equals(0)
  });


  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await bt.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await bt.balanceOf(forest.address)).equals(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure that the token balance is equal to what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await bt.balanceOf(forest.address)).equals(totalStaked)
  });

  // it("make sure the forest isnt sweeping tokens badly", async function () {
  //   // store the balance before we transfer around a bunch of kuka
  //   const balance = await kuka.balanceOf(forest.address)

  //   await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

  //   await forest.connect(owner).sweep()

  //   // make sure the forest isnt sweeping tokens badly
  //   // ...use greater than check due to rounding/precision error of ~47 tokens 
  //   expect(await kuka.balanceOf(forest.address)).gt(balance)
  //   // expect(await kuka.balanceOf(forest.address)).equals(balance)
  // });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await bt.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(BT_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  // it("make sure the forest handles _maxTxValue()", async function () {
  //   // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()
  // });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(BT_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(BT_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking Basic Token for KUKA (10 Basic Token Deposit Fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;
  var bt;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()

    const BasicToken = await ethers.getContractFactory("BasicToken")
    bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      kuka.address,         //rewardsToken
      bt.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      bt.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      '10000000000000000000',
      0,
      2,
      MAX_BT_STAKE_AMT,
      true,
      false
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000000")   // 1000
    // transfer the rewards to the forest
    await kuka.connect(owner).transfer(forest.address,"100000000000000000000000")   // 100 trillion

    // transfer 100 trillion tokens to every address from the owner account
    await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    bt.mint(addr1.address, "1000000000000000000000000")
    bt.mint(addr2.address, "1000000000000000000000000")
    bt.mint(addr3.address, "1000000000000000000000000")


    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("100000000000000000000000")

    // approve and stake
    await bt.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(BT_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check postInteraction does nothing", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await bt.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(BT_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received zero tokens
    expect(await kuka.connect(postDestination).balanceOf(postDestination.address)).equals(0)
  });

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });


  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await bt.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await bt.balanceOf(forest.address)).equals(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure that the token balance is equal to what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await bt.balanceOf(forest.address)).equals(totalStaked)
  });

  // it("make sure the forest isnt sweeping tokens badly", async function () {
  //   // store the balance before we transfer around a bunch of kuka
  //   const balance = await kuka.balanceOf(forest.address)

  //   await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
  //   await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

  //   await forest.connect(owner).sweep()

  //   // make sure the forest isnt sweeping tokens badly
  //   // ...use greater than check due to rounding/precision error of ~47 tokens 
  //   expect(await kuka.balanceOf(forest.address)).gt(balance)
  //   // expect(await kuka.balanceOf(forest.address)).equals(balance)
  // });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await kuka.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await bt.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(BT_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  // it("make sure the forest handles _maxTxValue()", async function () {
  //   // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")

  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()

  //   await kuka.connect(owner).transfer(forest.address,"10000000000000000000000")
  //   await forest.connect(owner).sweep()
  // });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(BT_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(BT_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 3RDPRTY for 🐦KUKA (no deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;
  var thirdparty;



  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()


    const ThirdParty = await ethers.getContractFactory("KukaburraMod")
    thirdparty = await ThirdParty.deploy( )
    await thirdparty.deployed()


    const BasicToken = await ethers.getContractFactory("BasicToken")
    const bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      kuka.address,         //rewardsToken
      thirdparty.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      0,
      0,
      MAX_KUKA_STAKE_MT,
      true,
      true
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000000")   // 1000

    // await thirdparty.connect(owner).transfer(forest.address,"1000000000000000000000")

    await kuka.connect(owner).transfer(forest.address,"1000000000000000000000")

    // transfer 100 trillion tokens to every address from the owner account
    await thirdparty.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await thirdparty.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // transfer 100 trillion tokens to every address from the owner account
    // await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    // await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("1000000000000000000000")

    // approve and stake
    await thirdparty.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check that feeAddress receives 0 tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await thirdparty.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check postInteraction is sending tokens to the right address", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await thirdparty.connect(addr3).approve(forest.address, "999999999999999999999999999999")

    await forest.connect(owner).sweep()
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await thirdparty.connect(postDestination).balanceOf(postDestination.address)).gt(1)
    // expect(await thirdparty.connect(postDestination).balanceOf(postDestination.address)).equals(0)

  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await thirdparty.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {
    // store the balance before we transfer around a bunch of kuka
    const balance = await thirdparty.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await thirdparty.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await thirdparty.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await thirdparty.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 3RDPRTY for 🐦KUKA (5% deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;
  var thirdparty;



  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()


    const ThirdParty = await ethers.getContractFactory("KukaburraMod")
    thirdparty = await ThirdParty.deploy( )
    await thirdparty.deployed()


    const BasicToken = await ethers.getContractFactory("BasicToken")
    const bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      kuka.address,         //rewardsToken
      thirdparty.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      500000,
      1,
      MAX_KUKA_STAKE_MT,
      true,
      true
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000000")   // 1000

    // await thirdparty.connect(owner).transfer(forest.address,"1000000000000000000000")

    await kuka.connect(owner).transfer(forest.address,"1000000000000000000000")

    // transfer 100 trillion tokens to every address from the owner account
    await thirdparty.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await thirdparty.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // transfer 100 trillion tokens to every address from the owner account
    // await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    // await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("1000000000000000000000")

    // approve and stake
    await thirdparty.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check postInteraction is sending tokens to the right address", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await thirdparty.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await thirdparty.connect(postDestination).balanceOf(postDestination.address)).gt(1)
    // expect(await thirdparty.connect(postDestination).balanceOf(postDestination.address)).equals(0)

  });

  it("check that feeAddress receives the fee tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await thirdparty.connect(feeAddress).balanceOf(feeAddress.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await thirdparty.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await thirdparty.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await thirdparty.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });


  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await thirdparty.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await thirdparty.connect(addr1).approve(forest.address, "999999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});

describe("Forest - Staking 3RDPRTY for 🐦KUKA (10B deposit fee)", function () {
  var forest;
  var owner;
  var addr1;
  var addr2;  var addr3;  var addr4;  var addr5;  var addr6;
  var addr7;  var addr8;  var addr9;  var addr10;  var addr11;
  var addr12;  var addr13;  var addr14;  var postDestination; var addr16;
  var feeAddress;
  var kuka;
  var thirdparty;



  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8,
      addr9, addr10, addr11, addr12, addr13, addr14, postDestination, addr16, feeAddress] = await ethers.getSigners();

    const Kuka = await ethers.getContractFactory("KukaburraMod")
    kuka = await Kuka.deploy( )
    await kuka.deployed()


    const ThirdParty = await ethers.getContractFactory("KukaburraMod")
    thirdparty = await ThirdParty.deploy( )
    await thirdparty.deployed()


    const BasicToken = await ethers.getContractFactory("BasicToken")
    const bt = await BasicToken.deploy( "DAI", "DAI", owner.address, "1000000000000000000" )
    await bt.deployed()

    const Forest = await ethers.getContractFactory("Forest")
    forest = await Forest.deploy(     // stake kuku, reward BT
      owner.address,
      owner.address,
      kuka.address,         //rewardsToken
      thirdparty.address,       //stakingToken
      postDestination.address,     // post-interaction destination
      addr16.address,     // flat fee token
      feeAddress.address,     // flat fee destination
      0,
      500000,
      1,
      MAX_KUKA_STAKE_MT,
      true,
      true
    )
    await forest.deployed()

    // mint some basic reward tokens to the forest address
    // await bt.mint(forest.address, "1000000000000000000000")   // 1000

    // await thirdparty.connect(owner).transfer(forest.address,"1000000000000000000000")

    await kuka.connect(owner).transfer(forest.address,"1000000000000000000000")

    // transfer 100 trillion tokens to every address from the owner account
    await thirdparty.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    await thirdparty.connect(owner).transfer(addr2.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr3.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr4.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr5.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr6.address,"100000000000000000000000")
    await thirdparty.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // transfer 100 trillion tokens to every address from the owner account
    // await kuka.connect(owner).transfer(addr1.address,"100000000000000000000000")   // 100 trillion
    // await kuka.connect(owner).transfer(addr2.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr3.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr4.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr5.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr6.address,"100000000000000000000000")
    // await kuka.connect(owner).transfer(addr7.address,"100000000000000000000000")

    // kick off the staking campaign, notify of reward amount minted 
    await forest.connect(owner).notifyRewardAmount("1000000000000000000000")

    // approve and stake
    await thirdparty.connect(addr1).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    // approve and stake
    // await kuka.connect(addr2).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr2).stake(KUKA_STAKE_AMT)
  })

  it("check postInteraction is sending tokens to the right address", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    await thirdparty.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()


    // make sure the post interaction destination received tokens
    expect(await thirdparty.connect(postDestination).balanceOf(postDestination.address)).gt(1)
    // expect(await thirdparty.connect(postDestination).balanceOf(postDestination.address)).equals(0)

  });

  it("check that claiming rewards works properly", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(addr1).getReward()

    // check that feeAddress receives the fee tokens
    // expect(await kuka.connect(feeAddress).balanceOf(feeAddress.address)).equals(0)
  });

  it("check that feeAddress receives the fee tokens", async function () {
    // await kuka.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    // await kuka.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    // await kuka.connect(addr3).approve(forest.address, "999999999999999999999999999999")
    // await forest.connect(addr3).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check that feeAddress receives the fee tokens
    expect(await thirdparty.connect(feeAddress).balanceOf(feeAddress.address)).gt(1)
  });

  it("make sure that the token balance is more than what is tracked as staked", async function () {
    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // make sure that the token balance is more than what is tracked as staked
    expect(await thirdparty.balanceOf(forest.address)).gt(totalStaked)
  });

  it("make sure the forest isnt sweeping tokens badly", async function () {

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    // store the balance before we transfer around a bunch of kuka
    const balance = await thirdparty.balanceOf(forest.address)

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()

    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()
    await forest.connect(owner).sweep()


    // make sure the forest isnt sweeping tokens badly
    // ...use greater than check due to rounding/precision error of ~47 tokens 
    expect(await thirdparty.balanceOf(forest.address)).gt(balance)
    // expect(await kuka.balanceOf(forest.address)).equals(balance)
  });

  it("make sure what is tracked as staked for each account is accurate and transfer fee is handled correctly", async function () {
    await thirdparty.connect(addr7).transfer(addr5.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr6.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr7.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr8.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr9.address,"1000000000000000000000")
    await thirdparty.connect(addr7).transfer(addr10.address,"1000000000000000000000")

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked)

    await forest.connect(owner).sweep()

    // withdraw all tokens
    await forest.connect(addr1).exit()

    await forest.connect(owner).sweep()

    const addrbalance = await thirdparty.balanceOf(addr1.address)

    await forest.connect(owner).sweep()


    await thirdparty.connect(addr1).approve(forest.address, "999999999999999999999999999999999")

    await forest.connect(owner).sweep()


    await forest.connect(addr1).stake(KUKA_STAKE_AMT)

    await forest.connect(owner).sweep()

    // check how much is staked
    const totalStaked2 = await forest.totalSupply()

    await forest.connect(owner).sweep()

    // make sure what is tracked as staked for each account is accurate
    expect(await forest.balanceOf(addr1.address)).equal(totalStaked2)
  });

  it("make sure the forest handles _maxTxValue()", async function () {
    // 10 trillion - more than the maxTxValue, the owner can transfer it but other accounts cannot.
    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")

    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()

    await thirdparty.connect(owner).transfer(forest.address,"10000000000000000000000")
    await forest.connect(owner).sweep()
  });

  it("Should fail if staker tries to deposit more than allowed", async function () {
    // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    await forest.connect(addr1).stake(KUKA_STAKE_AMT);

    await forest.connect(owner).sweep()

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(forest.connect(addr1).stake(KUKA_STAKE_AMT)).to.be.reverted;

    // Owner balance shouldn't have changed.
    // expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //   initialOwnerBalance
    // );
  });
});