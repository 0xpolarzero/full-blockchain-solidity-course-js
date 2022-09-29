// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private i_lowImageURI;
    string private i_highImageURI;

    constructor(string memory lowSvg, string memory highSvg)
        ERC721("DynamicSvgNft", "DSN")
    {
        s_tokenCounter = 0;
        i_lowImageURI = lowSvg;
        i_highImageURI = highSvg;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
    }

    function svgToImageURI() public pure returns (string memory{
        //
    }
}
