const { deployContract } = require('../services/contract_service');

async function deployAll(req, res) {
  try {
    const nft = await deployContract('PatentNFT');
    const token = await deployContract('PatentToken', 1000000);
    const vault = await deployContract('PatentVault', nft.target, token.target);

    res.json({
      nftAddress: nft.target,
      tokenAddress: token.target,
      vaultAddress: vault.target
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { deployAll };
