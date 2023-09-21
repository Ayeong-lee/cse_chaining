const express = require('express')
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.

}));
// 정렬
const sort = {
	// 문자열 오름차순 정렬
	compareStringIgnoreCaseAsc: function(comp1, comp2) {
		var comp1UC = comp1.toUpperCase();
		var comp2UC = comp2.toUpperCase();
		if (comp1UC < comp2UC) {
			return -1;
		} else if (comp1UC > comp2UC) {
			return 1;
		}
		return 0;
	},
	// 문자열 내림차순 정렬
	compareStringIgnoreCaseDesc: function(comp1, comp2) {
		var comp1UC = comp1.toUpperCase();
		var comp2UC = comp2.toUpperCase();
		if (comp1UC < comp2UC) {
			return 1;
		} else if (comp1UC > comp2UC) {
			return -1;
		}
		return 0;
	},
	// 문자열 오름차순 정렬
	compareStringAsc: function(comp1, comp2) {
		if (comp1 < comp2) {
			return -1;
		} else if (comp1 > comp2) {
			return 1;
		}
		return 0;
	},
	// 문자열 내림차순 정렬
	compareStringDesc: function(comp1, comp2) {
		if (comp1 < comp2) {
			return 1;
		} else if (comp1 > comp2) {
			return -1;
		}
		return 0;
	},
	// 숫자 오름차순 정렬
	compareNumberAsc: function(comp1, comp2) {
		if (comp1 < comp2) {
			return -1;
		} else if (comp1 > comp2) {
			return 1;
		}
		return 0;
	},
	// 숫자 내림차순 정렬
	compareNumberDesc: function (comp1, comp2) {
		if (comp1 < comp2) {
			return 1;
		} else if (comp1 > comp2) {
			return -1;
		}
		return 0;
	},
	// 날짜 오름차순 정렬
	compareDateAsc: function(comp1, comp2) {
		var comp1DT = new Date(comp1).getTime();
		var comp2DT = new Date(comp2).getTime();
		if (comp1DT < comp2DT) {
			return -1;
		} else if (comp1DT > comp2DT) {
			return 1;
		}
		return 0;
	},
	// 날짜 내림차순 정렬
	compareDateDesc: function(comp1, comp2) {
		var comp1DT = new Date(comp1).getTime();
		var comp2DT = new Date(comp2).getTime();
		if (comp1DT < comp2DT) {
			return 1;
		} else if (comp1DT > comp2DT) {
			return -1;
		}
		return 0;
	}
    
};



module.exports = sort;