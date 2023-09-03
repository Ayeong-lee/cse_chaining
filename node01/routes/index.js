var express = require('express');
var router = express.Router();
require('dotenv').config();

const {Web3} = require('web3');
const Tx = require('ethereumjs-tx'); //npm install ethereumjs-tx@1.3.7
const fs = require('fs');
const abi = require('../abi/abi');
const { Network, Alchemy } = require('alchemy-sdk');
const ipfs = require('../module/ipfs');



const private_key = '';
/* 사용자가 개인키를 입력하도록 구현 => 프론트에 요청
이게 보안이 굉장히 취약한 부분이라 혹시 가능하다면... 보안 처리를 부탁드립니다 .env를 쓴다던가.......
*/

const infura_api_key = process.env.INFURA_API_KEY;
const node_host = 'https://sepolia.infura.io/v3/' + infura_api_key;

const web3 = new Web3(node_host);

const my_account = "" // db에 미리 저장해두었던 현재 사용자의 계좌
const receive_account = "" //  db에 미리 저장해두었던 피기부자의 계좌

const privateKeyBuffer = Buffer.from(private_key, "hex");

console.log(my_account);

/*맨 위부터 여기까지는 웬만하면 블록체인 코드를 쓰는 모든 파일에 삽입할 것
꼭 변수들 const로 관리하지 않아도 됨
비동기처리 안해놓은 함수들 비동기처리해도 상관x
*/



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
//nft 목록 끝



//nft 발행 코드 시작

const ABI = abi.getABI();

var contractAddress = "0x595A5cdDa3BBD110186dcF8426c37FD4d12681B4";
var MyContract = new web3.eth.Contract(ABI, contractAddress); //NFT 발행 컨트랙트 변수

const name = ''; //프론트에서 가져와야함
const description = ''; //프론트에서 가져와야함

/*
이미지는 총 3개
프론트에서 1 / 5 / 10 셋 중 하나를 넘겨주면 그에 맞게 이미지 상대경로를 넣어주면 됨
1: ./image/image1.png
5: ./image/image5.png
10: ./image/image10.png
*/
const imgHash = await ipfs.pinataUpload("");

const pinata_upload = async() => {

    var createJson = {
        name : name,
        description : description,
        image : 'https://gateway.pinata.cloud/ipfs/'+imgHash
    }
    var jsonData = JSON.stringify(createJson);
    var filePath = "./upload/"+name;

    fs.writeFileSync(filePath,jsonData,(err)=>{
        console.log(err);
    })
    let metaData = await ipfs.pinataUpload(filePath);

    var metaData2 = 'https://gateway.pinata.cloud/ipfs/'+ metaData;

    console.log('!!!----------------', metaData2);


    web3.eth.getTransactionCount(my_account).then((txCount)=>{
      const hex = web3.utils.toHex(txCount);

      const txObject = {
         'nonce': hex, 
        'to': contractAddress, 
        'from': my_account,
         'gasLimit': web3.utils.toHex(3000000), 
         'gasPrice': web3.utils.toHex(web3.utils.toWei('0.00001', 'gwei')),
        'chainId': 11155111,
        'data': MyContract.methods.mintNFT(my_account, metaData).encodeABI(),
      };
      const tx = new Tx(txObject);
      tx.sign(privateKeyBuffer);
    
      const serializedTx = tx.serialize();
    
      const raw = '0x' + serializedTx.toString('hex');
      web3.eth.sendSignedTransaction(raw).then((txHash) =>{
        console.log(txHash);
      }
      );
    
      });

  }

pinata_upload();


//nft 발행 코드 끝


//송금 코드 시작
const send_eth = ''; //프론트에서 받아오면 됩니다

web3.eth.getTransactionCount(my_account).then((txCount)=>{
  const hex = web3.utils.toHex(txCount);

  const txObject = {
    'nonce': hex, // Transaction의 발동 횟수
    'from': my_account, // 발신자
    'to': receive_account, // 수신자
    'value' : web3.utils.toHex(web3.utils.toWei(send_eth, 'ether')),
    'gasLimit': web3.utils.toHex(21000), // 가스 한도
    'gasPrice': web3.utils.toHex(web3.utils.toWei('0.00001', 'gwei')), // 가스 가격,
    'chainId': 11155111,
  };

  const tx = new Tx(txObject);
  tx.sign(privateKeyBuffer);

  const serializedTx = tx.serialize();

  const raw = '0x' + serializedTx.toString('hex');
  web3.eth.sendSignedTransaction(raw).then((txHash) =>{
    const url = 'https://sepolia.etherscan.io/tx/' + txHash //이더스캔 링크. db에 '거래 목록' 테이블 만들어서 저장해두기
    console.log(txHash);
    console.log(url);//링크 잘 나와있는지 확인 후 프론트한테 해당 링크 전달. 이상하면 조장한테 갠톡
    }
  );

  });

//송금 코드 끝


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });


  

});





module.exports = router;



