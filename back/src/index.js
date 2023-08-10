require('dotenv').config()

const express = require('express');
const cors = require('cors');
const app = express();
const port = 9000;

const { PORT, MONGO_URI } = process.env

app.use(cors({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));
app.use('/members', require('./memberapi'));
//app.use('/boards', require('./authmiddleware'));
app.use('/boards', require('./boardapi'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))



app.get('/', (req, res) => {
    res.send('Hello Node.js!');
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
});






app.listen(port, () => {
    console.log('Listening...');
});

/*
또는 라우트 별로 authmiddleware를 추가하려면 다음과 같이 하면 됩니다.

boardapi.js 파일을 오픈한 후 require() 메서드로 authmiddleware를 가져옵니다.

const authMiddleware = require('./authmiddleware');
그리고 authmiddleware를 추가하고 싶은 라우트에 추가합니다.

router.post('/', authMiddleware, function(req, res, next) {
*/