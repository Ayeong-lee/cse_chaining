const express  = require('express');
const router = express.Router();
const dateFormat = require('dateformat');

let boardList = [
    {no:1, subject:"테스트 제목1", content:"테스트 내용1", writer:"testid1", writedate:"2021-08-09 13:00:00"},
    {no:2, subject:"테스트 제목2", content:"테스트 내용2", writer:"testid2", writedate:"2021-08-09 13:10:00"},
    {no:3, subject:"테스트 제목3", content:"테스트 내용3", writer:"testid3", writedate:"2021-08-09 13:20:00"}];
router.get('/', function(req, res, next) {
    console.log("REST API Get Method - Read All");
    res.json({success:true, data:boardList});
});

router.get('/:no', function(req, res, next) {
    console.log("REST API Get Method - Read " + req.params.no);
    var boardItem = boardList.find(object => object.no == req.params.no);
    if (boardItem != null) {
        res.json({success:true, data:boardItem});
    } else {
        res.status(404);
        res.json({success:false, errormessage:'not found'});
    }
});

router.post('/', function(req, res, next) {
    console.log("REST API Post Method - Create");
    var boardLastItem = boardList.reduce((previous, current) => previous.no > current.no ? previous:current);
    var boardItem = new Object();
    boardItem.no = boardLastItem.no + 1;
    boardItem.subject = req.body.subject;
    boardItem.content = req.body.content;
    boardItem.writer = req.body.writer;
    boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    boardList.push(boardItem);
    res.json({success:true});
});

router.put('/:no', function(req, res, next) {
    console.log("REST API Put Method - Update " + req.params.no);
    var boardItem = boardList.find(object => object.no == req.params.no);
    if (boardItem != null) {
        boardItem.subject = req.body.subject;
        boardItem.content = req.body.content;
        boardItem.writer = req.body.writer;
        boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        res.json({success:true});
    } else {
        res.status(404);
        res.json({success:false, errormessage:'not found'});
    }
});

router.delete('/:no', function(req, res, next) {
    console.log("REST API Delete Method - Delete " + req.params.no);
    var boardItem = boardList.find(object => object.no == req.params.no);
    if (boardItem != null) {
        var index = boardList.indexOf(boardItem);
        if (index >= 0) {
            boardList.splice(index, 1)
            res.json({success:true});
        } else {
            res.status(404);
            res.json({success:false, errormessage:'not found'});
        }
    } else {
        res.status(404);
        res.json({success:false, errormessage:'not found'});
    }
});
module.exports = router;
