const express = require('express');
const app = express();
const port = 9000;
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
	res.send('Hello Node.js!');
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
}); 
//HTTP Request의 헤더(header)에 모든 리소스에 접근할 수 있게 허용하여 CORS(Cross-origin resource sharing, 교차 출처 리소스 공유) 문제를 해결합니다.
//그리고 GET, POST, PUT, DELETE 메서드를 사용할 수 있게 허용하고 content-type으로 요청을 보낼 수 있게 허용합니다.


app.use('/boards', require('./boardapi'));
//require() 메서드로 boardapi.js 모듈을 불러와서 웹 경로("/boards")로 사용되게 설정합니다.

app.use('/members', require('./memberapi'));

app.listen(port, () => {
	console.log('Listening...');
});