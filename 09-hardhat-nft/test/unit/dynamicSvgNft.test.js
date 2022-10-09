const { assert, expect } = require('chai');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');
const { getNamedAccounts, deployments, network, ethers } = require('hardhat');

const TOKEN_NAME = 'DynamicSvgNft';
const TOKEN_SYMBOL = 'DSN';

const lowImageuri =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHdpZHRoPSIxMDI0cHgiIGhlaWdodD0iMTAyNHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik01MTIgNjRDMjY0LjYgNjQgNjQgMjY0LjYgNjQgNTEyczIwMC42IDQ0OCA0NDggNDQ4IDQ0OC0yMDAuNiA0NDgtNDQ4Uzc1OS40IDY0IDUxMiA2NHptMCA4MjBjLTIwNS40IDAtMzcyLTE2Ni42LTM3Mi0zNzJzMTY2LjYtMzcyIDM3Mi0zNzIgMzcyIDE2Ni42IDM3MiAzNzItMTY2LjYgMzcyLTM3MiAzNzJ6Ii8+CiAgPHBhdGggZmlsbD0iI0U2RTZFNiIgZD0iTTUxMiAxNDBjLTIwNS40IDAtMzcyIDE2Ni42LTM3MiAzNzJzMTY2LjYgMzcyIDM3MiAzNzIgMzcyLTE2Ni42IDM3Mi0zNzItMTY2LjYtMzcyLTM3Mi0zNzJ6TTI4OCA0MjFhNDguMDEgNDguMDEgMCAwIDEgOTYgMCA0OC4wMSA0OC4wMSAwIDAgMS05NiAwem0zNzYgMjcyaC00OC4xYy00LjIgMC03LjgtMy4yLTguMS03LjRDNjA0IDYzNi4xIDU2Mi41IDU5NyA1MTIgNTk3cy05Mi4xIDM5LjEtOTUuOCA4OC42Yy0uMyA0LjItMy45IDcuNC04LjEgNy40SDM2MGE4IDggMCAwIDEtOC04LjRjNC40LTg0LjMgNzQuNS0xNTEuNiAxNjAtMTUxLjZzMTU1LjYgNjcuMyAxNjAgMTUxLjZhOCA4IDAgMCAxLTggOC40em0yNC0yMjRhNDguMDEgNDguMDEgMCAwIDEgMC05NiA0OC4wMSA0OC4wMSAwIDAgMSAwIDk2eiIvPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0yODggNDIxYTQ4IDQ4IDAgMSAwIDk2IDAgNDggNDggMCAxIDAtOTYgMHptMjI0IDExMmMtODUuNSAwLTE1NS42IDY3LjMtMTYwIDE1MS42YTggOCAwIDAgMCA4IDguNGg0OC4xYzQuMiAwIDcuOC0zLjIgOC4xLTcuNCAzLjctNDkuNSA0NS4zLTg4LjYgOTUuOC04OC42czkyIDM5LjEgOTUuOCA4OC42Yy4zIDQuMiAzLjkgNy40IDguMSA3LjRINjY0YTggOCAwIDAgMCA4LTguNEM2NjcuNiA2MDAuMyA1OTcuNSA1MzMgNTEyIDUzM3ptMTI4LTExMmE0OCA0OCAwIDEgMCA5NiAwIDQ4IDQ4IDAgMSAwLTk2IDB6Ii8+Cjwvc3ZnPg==';
const highimageUri =
  'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgd2lkdGg9IjQwMCIgIGhlaWdodD0iNDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgZmlsbD0ieWVsbG93IiByPSI3OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGcgY2xhc3M9ImV5ZXMiPgogICAgPGNpcmNsZSBjeD0iNjEiIGN5PSI4MiIgcj0iMTIiLz4KICAgIDxjaXJjbGUgY3g9IjEyNyIgY3k9IjgyIiByPSIxMiIvPgogIDwvZz4KICA8cGF0aCBkPSJtMTM2LjgxIDExNi41M2MuNjkgMjYuMTctNjQuMTEgNDItODEuNTItLjczIiBzdHlsZT0iZmlsbDpub25lOyBzdHJva2U6IGJsYWNrOyBzdHJva2Utd2lkdGg6IDM7Ii8+Cjwvc3ZnPg==';
const lowTokenUri =
  'data:application/json;base64,eyJuYW1lIjoiRHluYW1pY1N2Z05mdCIsICJkZXNjcmlwdGlvbiI6IkFuIE5GVCB0aGF0IGNoYW5nZXMgYmFzZWQgb24gdGhlIENoYWlubGluayBGZWVkIiwgImF0dHJpYnV0ZXMiOiBbeyJ0cmFpdF90eXBlIjogInRpcmVkbmVzcyIsICJ2YWx1ZSI6IDEwMH1dLCAiaW1hZ2UiOiJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIyYVdWM1FtOTRQU0l3SURBZ01qQXdJREl3TUNJZ2QybGtkR2c5SWpRd01DSWdJR2hsYVdkb2REMGlOREF3SWlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpUGdvZ0lEeGphWEpqYkdVZ1kzZzlJakV3TUNJZ1kzazlJakV3TUNJZ1ptbHNiRDBpZVdWc2JHOTNJaUJ5UFNJM09DSWdjM1J5YjJ0bFBTSmliR0ZqYXlJZ2MzUnliMnRsTFhkcFpIUm9QU0l6SWk4K0NpQWdQR2NnWTJ4aGMzTTlJbVY1WlhNaVBnb2dJQ0FnUEdOcGNtTnNaU0JqZUQwaU5qRWlJR041UFNJNE1pSWdjajBpTVRJaUx6NEtJQ0FnSUR4amFYSmpiR1VnWTNnOUlqRXlOeUlnWTNrOUlqZ3lJaUJ5UFNJeE1pSXZQZ29nSUR3dlp6NEtJQ0E4Y0dGMGFDQmtQU0p0TVRNMkxqZ3hJREV4Tmk0MU0yTXVOamtnTWpZdU1UY3ROalF1TVRFZ05ESXRPREV1TlRJdExqY3pJaUJ6ZEhsc1pUMGlabWxzYkRwdWIyNWxPeUJ6ZEhKdmEyVTZJR0pzWVdOck95QnpkSEp2YTJVdGQybGtkR2c2SURNN0lpOCtDand2YzNablBnPT0ifQ==';
const highTokenUri =
  'data:application/json;base64,eyJuYW1lIjoiRHluYW1pY1N2Z05mdCIsICJkZXNjcmlwdGlvbiI6IkFuIE5GVCB0aGF0IGNoYW5nZXMgYmFzZWQgb24gdGhlIENoYWlubGluayBGZWVkIiwgImF0dHJpYnV0ZXMiOiBbeyJ0cmFpdF90eXBlIjogInRpcmVkbmVzcyIsICJ2YWx1ZSI6IDEwMH1dLCAiaW1hZ2UiOiJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIyYVdWM1FtOTRQU0l3SURBZ01qQXdJREl3TUNJZ2QybGtkR2c5SWpRd01DSWdJR2hsYVdkb2REMGlOREF3SWlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpUGdvZ0lEeGphWEpqYkdVZ1kzZzlJakV3TUNJZ1kzazlJakV3TUNJZ1ptbHNiRDBpZVdWc2JHOTNJaUJ5UFNJM09DSWdjM1J5YjJ0bFBTSmliR0ZqYXlJZ2MzUnliMnRsTFhkcFpIUm9QU0l6SWk4K0NpQWdQR2NnWTJ4aGMzTTlJbVY1WlhNaVBnb2dJQ0FnUEdOcGNtTnNaU0JqZUQwaU5qRWlJR041UFNJNE1pSWdjajBpTVRJaUx6NEtJQ0FnSUR4amFYSmpiR1VnWTNnOUlqRXlOeUlnWTNrOUlqZ3lJaUJ5UFNJeE1pSXZQZ29nSUR3dlp6NEtJQ0E4Y0dGMGFDQmtQU0p0TVRNMkxqZ3hJREV4Tmk0MU0yTXVOamtnTWpZdU1UY3ROalF1TVRFZ05ESXRPREV1TlRJdExqY3pJaUJ6ZEhsc1pUMGlabWxzYkRwdWIyNWxPeUJ6ZEhKdmEyVTZJR0pzWVdOck95QnpkSEp2YTJVdGQybGtkR2c2SURNN0lpOCtDand2YzNablBnPT0ifQ==';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('DynamicSvgNft unit tests', function() {
      let deployer;
      let user;
      let dynamicSvgNft;
      let mockV3Aggregator;

      const chainId = network.config.chainId;

      beforeEach(async function() {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture('dynamic-svg-nft', 'mocks');
        dynamicSvgNft = await ethers.getContract('DynamicSvgNft', deployer);
        mockV3Aggregator = await ethers.getContract(
          'MockV3Aggregator',
          deployer,
        );
      });

      describe('constructor', function() {
        it('Should initialize the contract with a tokenCounter at 0', async () => {
          const tokenCounter = await dynamicSvgNft.getTokenCounter();

          assert(tokenCounter.toString() === '0');
        });

        it('Should initialize the contract with the right name and symbol', async () => {
          const name = await dynamicSvgNft.name();
          const symbol = await dynamicSvgNft.symbol();
          const priceFeed = await dynamicSvgNft.getPriceFeedAddress();

          assert(name === TOKEN_NAME);
          assert(symbol === TOKEN_SYMBOL);
          assert(priceFeed === mockV3Aggregator.address);
        });

        it('Should set up the low and high images URIs correctly', async () => {
          const lowImageURIFromContract = await dynamicSvgNft.getLowImageURI();
          const highImageURIFromContract = await dynamicSvgNft.getHighImageURI();

          assert(lowImageURIFromContract === lowImageuri);
          assert(highImageURIFromContract === highimageUri);
        });
      });

      describe('mintNft', function() {
        const highValue = '1000';

        it('Mints a NFT to the msg sender', async () => {
          await dynamicSvgNft.mintNft(highValue);
          const userBalance = await dynamicSvgNft.balanceOf(deployer.address);

          assert(userBalance.toString() === '1');
        });

        it('Increments the counter by 1 when a NFT is minted', async () => {
          await dynamicSvgNft.mintNft(highValue);
          const tokenCounter = await dynamicSvgNft.getTokenCounter();

          assert(tokenCounter.toString() === '1');
        });

        it('Emits an event when a NFT is minted', async () => {
          expect(await dynamicSvgNft.mintNft(highValue)).to.emit(
            dynamicSvgNft,
            'CreatedNFT',
          );
        });

        it('Stores the high value with the tokenId', async () => {
          await dynamicSvgNft.mintNft(highValue);
          const highValueFromContract = await dynamicSvgNft.getTokenIdToHighValue(
            '0',
          );

          assert(highValueFromContract.toString() === highValue);
        });

        it('Returns the right svg according to the ETH/USD price feed', async () => {
          const priceFeed = await dynamicSvgNft.getUsdEthPriceFeed();
          await dynamicSvgNft.mintNft((Number(priceFeed) + 100).toString());
          await dynamicSvgNft.mintNft((Number(priceFeed) - 100).toString());

          assert((await dynamicSvgNft.tokenURI('1')) === lowTokenUri);
          assert((await dynamicSvgNft.tokenURI('2')) === highTokenUri);
        });

        it("Reverts if the token ID doesn't exist", async () => {
          await expect(dynamicSvgNft.tokenURI('1')).to.be.revertedWith(
            'URI query for nonexistent token',
          );
        });
      });
    });
