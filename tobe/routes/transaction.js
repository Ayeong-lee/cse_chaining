const express = require("express");
const router = express.Router();
const { Board, Transaction, Member} = require("../models");
const authMiddleware = require("../middlewares/authmiddleware");
const pagination = require('../utils/pagination');
const dayjs = require('dayjs');


// 결제 내역 조회
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ memberId: req.tokenInfo.memberId });
    res.json({ success: true, data: transactions}) ;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errormessage: 'internal server error' });
  }
});

// 기부 순위 조회
router.get('/rank', async (req, res) => {
  try {
    const members = await Member.find().sort({ transactionCount: -1 })

    const results = members.map((member, index) => {
      return {
        member,
        rank: index + 1
      }
    })
    res.json({ success: true, data: results });

  } catch (error) {
    res.status(500).json({ success: false, errormessage: 'internal server error' });
  }
})

module.exports = router;
