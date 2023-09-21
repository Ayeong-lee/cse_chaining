const express = require("express");
const router = express.Router();
const { Board } = require("../models");
const authMiddleware = require("../middlewares/authmiddleware");
const pagination = require('../utils/pagination');
const dayjs = require('dayjs');



// 게시물을 정렬하는 함수
async function sorting(boardList, sortby) {
  let arSortby = [];

  if (sortby) {
    arSortby = sortby.split(",");
  }

  if (arSortby.length > 0) {
    boardList.sort(function(comp1, comp2) {
      let result = 0;
      for (let index = 0; index < arSortby.length; index++) {
        if (hashmapSortby[arSortby[index]] != null) {
          result = hashmapSortby[arSortby[index]](comp1, comp2);
          if (result === 0) {
            continue;
          } else {
            break;
          }
        }
      }
      return result;
    });
  }

  return boardList;
}

router.get('/', async (req, res) => {
  try {
    const filteredBoardList = await Board.find();
    const sortedBoardList = await sorting(filteredBoardList, req.query.sortby);

    const paginationInfo = await pagination(sortedBoardList, req.query);

    const startIndex = (paginationInfo.pageNo - 1) * paginationInfo.countPerPage;
    const endIndex = startIndex + paginationInfo.countPerPage;

    const paginatedBoardList = sortedBoardList.slice(startIndex, endIndex);

    res.json({ success: true, data: paginatedBoardList, paginationInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errormessage: 'internal server error' });
  }
});

router.get('/:no', async (req, res) => {
  try {
    const post = await Board.findOne({ no: req.params.no });

    if (!post) {
      res.status(404).json({ success: false, errormessage: 'not found' });
      return;
    }
    res.json({ success: true, data: post });

  } catch (error) {
    res.status(500).json({ success: false, errormessage: 'internal server error' });
  }
})

router.post('/', authMiddleware, async (req, res) => {
  const lastBoard = await Board.findOne().sort({ _id: -1}).exec();
  const board = new Board();
  if (lastBoard) {
    board.no = lastBoard.no + 1;
  } else {
    board.no = 1;
  }
  board.subject = req.body.subject;
  board.content = req.body.content;
  board.writer = req.tokenInfo.memberId;
  const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  board.writedate = currentDate;
  board.minPrice = req.body?.minPrice | 0;
  board.imageLink = req.body.imageLink;
  const savedBoard = await board.save();
  res.json({ success:true, data: savedBoard });
})


router.put('/:no', async (req, res) => {
  const { subject, content, minPrice, imageLink } = req.body;
  const board = await Board.findOne({ no: req.params.no });
  if (!board) {
    res.json({success:false, errormessage:'존재하지 않는 게시글입니다.'});
  }
  if (subject) {
    board.subject = subject;
  }
  if (content) {
    board.content = content;
  }
  if (minPrice) {
    board.minPrice = minPrice;
  }
  if (imageLink) {
    board.imageLink = imageLink;
  }
  const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  board.writedate = currentDate;
  board.save();

  res.json({ success: true, data: board });
})

router.delete('/:no', async (req, res) => {
  const result = await Board.findOneAndDelete({ no: req.params.no });
  if (!result) {
    res.json({success:false, errormessage:'존재하지 않는 게시글입니다.'});
    return;
  }
  res.json({ success: true })

})

module.exports = router;
