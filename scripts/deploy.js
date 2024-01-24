// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.


async function deployContract() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const ExampleNFT = await ethers.getContractFactory("BoilerPass")
 // console.log(ExampleNFT);
  const exampleNFT = await ExampleNFT.deploy()
  //console.log(exampleNFT)
  await exampleNFT.deployed()
  console.log("Deployed")
  const txHash = exampleNFT.deployTransaction.hash
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  const contractAddress = txReceipt.contractAddress
  console.log("Contract deployed to address:", contractAddress)
  console.log("Account balance:", (await deployer.getBalance()).toString());
 }
 
 deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



// const hre = require("hardhat");

// async function main() {
//   // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   // const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.utils.parseEther("0.001");

//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with ${ethers.utils.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
