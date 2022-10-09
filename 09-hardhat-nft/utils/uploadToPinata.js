const pinataSDK = require('@pinata/sdk');
const path = require('path');
const fs = require('fs');

const pinataApiKey = process.env.PINATA_API_KEY || '';
const pinataApiSecret = process.env.PINATA_API_SECRET || '';
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  let responses = [];

  console.log('Uploading to IPFS through pinata...');
  for (fileIndex in files) {
    console.log(`Uploading ${files[fileIndex]}...`);
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`,
    );

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (err) {
      console.log(err);
    }
  }

  return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);

    return response;
  } catch (err) {
    console.log(err);
  }

  return null;
}

module.exports = { storeImages, storeTokenUriMetadata };
