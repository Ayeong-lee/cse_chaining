const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const mongoose = require('mongoose');
const pagination = require('./common/pagination');
const cors = require('cors');
const authMiddleware = require('./authmiddleware');

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

// 게시물 스키마 정의
const boardSchema = new mongoose.Schema({
no: Number,
subject: String,
content: String,
writer: String,
writedate: String,
});

// 게시물 모델 생성
const Board = mongoose.model('Board', boardSchema);


// 게시물을 필터링하는 함수
async function filtering(req) {
	try {
	const boardList = await Board.find();

	// 필터링 로직 구현
	// 여기서는 특별한 필터링 로직이 없으므로 그대로 반환
	return boardList;
} catch (error) {
	throw error;
}
}


// 게시물을 정렬하는 함수
async function sorting(boardList, sortby) {
// 정렬 배열
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



// REST API 수정된 부분
router.get('/', async function(req, res, next) {
console.log("REST API Get Method - Read All");

try {
    const filteredBoardList = await filtering(req);
    const sortedBoardList = await sorting(filteredBoardList, req.query.sortby);

    const paginationInfo = await pagination(sortedBoardList, req.query);

    const startIndex = (paginationInfo.pageNo - 1) * paginationInfo.countPerPage;
    const endIndex = startIndex + paginationInfo.countPerPage;

    const paginatedBoardList = sortedBoardList.slice(startIndex, endIndex);

    res.json({ success: true, data: paginatedBoardList, paginationInfo });
} catch (error) {
    res.status(500).json({ success: false, errormessage: 'internal server error' });
}
});

router.get('/:no', async function(req, res, next) {
	console.log("REST API Get Method - Read " + req.params.no);
	
	try {
	  const post = await Board.findOne({ no: req.params.no });
	  
	  if (post) {
		res.json({ success: true, data: post });
	  } else {
		res.status(404).json({ success: false, errormessage: 'not found' });
	  }
	} catch (error) {
	  res.status(500).json({ success: false, errormessage: 'internal server error' });
	}
});

router.post('/', function(req, res, next) {
	console.log("REST API Post Method - Create");
	var boardLastItem = boardList.reduce((previous, current) => previous.no > current.no ? previous:current);
	var boardItem = new Object();
	boardItem.no = boardLastItem.no + 1;
	boardItem.subject = req.body.subject;
	boardItem.content = req.body.content;
	boardItem.writer = req.tokenInfo.memberId;
	boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	boardList.push(boardItem);
	res.json({success:true});
});

router.put('/:no', function(req, res, next) {
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

router.delete('/:no', function(req, res, next) {
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



module.exports = router;


/*
// 페이지네이션 정보를 계산하는 함수
function pagination(boardList, query) {
const totalCount = boardList.length;
const countPerPage = query.countperpage ? parseInt(query.countperpage) : 10;
const pageSize = query.pagesize ? parseInt(query.pagesize) : 10;
const pageNo = query.pageno ? parseInt(query.pageno) : 1;

const totalPage = Math.ceil(totalCount / countPerPage);

return {
totalCount,
countPerPage,
pageSize,
pageNo,
totalPage,
};
}

*/


/*
const express  = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const pagination = require('./commons/pagination');

const cors = require('cors');

const app = express();
app.use(express.json()); // JSON 데이터 파싱을 위한 설정
app.use(cors({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));

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


router.get('/', function(req, res, next) {
	console.log("REST API Get Method - Read All");
	
	// 필터된 게시판
	var filteredBoardList = filtering(req, boardList);
	
	// 정렬
	var sortby = req.query.sortby;
	// 정렬 배열
	var arSortby = null;
	
	if (sortby == undefined || typeof sortby == "undefined" || sortby == null) {
		arSortby = [];
	} else {
		arSortby = sortby.split(",");
	}
	
	if (arSortby.length > 0) {
		filteredBoardList.sort(function(comp1, comp2) {
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

// 전체 크기
var totalCount = filteredBoardList.length;

// 페이지네이션 정보
var paginationInfo = pagination(totalCount, req.query.countperpage, req.query.pagesize, req.query.pageno);

// 시작 번호
var startItemNo = ((paginationInfo.pageNo - 1) * paginationInfo.countPerPage);
// 종료 번호
var endItemNo = (paginationInfo.pageNo * paginationInfo.countPerPage) - 1;
// 종료 번호가 전체 크기보다 크면 전체 크기로 변경
if (endItemNo > (totalCount - 1)) {
	endItemNo = totalCount - 1;
}

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
	res.json({ success: true, data: boardItem }); // Include the newly created item in the response
});


router.put('/:no', function(req, res, next) {
	console.log("REST API Put Method - Update " + req.params.no);
	var boardItem = boardList.find(object => object.no == req.params.no);
	if (boardItem != null) {
		// Only update the specified fields
		boardItem.subject = req.body.subject !== undefined ? req.body.subject : boardItem.subject;
		boardItem.content = req.body.content !== undefined ? req.body.content : boardItem.content;
		boardItem.writer = req.body.writer !== undefined ? req.body.writer : boardItem.writer;
		boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
		res.json({ success: true, data: boardItem }); // Include the updated item in the response
	} else {
		res.status(404);
		res.json({ success: false, errormessage: 'not found' });
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

*/


	
/* mongodb 연동시부턴 필요없음(정렬, 필터)
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

// 게시물 필터
function filter(element, columnName, compareCondition, compareValue) {
	var result = false;
	if (typeof element[columnName] == "string") {
		// 문자열 비교
		if (compareCondition == "eq") {
			result = (element[columnName] == compareValue);
		} else if (compareCondition == "ei") {
			result = (element[columnName].toUpperCase() == compareValue.toUpperCase());
		} else if (compareCondition == "ne") {
			result = (element[columnName] != compareValue);
		}
	} else if (typeof element[columnName] == "number") {
		// 숫자 비교
		if (compareCondition == "eq") {
			result = (element[columnName] == compareValue);
		} else if (compareCondition == "lt") {
			result = (element[columnName] < compareValue);
		} else if (compareCondition == "le") {
			result = (element[columnName] <= compareValue);
		} else if (compareCondition == "gt") {
			result = (element[columnName] > compareValue);
		} else if (compareCondition == "ge") {
			result = (element[columnName] >= compareValue);
		} else if (compareCondition == "ne") {
			result = (element[columnName] != compareValue);
		}
	}
	return result;
};

// 게시물 필터
function filtering(req, boardList) {
	// 필터된 배열
	var filtered = [];
	// 반복 카운트
	var loopCount = 0;
	
	// 필터 제외
	const excludeFilter = ["countperpage", "pageno", "pagesize", "sortby"];
	// 필터
	for (queryName in req.query) {
		if (!excludeFilter.includes(queryName.toLowerCase())) {
			// 대상 칼럼 명
			var columnName = queryName;
			// 비교문
			var compareCondition = "eq";
			// 비교값
			var compareValue = req.query[queryName];
			if (typeof compareValue == "string") {
				var pos = compareValue.indexOf(":");
				if (pos > 0) {
					compareCondition = compareValue.substr(0, pos);
					compareValue = compareValue.substring(pos+1);
				}
				if (loopCount == 0) {
					filtered = boardList.filter(function(element) {
						return filter(element, columnName, compareCondition, compareValue);
					});
				} else {
					filtered = filtered.filter(function(element) {
						return filter(element, columnName, compareCondition, compareValue);
					});
				}
				loopCount++;
			} else if (Array.isArray(compareValue)) {
				for (var index = 0; index < compareValue.length; index++) {
					// 비교문
					var arCompareCondition = "eq";
					// 비교값
					var arCompareValue = compareValue[index];
					var pos = arCompareValue.indexOf(":");
					if (pos > 0) {
						arCompareCondition = arCompareValue.substr(0, pos);
						arCompareValue = arCompareValue.substring(pos+1);
					}
					if (loopCount == 0) {
						filtered = boardList.filter(function(element) {
							return filter(element, columnName, arCompareCondition, arCompareValue);
						});
					} else {
						filtered = filtered.filter(function(element) {
							return filter(element, columnName, arCompareCondition, arCompareValue);
						});
					}
					loopCount++;
				}
			}
			if (filtered.length == 0) {
				break;
			}
		}
	}
	
	if (loopCount == 0) {
		filtered = boardList;
	}
	
	return filtered;
};

// 정렬 해시맵(HashMap)
var hashmapSortby = []; 

// 작성자 오름차순 정렬
hashmapSortby["writer.asc"] = function(comp1, comp2) {
	var comp1UC = comp1.writer.toUpperCase();
	var comp2UC = comp2.writer.toUpperCase();
	if (comp1UC < comp2UC) {
		return -1;
	} else if (comp1UC > comp2UC) {
		return 1;
	}
	return 0;
};

// 작성자 내림차순 정렬
hashmapSortby["writer.desc"] = function(comp1, comp2) {
	var comp1UC = comp1.writer.toUpperCase();
	var comp2UC = comp2.writer.toUpperCase();
	if (comp1UC < comp2UC) {
		return 1;
	} else if (comp1UC > comp2UC) {
		return -1;
	}
	return 0;
};

// 작성날짜 오름차순 정렬
hashmapSortby["writedate.asc"] = function(comp1, comp2) {
	var comp1UC = new Date(comp1.writedate).getTime();
	var comp2UC = new Date(comp2.writedate).getTime();
	if (comp1UC < comp2UC) {
		return -1;
	} else if (comp1UC > comp2UC) {
		return 1;
	}
	return 0;
};
	
// 작성날짜 내림차순 정렬
hashmapSortby["writedate.desc"] = function(comp1, comp2) {
	var comp1UC = new Date(comp1.writedate).getTime();
	var comp2UC = new Date(comp2.writedate).getTime();
	if (comp1UC < comp2UC) {
		return 1;
	} else if (comp1UC > comp2UC) {
		return -1;
	}
	return 0;
};

// 조회 수 오름차순 정렬
hashmapSortby["viewcount.asc"] = function(comp1, comp2) {
	var comp1UC = comp1.viewcount;
	var comp2UC = comp2.viewcount;
	if (comp1UC < comp2UC) {
		return -1;
	} else if (comp1UC > comp2UC) {
		return 1;
	}
	return 0;
};

// 조회 수 내림차순 정렬
hashmapSortby["viewcount.desc"] = function(comp1, comp2) {
	var comp1UC = comp1.viewcount
	var comp2UC = comp2.viewcount
	if (comp1UC < comp2UC) {
		return 1;
	} else if (comp1UC > comp2UC) {
		return -1;
	}
	return 0;
};
*/
