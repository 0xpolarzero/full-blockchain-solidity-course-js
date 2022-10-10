// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();
error NftMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);
error NftMarketplace__NoProceeds();
error NftMarketplace__TransferFailed();

contract NftMarketplace {
    struct Listing {
        uint256 price;
        address seller;
    }

    // Events
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ProceedsWithdrawn(address indexed seller, uint256 indexed proceeds);

    // Mappings
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    // Modifiers
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    constructor() {
        //
    }

    /*
     * @notice List an NFT on the marketplace
     * @param nftAddress - address of the NFT
     * @param tokenId - ID of the NFT
     * @param price - price of the NFT
     * @dev This implementation allows the owner of the NFT to approve the marketplace to sell the NFT
     * & transfer it to the new owner. This way they can still hold the NFT when it's listed.
     */

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }

        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        // Updating a mapping => emit an event
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        if (newPrice <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }

        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        // nonReentrant
        isListed(nftAddress, tokenId)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];

        if (msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }

        // Pull over push =>
        // We don't directly send the money to the seller to "shift the risk associated with
        // transfering ether to the user"
        // So we instead have the user withdraw their money from the contract
        s_proceeds[listedItem.seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);
        // We use 'safeTransferFrom' so the buyer confirms that they can indeed receive the NFT
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, msg.value);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];

        if (proceeds <= 0) {
            revert NftMarketplace__NoProceeds();
        }

        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");

        if (!success) {
            revert NftMarketplace__TransferFailed();
        }
        emit ProceedsWithdrawn(msg.sender, proceeds);
    }

    // Getter functions
    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address user)
        external
        view
        returns (uint256 proceeds)
    {
        return s_proceeds[user];
    }
}
