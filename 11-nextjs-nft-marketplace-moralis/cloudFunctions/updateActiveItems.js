Moralis.Cloud.afterSave('ItemListed', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  // Shows a log in the Database > Logs
  logger.info('Looking for confirmed tx...', request.object);

  if (confirmed) {
    console.log('Confirmed tx found!');
    const ActiveItem = Moralis.Object.extend('ActiveItem');

    // Check if the listing already exists & delete it if it does
    const activeItemQuery = new Moralis.Query(ActiveItem);
    activeItemQuery.equalTo(
      'marketplaceAddress',
      request.object.get('address'),
    );
    activeItemQuery.equalTo('nftAddress', request.object.get('nftAddress'));
    activeItemQuery.equalTo('tokenId', request.object.get('tokenId'));
    activeItemQuery.equalTo('seller', request.object.get('seller'));
    const alreadyListedItem = await activeItemQuery.first();

    if (alreadyListedItem) {
      logger.info('Item already listed, deleting...', alreadyListedItem);
      await alreadyListedItem.destroy();
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          'tokenId',
        )} at address ${request.object.get('nftAddress')}`,
      );
    }

    // Add the new active item
    const activeItem = new ActiveItem();
    activeItem.set('marketplaceAddress', request.object.get('address'));
    activeItem.set('nftAddress', request.object.get('nftAddress'));
    activeItem.set('price', request.object.get('price'));
    activeItem.set('tokenId', request.object.get('tokenId'));
    activeItem.set('seller', request.object.get('seller'));
    logger.info(
      `Adding Address: ${request.object.get(
        'address',
      )} TokenId: ${request.object.get('tokenId')}`,
    );
    logger.info('Saving item...');
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave('ItemCanceled', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info('Looking for confirmed tx...', request.object);

  if (confirmed) {
    console.log('Confirmed tx found!');
    const ActiveItem = Moralis.Object.extend('ActiveItem');

    const activeItemQuery = new Moralis.Query(ActiveItem);
    activeItemQuery.equalTo(
      'marketplaceAddress',
      request.object.get('address'),
    );
    activeItemQuery.equalTo('nftAddress', request.object.get('nftAddress'));
    activeItemQuery.equalTo('tokenId', request.object.get('tokenId'));
    logger.info(`Marketplace Query: ${activeItemQuery}`);

    const canceledItem = await activeItemQuery.first();
    logger.info(`Canceled Item: ${canceledItem}`);

    if (canceledItem) {
      logger.info('Deleting item...');
      await canceledItem.destroy();
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          'tokenId',
        )} at address ${request.object.get('address')}.`,
      );
    } else {
      logger.info(
        `No item found with tokenId ${request.object.get(
          'tokenId',
        )} at address ${request.object.get('address')}.`,
      );
    }
  }
});

Moralis.Cloud.afterSave('ItemBought', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info('Looking for confirmed tx...', request.object);

  if (confirmed) {
    console.log('Confirmed tx found!');
    const ActiveItem = Moralis.Object.extend('ActiveItem');

    const activeItemQuery = new Moralis.Query(ActiveItem);
    activeItemQuery.equalTo(
      'marketplaceAddress',
      request.object.get('address'),
    );
    activeItemQuery.equalTo('nftAddress', request.object.get('nftAddress'));
    activeItemQuery.equalTo('tokenId', request.object.get('tokenId'));
    logger.info(`Marketplace Query: ${activeItemQuery}`);

    const boughtItem = await activeItemQuery.first();
    logger.info(`Bought Item: ${boughtItem}`);

    if (boughtItem) {
      logger.info('Deleting item...');
      await boughtItem.destroy();
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          'tokenId',
        )} at address ${request.object.get('address')}.`,
      );
    } else {
      logger.info(
        `No item found with tokenId ${request.object.get(
          'tokenId',
        )} at address ${request.object.get('address')}.`,
      );
    }
  }
});
