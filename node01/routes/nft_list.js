var express = require('express');
var router = express.Router();
require('dotenv').config();

const { Network, Alchemy } = require('alchemy-sdk');

const my_account = "" // db에 미리 저장해두었던 현재 사용자의 계좌

console.log(my_account);


//nft 목록 시작
/*

함수실행 시 반환된 리스트 - 형식 따로 카톡으로 사진 보내둔거 있으니 그거 참고

"ownedNfts": 소유한 nft 목록 contract~contractMetadata까지 해서 nft 한개의 정보를 보여줌
필요한 정보:
ownedNfts -> metadata -> name(제목), description(설명), image(토큰 이미지)
하나씩 묶어서 프론트에 넘겨주면 됨

맨 아래에 있는 totalCount는 Nft의 개수 이것도 따로 같이 넘겨줘야함

*/

const api_key = 'XU4Kq-Fmqb9I6hpKhBvIu6TbAhPP5Wc8';

const getNFTs = async () => {
  const settings = {
    apiKey: api_key,
    network: Network.ETH_SEPOLIA,
  };

  console.log(settings.apiKey);

  const alchemy = new Alchemy(settings);

  alchemy.nft.getNftsForOwner(my_account).then(console.log);
};

 getNFTs();


//TODO 컬렉션이 chaining인것만 골라서 보여줄것


//nft 목록 끝