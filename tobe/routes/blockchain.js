const express = require("express");
const router = express.Router();
const multer = require("multer");

const {Web3} = require('web3');
const Tx = require('ethereumjs-tx'); //npm install ethereumjs-tx@1.3.7
const fs = require('fs');
const abi = require('../abi/abi');
const { Network, Alchemy } = require('alchemy-sdk');
const ipfs = require('../module/ipfs');
const { pinata_upload, pinata_upload2 } = require('../utils/blockchain');
const authMiddleware = require('../middlewares/authmiddleware');
const {Board, Transaction, Member } = require('../models');
const dayjs = require('dayjs');


/* 사용자가 개인키를 입력하도록 구현 => 프론트에 요청
이게 보안이 굉장히 취약한 부분이라 혹시 가능하다면... 보안 처리를 부탁드립니다 .env를 쓴다던가.......
*/

const infura_api_key = process.env.INFURA_API_KEY;
const node_host = 'https://sepolia.infura.io/v3/' + infura_api_key;

const web3 = new Web3(node_host);



/*맨 위부터 여기까지는 웬만하면 블록체인 코드를 쓰는 모든 파일에 삽입할 것
꼭 변수들 const로 관리하지 않아도 됨
비동기처리 안해놓은 함수들 비동기처리해도 상관x
*/



router.post('/transaction', authMiddleware, async (req, res) => {
  // 프론트엔드로부터 게시글 id 받도록 파라미터 추가
  const { boardNo } = req.body;

  // : 사용자 DB로부터 불러오기!
  const memberId = req.tokenInfo.memberId;
  const member = await Member.findOne({ id: memberId });
  const private_key = member.privateKey;
  console.log("private_key : ", private_key)
  const my_account = member.myAccount;
  const privateKeyBuffer = Buffer.from(private_key, "hex");

  // 게시글 작성자의 계좌를 불러와서 보내야 함!
  const board = await Board.findOne({ no: boardNo });
  const receiver = await Member.findOne({ id: board.writer })
  const receive_account = receiver.myAccount;

  console.log("memberId : " + memberId);
  //송금 코드 시작
  const send_eth = req.body.sendEth;

  web3.eth.getTransactionCount(my_account).then((txCount)=>{
    const hex = web3.utils.toHex(txCount);
    const value = web3.utils.toHex(BigInt(web3.utils.toWei(send_eth, "gwei")))

    const txObject = {
      'nonce': hex, // Transaction의 발동 횟수
      'from': my_account, // 발신자
      'to': receive_account, // 수신자
      'value' : value,
      'gasLimit': web3.utils.toHex(21000), // 가스 한도
      'gasPrice': web3.utils.toHex(1000000),
      'chainId': 11155111,
    };

    const tx = new Tx(txObject);
    tx.sign(privateKeyBuffer);

    const serializedTx = tx.serialize();

    const raw = '0x' + serializedTx.toString('hex');
    web3.eth.sendSignedTransaction(raw).then(async (txHash) => {
      console.log("---------------")
      const url = 'https://sepolia.etherscan.io/tx/' + txHash.transactionHash //이더스캔 링크. db에 '거래 목록' 테이블 만들어서 저장해두기
      console.log(txHash);
      // console.log(url);//링크 잘 나와있는지 확인 후 프론트한테 해당 링크 전달. 이상하면 조장한테 갠톡

      // DB에 트랜잭션 해쉬 링크 저장 로직
      const transaction = new Transaction();
      transaction.memberId = memberId;
      transaction.url = url;
      await transaction.save();
      console.log(transaction);

      // DB에 송금 횟수 증가 로직
      const member = await Member.findOne({id: memberId});
      member.transactionCount += 1;
      await member.save();
      console.log(member);

      // 특정 송금 횟수 도달이 될 경우 NFT 발행
      if (member.transactionCount === 1 || member.transactionCount === 5 || member.transactionCount === 10) {
        console.log("pinata_upload--------------------")
        pinata_upload(member.transactionCount, my_account);
      }

      res.send({success: true, data: {url}});
    })
      .catch((err) => {
        if (err.name === "TransactionRevertInstructionError") {
          res.send({success: false, message: "잔액이 부족합니다."});
        } else {
          res.send({success: false, message: "예상치 못한 에러입니다. 서버 개발자에게 문의하세요."});
        }
      })
  })
  //송금 코드 끝
})

router.post('/nfts', authMiddleware, async (req, res) => {
  // : 사용자 DB로부터 불러오기!
  const memberId = req.tokenInfo.memberId;
  const member = await Member.findOne({ id: memberId });
  const private_key = member.privateKey;
  console.log("private_key : ", private_key)
  const my_account = member.myAccount;
  const privateKeyBuffer = Buffer.from(private_key, "hex");

  const { NFTname, description, img } = req.body;
  await pinata_upload2(NFTname, description, img, my_account);
  res.send({ success: true });
})

router.get('/nfts', authMiddleware, async (req, res) => {
  // : 사용자 DB로부터 불러오기!
  const memberId = req.tokenInfo.memberId;
  const member = await Member.findOne({ id: memberId });
  const private_key = member.privateKey;
  const my_account = member.myAccount;
  const privateKeyBuffer = Buffer.from(private_key, "hex");

  // // 게시글 작성자의 계좌를 불러와서 보내야 함!
  // const board = await Board.findOne({ no: boardNo });
  // const receiver = await Member.findOne({ id: board.writer })
  // const receive_account = receiver.myAccount;

  const api_key = 'XU4Kq-Fmqb9I6hpKhBvIu6TbAhPP5Wc8';

  const settings = {
    apiKey: api_key,
    network: Network.ETH_SEPOLIA,
    withMetadata: 'true'
  };

  console.log(settings.apiKey);

  const alchemy = new Alchemy(settings);

  alchemy.nft.getNftsForOwner(my_account).then(result => {
    console.log("GETNFT_RESULT")
    console.log(result)
    console.log(result.ownedNfts[0].contract)
    result.ownedNfts = result.ownedNfts.filter(nft => {
      return nft.contract.name === 'Chaining'
    });
    const convertedResult = {
      ownedNfts: result.ownedNfts.map(nft => {
        return {
          title: nft.title,
          description: nft.description,
          media: nft.media[0]?.gateway
        }
      })
    }
    res.send({ success: true, data: convertedResult });
  });
})

module.exports = router;
