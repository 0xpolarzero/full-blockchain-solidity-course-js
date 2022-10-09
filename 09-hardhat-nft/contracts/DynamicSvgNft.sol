// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721, Ownable {
    uint256 private s_tokenCounter;
    string private i_lowImageURI;
    string private i_highImageURI;
    string private constant base64EncodedSvgPrefix =
        "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable i_priceFeed;

    mapping(uint256 => int256) private s_tokenIdToHighValue;

    event CreatedNFT(uint256 tokenId, int256 highValue);

    constructor(
        address priceFeedAddress,
        string memory lowSvg,
        string memory highSvg
    ) ERC721("DynamicSvgNft", "DSN") {
        s_tokenCounter = 0;
        i_lowImageURI = svgToImageURI(lowSvg);
        i_highImageURI = svgToImageURI(highSvg);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function mintNft(int256 highValue) public payable {
        s_tokenIdToHighValue[s_tokenCounter] = highValue;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
        emit CreatedNFT(s_tokenCounter, highValue);
    }

    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return
            string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "URI query for nonexistent token");

        int256 price = getUsdEthPriceFeed();
        string memory imageURI = (price >= s_tokenIdToHighValue[tokenId])
            ? i_highImageURI
            : i_lowImageURI;

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(), // You can add whatever name here
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "tiredness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getLowImageURI() public view returns (string memory) {
        return i_lowImageURI;
    }

    function getHighImageURI() public view returns (string memory) {
        return i_highImageURI;
    }

    function getPriceFeedAddress() public view returns (address) {
        return address(i_priceFeed);
    }

    function getUsdEthPriceFeed() public view returns (int256) {
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        return price;
    }

    function getTokenIdToHighValue(uint256 tokenId)
        public
        view
        returns (int256)
    {
        return s_tokenIdToHighValue[tokenId];
    }
}
