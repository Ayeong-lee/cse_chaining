var express = require('express');
var router = express.Router();
require('dotenv').config();

const {Web3} = require('web3');
const Tx = require('ethereumjs-tx'); //npm install ethereumjs-tx@1.3.7
const fs = require('fs');
const abi = require('../abi/abi');
const { Network, Alchemy } = require('alchemy-sdk');
const ipfs = require('../module/ipfs');
const solc = require('solc');


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

const send_eth = ''; //프론트에서 받아오면 됩니다
web3.eth.getTransactionCount(my_account).then((txCount)=>{
  const hex = web3.utils.toHex(txCount);
  const txObject = {
    'nonce': hex, // Transaction의 발동 횟수
    'from': my_account, // 발신자
    'to': receive_account, // 수신자
    'value' : web3.utils.toHex(web3.utils.toWei(send_eth, 'ether')),
    'gasLimit': web3.utils.toHex(21000), // 가스 한도
    'gasPrice': web3.utils.toHex(web3.utils.toWei('0.00000000000001', 'ether')), // 가스 가격,
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