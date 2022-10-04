const { assert, expect } = require('chai');
const { developmentChains } = require('../../helper-hardhat-config');
const { deployments, network, ethers } = require('hardhat');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('NftMarketplace unit tests', function() {
      let deployer;
      let user;
      let nftMarketplace;
      let basicNft;
      const TOKEN_ID = 0;
      const PRICE = ethers.utils.parseEther('1');

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture('main');
        nftMarketplaceContract = await ethers.getContract('NftMarketplace');
        basicNftContract = await ethers.getContract('BasicNft');
        nftMarketplace = nftMarketplaceContract.connect(deployer);
        basicNft = basicNftContract.connect(deployer);

        await basicNft.mintNft();
        await basicNft.approve(nftMarketplace.address, TOKEN_ID);
      });

      describe('listItem', function() {
        it('Should not allow to list if the user is not the owner', async () => {
          nftMarketplace = nftMarketplaceContract.connect(user);

          await expect(
            nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE),
          ).to.be.revertedWith('NftMarketPlace__NotOwner()');
        });

        it('Should not allow to list for a price of 0', async () => {
          await expect(
            nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, 0),
          ).to.be.revertedWith('NftMarketPlace__PriceMustBeAboveZero()');
        });

        it('Should not allow to list if the item is already listed', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );

          await expect(
            nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE),
          ).to.be.revertedWith(
            `NftMarketPlace__AlreadyListed("${basicNftContract.address}", ${TOKEN_ID})`,
          );
        });

        it('Should not allow to list if the item is not approved', async () => {
          await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID);

          await expect(
            nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE),
          ).to.be.revertedWith('NftMarketPlace__NotApprovedForMarketplace()');
        });

        it('Should emit an event when the item is listed', async () => {
          await expect(
            nftMarketplace.listItem(basicNftContract.address, TOKEN_ID, PRICE),
          )
            .to.emit(nftMarketplace, 'ItemListed')
            .withArgs(
              deployer.address,
              basicNftContract.address,
              TOKEN_ID,
              PRICE,
            );
        });

        it('Should add the listing to the listings array with the right parameters', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          const listing = await nftMarketplace.getListing(
            basicNftContract.address,
            TOKEN_ID,
          );

          assert(listing.seller === deployer.address);
          assert(listing.price.toString() === PRICE.toString());
        });
      });

      describe('cancelListing', function() {
        it('Should not allow to cancel if the user is not the owner', async () => {
          nftMarketplace = nftMarketplaceContract.connect(user);

          await expect(
            nftMarketplace.cancelListing(basicNftContract.address, TOKEN_ID),
          ).to.be.revertedWith('NftMarketPlace__NotOwner()');
        });

        it('Should not allow to cancel if the item is not listed', async () => {
          await expect(
            nftMarketplace.cancelListing(basicNftContract.address, TOKEN_ID),
          ).to.be.revertedWith(
            `NftMarketPlace__NotListed("${basicNftContract.address}", ${TOKEN_ID})`,
          );
        });

        it('Should emit an event when the item is cancelled', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );

          await expect(
            nftMarketplace.cancelListing(basicNftContract.address, TOKEN_ID),
          )
            .to.emit(nftMarketplace, 'ItemCanceled')
            .withArgs(deployer.address, basicNftContract.address, TOKEN_ID);
        });

        it('Should remove the listing from the listings array', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          await nftMarketplace.cancelListing(
            basicNftContract.address,
            TOKEN_ID,
          );
          const listing = await nftMarketplace.getListing(
            basicNftContract.address,
            TOKEN_ID,
          );

          assert(listing.seller === ethers.constants.AddressZero);
          assert(listing.price.toString() === '0');
        });
      });

      describe('updateListing', async () => {
        it('Should not allow to update if the user is not the owner', async () => {
          nftMarketplace = nftMarketplaceContract.connect(user);

          await expect(
            nftMarketplace.updateListing(
              basicNftContract.address,
              TOKEN_ID,
              PRICE,
            ),
          ).to.be.revertedWith('NftMarketPlace__NotOwner()');
        });

        it('Should not allow to update if the item is not listed', async () => {
          await expect(
            nftMarketplace.updateListing(
              basicNftContract.address,
              TOKEN_ID,
              PRICE,
            ),
          ).to.be.revertedWith(
            `NftMarketPlace__NotListed("${basicNftContract.address}", ${TOKEN_ID})`,
          );
        });

        it('Should not allow to update if the new price is 0', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );

          await expect(
            nftMarketplace.updateListing(basicNftContract.address, TOKEN_ID, 0),
          ).to.be.revertedWith('NftMarketPlace__PriceMustBeAboveZero()');
        });

        it('Should emit an event when the item is updated', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );

          await expect(
            nftMarketplace.updateListing(
              basicNftContract.address,
              TOKEN_ID,
              PRICE.add(1),
            ),
          )
            .to.emit(nftMarketplace, 'ItemListed')
            .withArgs(
              deployer.address,
              basicNftContract.address,
              TOKEN_ID,
              PRICE.add(1),
            );
        });

        it('Should update the listing in the listings array', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          await nftMarketplace.updateListing(
            basicNftContract.address,
            TOKEN_ID,
            PRICE.add(1),
          );
          const listing = await nftMarketplace.getListing(
            basicNftContract.address,
            TOKEN_ID,
          );

          assert(listing.seller === deployer.address);
          assert(listing.price.toString() === PRICE.add(1).toString());
        });
      });

      describe('buyItem', function() {
        it('Should not allow to buy if the item is not listed', async () => {
          await expect(
            nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID),
          ).to.be.revertedWith(
            `NftMarketPlace__NotListed("${basicNftContract.address}", ${TOKEN_ID})`,
          );
        });

        it('Should not allow to buy if the price is not correct', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );

          await expect(
            nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
              value: PRICE.sub(1),
            }),
          ).to.be.revertedWith(
            `NftMarketPlace__PriceNotMet("${basicNftContract.address}", ${TOKEN_ID}, ${PRICE})`,
          );
        });

        it('Should emit an event when the item is bought', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          nftMarketplace = nftMarketplaceContract.connect(user);

          await expect(
            nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
              value: PRICE,
            }),
          )
            .to.emit(nftMarketplace, 'ItemBought')
            .withArgs(user.address, basicNftContract.address, TOKEN_ID, PRICE);
        });

        it('Should transfer the NFT to the buyer', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          nftMarketplace = nftMarketplaceContract.connect(user);
          await nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
            value: PRICE,
          });

          const owner = await basicNft.ownerOf(TOKEN_ID);
          assert(owner === user.address);
        });

        it('Should update the proceeds of the seller', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          nftMarketplace = nftMarketplaceContract.connect(user);
          await nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
            value: PRICE,
          });

          const proceeds = await nftMarketplace.getProceeds(deployer.address);
          assert(proceeds.toString() === PRICE.toString());
        });
      });

      describe('withdrawProceeds', function() {
        it('Should not allow to withdraw if the user has no proceeds', async () => {
          await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
            'NftMarketplace__NoProceeds()',
          );
        });

        it('Should emit an event when the proceeds are withdrawn', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          nftMarketplace = nftMarketplaceContract.connect(user);
          await nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
            value: PRICE,
          });
          nftMarketplace = nftMarketplaceContract.connect(deployer);

          await expect(nftMarketplace.withdrawProceeds())
            .to.emit(nftMarketplace, 'ProceedsWithdrawn')
            .withArgs(deployer.address, PRICE);
        });

        it('Should transfer the proceeds to the seller', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          nftMarketplace = nftMarketplaceContract.connect(user);
          await nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
            value: PRICE,
          });
          nftMarketplace = nftMarketplaceContract.connect(deployer);

          const initialBalance = await deployer.getBalance();
          const initialProceeds = await nftMarketplace.getProceeds(
            deployer.address,
          );
          const tx = await nftMarketplace.withdrawProceeds();
          const txReceipt = await tx.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const finalBalance = await deployer.getBalance();

          assert(
            finalBalance.add(gasCost).toString() ===
              initialBalance.add(initialProceeds).toString(),
          );
        });

        it('Should reset the proceeds of the seller', async () => {
          await nftMarketplace.listItem(
            basicNftContract.address,
            TOKEN_ID,
            PRICE,
          );
          nftMarketplace = nftMarketplaceContract.connect(user);
          await nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, {
            value: PRICE,
          });
          nftMarketplace = nftMarketplaceContract.connect(deployer);
          await nftMarketplace.withdrawProceeds();
          const proceeds = await nftMarketplace.getProceeds(deployer.address);

          assert(proceeds.toString() === '0');
        });
      });
    });
