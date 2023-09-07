var express = require('express');
var router = express.Router();
require('dotenv').config();

const {Web3} = require('web3');
const Tx = require('ethereumjs-tx'); //npm install ethereumjs-tx@1.3.7
const fs = require('fs');
const abi = require('../abi/abi');
const ipfs = require('../module/ipfs');


const private_key = '';
/* 사용자가 개인키를 입력하도록 구현 => 프론트에 요청
이게 보안이 굉장히 취약한 부분이라 혹시 가능하다면... 보안 처리를 부탁드립니다 .env를 쓴다던가.......
*/

const infura_api_key = process.env.INFURA_API_KEY;
const node_host = 'https://sepolia.infura.io/v3/' + infura_api_key;

const web3 = new Web3(node_host);

const my_account = "" // db에 미리 저장해두었던 현재 사용자의 계좌

const privateKeyBuffer = Buffer.from(private_key, "hex");










const ABI = abi.getABI();

var contractAddress = "0x262E9d94fe7C4eA82b21BBBEA49CbD4c126b6801";
var MyContract = new web3.eth.Contract(ABI, contractAddress); //NFT 발행 컨트랙트 변수

const NFTname = ''; //프론트에서 가져와야함
const description = ''; //프론트에서 가져와야함

/*
1: https://gateway.pinata.cloud/ipfs/QmSbyRsxbHQq4BS12p5GVfhuGgMkXniRaXbPYTneqF5p8h
5: https://gateway.pinata.cloud/ipfs/QmfH2j3bMYh6UVZkMkndxhcnphaEs5pwQxstKKGGWDEEHv
10: https://gateway.pinata.cloud/ipfs/QmWmkGuGJGapdfR1iNLKtLHdij3swMmHo2FjMRwbMAhCpH
*/

const img = '';



const pinata_upload = async() => {


    var createJson = {
        name : NFTname,
        description : description,
        image : img,
    }
    var jsonData = JSON.stringify(createJson);
    var filePath = "./upload/"+ NFTname;

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
         'gasLimit': web3.utils.toHex(1000000), 
         'gasPrice': web3.utils.toHex(web3.utils.toWei('0.00000000000001', 'ether')),
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