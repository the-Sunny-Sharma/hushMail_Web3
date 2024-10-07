import hre from "hardhat";

async function main() {
  const Hushmail = await hre.ethers.getContractFactory("HushMail");
  const contract = await Hushmail.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`Address of contract: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
