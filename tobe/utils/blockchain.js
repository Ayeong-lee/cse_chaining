const {Web3} = require('web3');
const Tx = require('ethereumjs-tx'); //npm install ethereumjs-tx@1.3.7
const fs = require('fs');
const abi = require('../abi/abi');
const { Network, Alchemy } = require('alchemy-sdk');
const ipfs = require('../module/ipfs');

const private_key = process.env.PRIVATE_KEY;
/* 사용자가 개인키를 입력하도록 구현 => 프론트에 요청
이게 보안이 굉장히 취약한 부분이라 혹시 가능하다면... 보안 처리를 부탁드립니다 .env를 쓴다던가.......
*/

const infura_api_key = process.env.INFURA_API_KEY;
const node_host = 'https://sepolia.infura.io/v3/' + infura_api_key;

const web3 = new Web3(node_host);


const receive_account = process.env.RECEIVE_ACCOUNT; //  db에 미리 저장해두었던 피기부자의 계좌

const privateKeyBuffer = Buffer.from(private_key, "hex");

/*맨 위부터 여기까지는 웬만하면 블록체인 코드를 쓰는 모든 파일에 삽입할 것
꼭 변수들 const로 관리하지 않아도 됨
비동기처리 안해놓은 함수들 비동기처리해도 상관x
*/


//nft 발행 코드 시작


const ABI = abi.getABI();

var contractAddress = "0x262E9d94fe7C4eA82b21BBBEA49CbD4c126b6801";
var MyContract = new web3.eth.Contract(ABI, contractAddress); //NFT 발행 컨트랙트 변수

const name = 'test'; //프론트에서 가져와야함
const description = 'test123'; //프론트에서 가져와야함

/*
이미지는 총 3개
프론트에서 1 / 5 / 10 셋 중 하나를 넘겨주면 그에 맞게 이미지 상대경로를 넣어주면 됨
1: ./image/image1.png
5: ./image/image5.png
10: ./image/image10.png
*/


const pinata_upload = async (transactionCount, my_account) => {
  console.log("transactionCount : ", transactionCount);
  let imageLink;
  if (transactionCount === 1) {
    imageLink = "https://gateway.pinata.cloud/ipfs/QmSbyRsxbHQq4BS12p5GVfhuGgMkXniRaXbPYTneqF5p8h"
  } else if (transactionCount === 5) {
    imageLink = "https://gateway.pinata.cloud/ipfs/QmfH2j3bMYh6UVZkMkndxhcnphaEs5pwQxstKKGGWDEEHv"
  } else if (transactionCount === 10) {
    imageLink = "https://gateway.pinata.cloud/ipfs/QmWmkGuGJGapdfR1iNLKtLHdij3swMmHo2FjMRwbMAhCpH"
  }

  console.log("imageLink : " + imageLink);
  const imgHash = await ipfs.pinataUpload(imageLink);
  console.log("ddddddddddd")
  console.log(imgHash);

  const name = "ChainingDonate" + transactionCount
  const description = transactionCount + "번 기부 토큰"

  var createJson = {
    name,
    description,
    image : imageLink,
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
      'gasLimit': web3.utils.toHex(1000000),
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


const pinata_upload2 = async (NFTname, description, img, my_account) => {
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
        'gasPrice': web3.utils.toHex(1000000), // 가스 가격,
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

module.exports = {
  pinata_upload,
  pinata_upload2
}
