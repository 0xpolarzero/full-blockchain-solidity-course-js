import { gql } from '@apollo/client';

const GET_ACTIVE_ITEMS_GOERLI = gql`
  query GetActiveItems @api(name: goerli) {
    activeItems(
      first: 1000
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;
const GET_ACTIVE_ITEMS_MUMBAI = gql`
  query GetActiveItems @api(name: mumbai) {
    activeItems(
      first: 1000
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;
const GET_ACTIVE_ITEMS_ARBITRUM_GOERLI = gql`
  query GetActiveItems @api(name: arbitrumGoerli) {
    activeItems(
      first: 1000
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export {
  GET_ACTIVE_ITEMS_GOERLI,
  GET_ACTIVE_ITEMS_MUMBAI,
  GET_ACTIVE_ITEMS_ARBITRUM_GOERLI,
};
