const express  = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const authMiddleware = require('./authmiddleware');

let boardList = [
	{no:1, subject:"테스트 제목1", content:"테스트 내용1", writer:"testid1", writedate:"2021-08-09 13:00:00"},
	{no:2, subject:"테스트 제목2", content:"테스트 내용2", writer:"testid2", writedate:"2021-08-09 13:10:00"},
	{no:3, subject:"테스트 제목3", content:"테스트 내용3", writer:"testid3", writedate:"2021-08-09 13:20:00"},
	{no:4, subject:"테스트 제목4", content:"테스트 내용4", writer:"testid1", writedate:"2022-03-26 14:00:00"},
	{no:5, subject:"테스트 제목5", content:"테스트 내용5", writer:"testid2", writedate:"2022-03-26 15:10:00"},
	{no:6, subject:"테스트 제목6", content:"테스트 내용6", writer:"testid3", writedate:"2022-03-26 16:20:00"},
	{no:7, subject:"테스트 제목7", content:"테스트 내용7", writer:"testid1", writedate:"2022-03-26 17:30:00"},
	{no:8, subject:"테스트 제목8", content:"테스트 내용8", writer:"testid2", writedate:"2022-03-26 18:40:00"},
	{no:9, subject:"테스트 제목9", content:"테스트 내용9", writer:"testid3", writedate:"2022-03-26 19:50:00"},
	{no:10, subject:"테스트 제목10", content:"테스트 내용10", writer:"testid1", writedate:"2022-03-26 21:00:00"},
	{no:11, subject:"테스트 제목11", content:"테스트 내용11", writer:"testid2", writedate:"2022-03-26 22:10:00"},
	{no:12, subject:"테스트 제목12", content:"테스트 내용12", writer:"testid3", writedate:"2022-03-26 23:20:00"},
	{no:13, subject:"테스트 제목13", content:"테스트 내용13", writer:"testid1", writedate:"2022-03-27 00:30:00"}
	];

// 게시물 페이지네이션
function pagination(totalCount, countPerPage, pageSize, pageNo) {
	// 페이지네이션 정보
	var paginationInfo = {};
	
	// 마지막 페이지 번호(전체 페이지 크기)
	var lastPageNo = Math.floor(totalCount / countPerPage) + (totalCount % countPerPage== 0 ? 0 : 1);
	// 시작 페이지 번호
	var startPageNo = 1;
	// 페이지 사이즈로 페이지 번호를 나눈 몫만큼 페이지 시작 번호 변경
	var start = Math.floor(pageNo / pageSize);
	if (start >= 1) {
		// 그렇지만 나머지가 없으면 현재 페이지 번호가 마지막 페이지 번호와 같아 감소
		if (pageNo % pageSize == 0){
			start--;
		}
		startPageNo = (start * pageSize) + 1;
	}
	// 종료 페이지 번호
	var endPageNo = (startPageNo - 1) + pageSize;
	// 그렇지만 종료 페이지 번호가 마지막 페이지 번호보다 크면 마지막 페이지 번호로 변경
	if (endPageNo > lastPageNo) {
		endPageNo = lastPageNo;
	}
	// 이전 페이지 번호 활성화 여부
	var enablePrevPageNo = true;
	if ((pageNo - 1) == 0) {
		enablePrevPageNo = false;
	}
	// 다음 페이지 번호 활성화 여부
	var enableNextPageNo = true;
	if ((pageNo + 1) > lastPageNo) {
		enableNextPageNo = false;
	}
	// 이전 페이지 사이즈 번호
	var prevPageSizeNo = startPageNo - 1;
	// 이전 페이지 사이즈 번호 활성화 여부
	var enablePrevPageSizeNO = true;
	if (prevPageSizeNo == 0) {
		enablePrevPageSizeNO = false;
	}
	// 다음 페이지 사이즈 번호
	var nextPageSizeNo = endPageNo + 1;
	// 다음 페이지 사이즈 번호 활성화 여부
	var enableNextPageSizeNO = true;
	if (nextPageSizeNo > lastPageNo) {
		enableNextPageSizeNO = false;
	}
	
	// 페이지네이션 정보
	paginationInfo.totalCount = totalCount;
	paginationInfo.countPerPage = countPerPage;
	paginationInfo.pageSize = pageSize;
	paginationInfo.startPageNo = startPageNo;
	paginationInfo.endPageNo = endPageNo;
	paginationInfo.lastPageNo = lastPageNo;
	paginationInfo.pageNo = pageNo;
	paginationInfo.enablePrevPageNo = enablePrevPageNo;
	paginationInfo.enableNextPageNo = enableNextPageNo;
	paginationInfo.prevPageSizeNo = prevPageSizeNo;
	paginationInfo.enablePrevPageSizeNO = enablePrevPageSizeNO;
	paginationInfo.nextPageSizeNo = nextPageSizeNo;
	paginationInfo.enableNextPageSizeNO = enableNextPageSizeNO;
	
	return paginationInfo;
}

// 게시물 정렬
function sortBy(boardList, sortby) {
	// 정렬 배열
	var arSortby = null;
	
	if (sortby == undefined || typeof sortby == "undefined" || sortby == null) {
		arSortby = [];
	} else {
		arSortby = sortby.split(",");
	}
	
	if (arSortby.length > 0) {
		boardList.sort(function(comp1, comp2) {
			var result = 0;
			for (var index = 0; index < arSortby.length; index++) {
				if (hashmapSortby[arSortby[index]] != null) {
					result = hashmapSortby[arSortby[index]](comp1, comp2);
					if (result == 0) {
						continue;
					} else {
						break;
					}
				}
			}
			return result;
		});
	}
}

router.get('/', function(req, res, next) {
	console.log("REST API Get Method - Read All");
	// 필터된 게시판
	var filteredBoardList = filtering(req, boardList);
	
	// 정렬
	var sortby = req.query.sortby;
	sortBy(filteredBoardList, sortby);
	
	// 페이지 크기
	var countPerPage = req.query.countperpage;
	// 페이지 번호
	var pageNo = req.query.pageno;
	// 페이지 사이즈
	var pageSize = req.query.pagesize;
	
	if (countPerPage == undefined || typeof countPerPage == "undefined" || countPerPage == null) {
		countPerPage = 10;
	} else {
		countPerPage = parseInt(countPerPage);
	}
	if (pageSize == undefined || typeof pageSize == "undefined" || pageSize == null) {
		pageSize = 10;
	} else {
		pageSize = parseInt(pageSize);
	}
	if (pageNo == undefined || typeof pageNo == "undefined" || pageNo == null) {
		pageNo = 1;
	} else {
		pageNo = parseInt(pageNo);
	}
	
	// 전체 크기
	var totalCount = filteredBoardList.length;
	
	// 페이지네이션 정보
	var paginationInfo = pagination(totalCount, countPerPage, pageSize, pageNo);
	
	// 시작 번호
	var startItemNo = ((pageNo - 1) * countPerPage);
	// 종료 번호
	var endItemNo = (pageNo * countPerPage) - 1;
	// 종료 번호가 전체 크기보다 크면 전체 크기로 변경
	if (endItemNo > (totalCount - 1)) {
		endItemNo = totalCount - 1;
	}
	
	var boardPageList = [];
	if (startItemNo < totalCount) {
		for (var index = startItemNo; index <= endItemNo; index++) {
			boardPageList.push(filteredBoardList[index]);
		}
	}
	
	res.json({success:true, data:boardPageList, pagination:paginationInfo});
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




	
