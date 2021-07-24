require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    
    forkedmainnet: {
      url: "http://127.0.0.1:8545",
      blockGasLimit: 22450000
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.4.18",
      },
      {
        version: "0.5.16",
        settings: {},
      },
      {
        version: "0.7.0",
      },
    ],
  }, 
};
