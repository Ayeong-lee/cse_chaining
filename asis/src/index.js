const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const { User } = require('./models/User');
const memberAPI = require('./memberapi');
const authMiddleware = require('./authmiddleware'); //라우트 별로 authmiddleware를 추가하려면 이와 같이 하면 됩니다.
const boardAPI = require('./boardapi');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결 설정
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB 연결 성공..."))
  .catch((err) => console.log(err));

// 회원가입 API
app.post("/users/register", (req, res) => {
  const user = new User(req.body);

  user.save()
    .then(userInfo => {
      res.status(200).json({ success: true, userInfo: userInfo });
    })
    .catch(err => {
      res.json({ success: false, err });
    });
});

// API 라우팅
app.use('/members', memberAPI);
// app.use('/boards', authMiddleware);
app.use('/boards', boardAPI);

// CORS 헤더 설정
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

const port = process.env.PORT || 9000;
// 루트 경로 응답
app.get('/', (req, res) => {
  res.send('Hello Node.js!');
});

// 서버 실행
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


/*
또는 라우트 별로 authmiddleware를 추가하려면 다음과 같이 하면 됩니다.

boardapi.js 파일을 오픈한 후 require() 메서드로 authmiddleware를 가져옵니다.

const authMiddleware = require('./authmiddleware');
그리고 authmiddleware를 추가하고 싶은 라우트에 추가합니다.

router.post('/', authMiddleware, function(req, res, next) {
*/

/*
HTTP Request의 헤더(header)에 모든 리소스에 접근할 수 있게 허용하여 CORS(Cross-origin resource sharing, 교차 출처 리소스 공유) 문제를 해결합니다.

그리고 GET, POST, PUT, DELETE 메서드를 사용할 수 있게 허용하고 content-type으로 요청을 보낼 수 있게 허용합니다.

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});
*/
