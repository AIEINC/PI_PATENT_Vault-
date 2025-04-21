// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PatentNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("PatentNFT", "PATNFT") {
        tokenCounter = 0;
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }
}

contract PatentToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("PatentToken", "PATTK") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract PatentVault is Ownable {
    PatentNFT public nft;
    PatentToken public token;

    constructor(address nftAddress, address tokenAddress) {
        nft = PatentNFT(nftAddress);
        token = PatentToken(tokenAddress);
    }

    function issuePatent(address recipient, string memory uri) public onlyOwner {
        nft.mintNFT(recipient, uri);
        token.mint(recipient, 100 * 10 ** token.decimals()); // reward for submission
    }
}
