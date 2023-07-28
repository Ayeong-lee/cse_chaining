const express  = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const authMiddleware = require('./authmiddleware');

let boardList = [
    {no:1, subject:"테스트 제목1", content:"테스트 내용1", writer:"testid1", writedate:"2021-08-09 13:00:00"},
    {no:2, subject:"테스트 제목2", content:"테스트 내용2", writer:"testid2", writedate:"2021-08-09 13:10:00"},
    {no:3, subject:"테스트 제목3", content:"테스트 내용3", writer:"testid3", writedate:"2021-08-09 13:20:00"}];

router.get('/', function(req, res, next) {
    console.log("REST API Get Method - Read All");
    res.json({success:true, data:boardList});
});
//HTTP GET 메서드로 요청(Request)이 들어오면 게시판 배열 전체를 리턴합니다.
//res.json() 메서드는 응답(Response) 메시지를 JSON 구조로 전달합니다.


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
//HTTP GET 메서드로 게시판 번호(no)가 포함되어서 요청(Request)이 들어오면 
//게시판 배열에서 게시판 번호로 검색하여 게시판 객체를 리턴합니다.
//게시판 번호(no)가 게시판 배열에 없으면 404 에러와 에러 메시지를 리턴합니다.

router.post('/', authMiddleware, function(req, res, next) {
	console.log("REST API Post Method - Create");
	var boardLastItem = boardList.reduce((previous, current) => previous.no > current.no ? previous:current);
	var boardItem = new Object();
	boardItem.no = boardLastItem.no + 1;
	boardItem.subject = req.body.subject;
	boardItem.content = req.body.content;
	boardItem.writer = req.tokenInfo.memberId; //게시물 작성자(writer)를 인증된 로그인 사용자의 아이디(req.tokenInfo.memberId)로 처리되게함
	boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	boardList.push(boardItem);
	res.json({success:true});
});
//HTTP POST 메서드로 요청(Request) 내용(body)에 게시판 내용이 JSON 데이터로 포함되어서 요청이 들어오면 게시판 배열에 추가합니다.

router.put('/:no', authMiddleware, function(req, res, next) {
	console.log("REST API Put Method - Update " + req.params.no);
	var boardItem = boardList.find(object => object.no == req.params.no);
	if (boardItem != null) {
		if (boardItem.writer == req.tokenInfo.memberId) {
			boardItem.subject = req.body.subject;
			boardItem.content = req.body.content;
			boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
			res.json({success:true});
		} else {
			res.status(403);
			res.json({success:false, errormessage:'id are not identical'});
		}
	} else {
		res.status(404);
		res.json({success:false, errormessage:'not found'});
	}
});
//HTTP PUT 메서드로 게시판 번호(no)와 요청(Request) 내용(body)에 게시판 내용이 JSON 데이터로 포함되어서 요청이 들어오면 게시판 배열에서 게시판 번호로 검색하여 게시판 객체의 내용을 업데이트합니다.
//등록된 게시물 작성자(writer)와 인증된 로그인 사용자의 아이디(req.tokenInfo.memberId)를 같지 않으면 처리되지 않고 "id are not identical"라고 리턴됩니다.



router.delete('/:no', authMiddleware, function(req, res, next) {
	console.log("REST API Delete Method - Delete " + req.params.no);
	var boardItem = boardList.find(object => object.no == req.params.no);
	if (boardItem != null) {
		if (boardItem.writer == req.tokenInfo.memberId) {
			var index = boardList.indexOf(boardItem);
			if (index >= 0) {
				boardList.splice(index, 1);
				res.json({success:true});
			} else {
				res.status(404);
				res.json({success:false, errormessage:'not found'});
			}
		} else {
			res.status(403);
			res.json({success:false, errormessage:'id are not identical'});
		}
	} else {
		res.status(404);
		res.json({success:false, errormessage:'not found'});
	}
});
//HTTP DELETE 메서드로 게시판 번호(no)가 포함되어서 요청(Request)이 들어오면 게시판 배열에서 게시판 번호로 검색하여 게시판 객체를 삭제합니다.
//게시물 삭제에서 등록된 게시물 작성자(writer)와 인증된 로그인 사용자의 아이디(req.tokenInfo.memberId)를 비교하여 처리되게 수정합니다. 동일하지 않으면 상태 코드를 403으로 하고 처리를 중지시킵니다.
module.exports = router;

