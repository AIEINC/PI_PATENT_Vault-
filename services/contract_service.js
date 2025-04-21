const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

// Environment Variables
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const RPC_URL = process.env.ETH_RPC_URL || 'https://rpc.ankr.com/eth_sepolia';
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Load compiled contract artifacts (assumed to be built via Hardhat/Truffle)
function getContractArtifact(contractName) {
  const artifactPath = path.join(__dirname, `../artifacts/${contractName}.json`);
  return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
}

// Deploy a contract
async function deployContract(contractName, ...args) {
  const artifact = getContractArtifact(contractName);
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();
  console.log(`${contractName} deployed to:`, contract.target);
  return contract;
}

// Issue a patent (NFT + FT reward)
async function issuePatent(vaultAddress, recipient, tokenURI) {
  const artifact = getContractArtifact('PatentVault');
  const vault = new ethers.Contract(vaultAddress, artifact.abi, wallet);
  const tx = await vault.issuePatent(recipient, tokenURI);
  await tx.wait();
  console.log("Patent issued to", recipient);
}

module.exports = {
  deployContract,
  issuePatent
};
