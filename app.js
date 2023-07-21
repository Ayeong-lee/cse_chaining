// 필요한 모듈들을 임포트합니다.
const express = require("express");
const { ObjectId } = require("mongodb");
const handlebars = require("express-handlebars");
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");
const history = require('connect-history-api-fallback');
const indexRouter = require('./routes/index');
const userRouter = express.Router();


// Express 앱을 생성합니다.
const app = express();

var path = require('path');
var router = express.Router();



app.use(express.static('public'));






/* GET home page. */
router.get('/t', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));

  // res.render('index', { title: 'Express' }); // 기존 파일
});

module.exports = router;

// 서버 포트 번호를 3000으로 설정하고, .env 파일의 환경 변수를 로딩합니다.
const port = 3000;
require("dotenv").config();



// JSON 파싱과 URL 인코딩 미들웨어를 등록합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.use(history()); // vue router 기능을 위해 추가
app.use('/', indexRouter);

// Handlebars 템플릿 엔진 설정
app.engine(
  "handlebars",
  handlebars.create({
    helpers: require("./configs/handlebars-helpers"),
  }).engine
);

// 로그인 페이지 라우트를 설정합니다.
app.get('/login', (req, res) => {
  res.render('login'); // login.handlebars 파일을 렌더링하여 클라이언트에게 전달합니다.
});

// 로그인 처리 라우트를 설정합니다.
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 여기에서 MongoDB를 사용하여 로그인 처리 로직을 구현합니다.
  // (예: 사용자 정보를 검색하고, 비밀번호를 확인하는 등의 작업)
  
  // 로그인 성공 시, 세션 등을 설정하고 홈 페이지로 리다이렉트합니다.
  res.redirect('/home');
});

// 홈 페이지 라우트를 설정합니다.
app.get('/home', (req, res) => {
  res.send('Welcome to the home page!');
});

// 뷰 엔진과 뷰 폴더 설정을 합니다.
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// 루트 라우트를 설정합니다.
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 현재 페이지 데이터
  const search = req.query.search || ""; // 검색어 데이터
  try {
    // postService.list에서 글 리스트와 페이지네이터를 가져옴
    const [posts, paginator] = await postService.list(collection, page, search);

    // 리스트 페이지 렌더링
    res.render("home", { title: "테스트 게시판", search, paginator, posts });
  } catch (error) {
    console.error(error);
    res.render("home", { title: "테스트 게시판" }); // 에러가 나는 경우는 빈값으로 렌더링
  }
});

// 글쓰기 페이지 라우트를 설정합니다.
app.get("/write", (req, res) => {
  res.render("write", { title: "테스트 게시판", mode: "create" });
});

// 글쓰기 처리 라우트를 설정합니다.
app.post("/write", async (req, res) => {
  const post = req.body;
  const result = await postService.writePost(collection, post); // 글쓰기 후 결과 반환
  res.redirect(`/detail/${result.insertedId}`); // 생성된 도큐먼트의 _id를 사용해 상세페이지로 이동
});

// 상세 페이지 라우트를 설정합니다.
app.get("/detail/:id", async (req, res) => {
  // 게시글 정보 가져오기
  const result = await postService.getDetailPost(collection, req.params.id);
  res.render("detail", {
    title: "테스트 게시판",
    post: result.value,
  });
});

// 비밀번호 확인 처리 라우트를 설정합니다.
app.post("/check-password", async (req, res) => {
  // id, password 값을 가져옴
  const { id, password } = req.body;

  // postService의 getPostByIdAndPassword() 함수를 사용해 게시글 데이터 확인
  const post = postService.getPostByIdAndPassword(collection, { id, password });

  // 데이터가 있으면 isExist true, 없으면 isExist false
  if (!post) {
    return res.status(404).json({ isExist: false });
  } else {
    return res.json({ isExist: true });
  }
});

// 수정 페이지로 이동 mode는 modify
app.get("/modify/:id", async (req, res) => {
  const { id } = req.params.id;
  // getPostById() 함수로 게시글 데이터를 받아옴
  const post = await postService.getPostById(collection, req.params.id);
  console.log(post);
  res.render("write", { title: "테스트 게시판 ", mode: "modify", post });
});

// 게시글 수정 API를 설정합니다.
app.post("/modify/", async (req, res) => {
  const { id, title, writer, password, content } = req.body;

  const post = {
    title,
    writer,
    password,
    content,
    createdDt: new Date().toISOString(),
  };
  // 업데이트 결과
  const result = postService.updatePost(collection, id, post);
  res.redirect(`/detail/${id}`);
});

// 게시글 삭제 처리 라우트를 설정합니다.
app.delete("/delete", async (req, res) => {
  const { id, password } = req.body;
  try {
    // collection의 deleteOne을 사용해 게시글 하나를 삭제
    const result = await collection.deleteOne({
      _id: ObjectId(id),
      password: password,
    });
    // 삭제 결과가 잘못된 경우의 처리
    if (result.deletedCount !== 1) {
      console.log("삭제 실패");
      return res.json({ isSuccess: false });
    }
    return res.json({ isSuccess: true });
  } catch (error) {
    // 에러가 난 경우의 처리
    console.error(error);
    return res.json({ isSuccess: false });
  }
});

// 댓글 추가 처리 라우트를 설정합니다.
app.post("/write-comment", async (req, res) => {
  const { id, name, password, comment } = req.body; // body에서 데이터를 가져옵니다.
  const post = await postService.getPostById(collection, id); // id로 게시글의 정보를 가져옵니다.
  console.log(post);
  // 게시글에 기존 댓글 리스트가 있으면 추가합니다.
  if (post.comments) {
    post.comments.push({
      idx: post.comments.length + 1,
      name,
      password,
      comment,
      createdDt: new Date().toISOString(),
    });
  } else {
    // 게시글에 댓글 정보가 없으면 리스트에 댓글 정보를 추가합니다.
    post.comments = [
      {
        idx: 1,
        name,
        password,
        comment,
        createdDt: new Date().toISOString(),
      },
    ];
  }

  // 업데이트하기. 업데이트 후에는 상세페이지로 다시 리다이렉트합니다.
  postService.updatePost(collection, id, post);
  return res.redirect(`/detail/${id}`);
});

// 댓글 삭제 처리 라우트를 설정합니다.
app.delete("/delete-comment", async (req, res) => {
  const { id, idx, password } = req.body;

  // 게시글(post)의 comments 안에 있는 특정 댓글 데이터를 찾습니다.
  const post = await collection.findOne(
    {
      _id: ObjectId(id),
      comments: { $elemMatch: { idx: parseInt(idx), password } },
    },
    postService.projectionOption
  );

  // 데이터가 없으면 isSuccess: false를 주면서 종료합니다.
  if (!post) {
    return res.json({ isSuccess: false });
  }

  // 댓글 번호가 idx 이외인 것만 comments에 다시 할당 후 저장합니다.
  post.comments = post.comments.filter((comment) => comment.idx != idx);
  postService.updatePost(collection, id, post);
  return res.json({ isSuccess: true });
});

// MongoDB와 연결 후 서버를 시작합니다.
let collection;
app.listen(3000, async () => {
  console.log("Server started");
  const mongoClient = await mongodbConnection();
  collection = mongoClient.db().collection("post");
  console.log("MongoDB connected");
});


/*
const express = require("express");
const { ObjectId } = require("mongodb");
const handlebars = require("express-handlebars");
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");

const port = 3000;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  handlebars.create({
    helpers: require("./configs/handlebars-helpers"),
  }).engine
);

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  res.render('login'); // login.handlebars 파일을 렌더링하여 클라이언트에게 전달합니다.
});

// 로그인 처리 라우트
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 여기에서 MongoDB를 사용하여 로그인 처리 로직을 구현합니다.
  // (예: 사용자 정보를 검색하고, 비밀번호를 확인하는 등의 작업)
  
  // 로그인 성공 시, 세션 등을 설정하고 홈 페이지로 리다이렉트합니다.
  res.redirect('/home');
});

// 홈 페이지 라우트
app.get('/home', (req, res) => {
  res.send('Welcome to the home page!');
});


app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 현재 페이지 데이터
  const search = req.query.search || ""; // 검색어 데이터
  try {
    // postService.list에서 글리스트와 페이지네이터를 가져옴
    const [posts, paginator] = await postService.list(collection, page, search);

    // 리스트 페이지 렌더링
    res.render("home", { title: "테스트 게시판", search, paginator, posts });
  } catch (error) {
    console.error(error);
    res.render("home", { title: "테스트 게시판" }); // 에러가 나는 경우는 빈값으로 렌더링
  }
});

app.get("/write", (req, res) => {
  res.render("write", { title: "테스트 게시판", mode: "create" });
});

app.post("/write", async (req, res) => {
  const post = req.body;
  const result = await postService.writePost(collection, post); // 글쓰기 후 결과 반환
  res.redirect(`/detail/${result.insertedId}`); // 생성된 도큐먼트의 _id를 사용해 상세페이지로 이동
});

app.get("/detail/:id", async (req, res) => {
  // 게시글 정보 가져오기
  const result = await postService.getDetailPost(collection, req.params.id);
  res.render("detail", {
    title: "테스트 게시판",
    post: result.value,
  });
});

app.post("/check-password", async (req, res) => {
  // id, password 값을 가져옴
  const { id, password } = req.body;

  // postService의 getPostByIdAndPassword() 함수를 사용해 게시글 데이터 확인
  const post = postService.getPostByIdAndPassword(collection, { id, password });

  // 데이터가 있으면 isExist true, 없으면 isExist false
  if (!post) {
    return res.status(404).json({ isExist: false });
  } else {
    return res.json({ isExist: true });
  }
});

// 수정 페이지로 이동 mode는 modify
app.get("/modify/:id", async (req, res) => {
  const { id } = req.params.id;
  // getPostById()  함수로 게시글 데이터를 받아옴
  const post = await postService.getPostById(collection, req.params.id);
  console.log(post);
  res.render("write", { title: "테스트 게시판 ", mode: "modify", post });
});

// 게시글 수정 API
app.post("/modify/", async (req, res) => {
  const { id, title, writer, password, content } = req.body;

  const post = {
    title,
    writer,
    password,
    content,
    createdDt: new Date().toISOString(),
  };
  // 업데이트 결과
  const result = postService.updatePost(collection, id, post);
  res.redirect(`/detail/${id}`);
});

app.delete("/delete", async (req, res) => {
  const { id, password } = req.body;
  try {
    // collection의 deleteOne을 사용해 게시글 하나를 삭제
    const result = await collection.deleteOne({
      _id: ObjectId(id),
      password: password,
    });
    // 삭제 결과가 잘 못된 경우의 처리
    if (result.deletedCount !== 1) {
      console.log("삭제 실패");
      return res.json({ isSuccess: false });
    }
    return res.json({ isSuccess: true });
  } catch (error) {
    // 에러가 난 경우의 처리
    console.error(error);
    return res.json({ isSuccess: false });
  }
});

// 댓글 추가
app.post("/write-comment", async (req, res) => {
  const { id, name, password, comment } = req.body; // body에서 데이터를 가지고 오기
  const post = await postService.getPostById(collection, id); // id로 게시글의 정보를 가져오기
  console.log(post);
  // 게시글에 기존 댓글 리스트가 있으면 추가
  if (post.comments) {
    post.comments.push({
      idx: post.comments.length + 1,
      name,
      password,
      comment,
      createdDt: new Date().toISOString(),
    });
  } else {
    // 게시글에 댓글 정보가 없으면 리스트에 댓글 정보 추가
    post.comments = [
      {
        idx: 1,
        name,
        password,
        comment,
        createdDt: new Date().toISOString(),
      },
    ];
  }

  // 업데이트하기. 업데이트 후에는 상세페이지로 다시 리다이렉트
  postService.updatePost(collection, id, post);
  return res.redirect(`/detail/${id}`);
});

// 댓글 삭제
app.delete("/delete-comment", async (req, res) => {
  const { id, idx, password } = req.body;

  // 게시글(post)의 comments 안에 있는 특정 댓글 데이터를 찾기
  const post = await collection.findOne(
    {
      _id: ObjectId(id),
      comments: { $elemMatch: { idx: parseInt(idx), password } },
    },
    postService.projectionOption
  );

  // 데이터가 없으면 isSuccess : false를 주면서 종료
  if (!post) {
    return res.json({ isSuccess: false });
  }

  // 댓글 번호가 idx 이외인 것만 comments에 다시 할당 후 저장
  post.comments = post.comments.filter((comment) => comment.idx != idx);
  postService.updatePost(collection, id, post);
  return res.json({ isSuccess: true });
});

let collection;
app.listen(3000, async () => {
  console.log("Server started");
  const mongoClient = await mongodbConnection();
  collection = mongoClient.db().collection("post");
  console.log("MongoDB connected");
});
*/


/* 0719 17:12 백업
const express = require("express");
const { ObjectId } = require("mongodb");
const handlebars = require("express-handlebars");
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");

const port = 3000;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  handlebars.create({
    helpers: require("./configs/handlebars-helpers"),
  }).engine
);

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  res.render('login'); // login.handlebars 파일을 렌더링하여 클라이언트에게 전달합니다.
});

// 로그인 처리 라우트
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 여기에서 MongoDB를 사용하여 로그인 처리 로직을 구현합니다.
  // (예: 사용자 정보를 검색하고, 비밀번호를 확인하는 등의 작업)
  
  // 로그인 성공 시, 세션 등을 설정하고 홈 페이지로 리다이렉트합니다.
  res.redirect('/home');
});

// 홈 페이지 라우트
app.get('/home', (req, res) => {
  res.send('Welcome to the home page!');
});


app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 현재 페이지 데이터
  const search = req.query.search || ""; // 검색어 데이터
  try {
    // postService.list에서 글리스트와 페이지네이터를 가져옴
    const [posts, paginator] = await postService.list(collection, page, search);

    // 리스트 페이지 렌더링
    res.render("home", { title: "테스트 게시판", search, paginator, posts });
  } catch (error) {
    console.error(error);
    res.render("home", { title: "테스트 게시판" }); // 에러가 나는 경우는 빈값으로 렌더링
  }
});

app.get("/write", (req, res) => {
  res.render("write", { title: "테스트 게시판", mode: "create" });
});

app.post("/write", async (req, res) => {
  const post = req.body;
  const result = await postService.writePost(collection, post); // 글쓰기 후 결과 반환
  res.redirect(`/detail/${result.insertedId}`); // 생성된 도큐먼트의 _id를 사용해 상세페이지로 이동
});

app.get("/detail/:id", async (req, res) => {
  // 게시글 정보 가져오기
  const result = await postService.getDetailPost(collection, req.params.id);
  res.render("detail", {
    title: "테스트 게시판",
    post: result.value,
  });
});

app.post("/check-password", async (req, res) => {
  // id, password 값을 가져옴
  const { id, password } = req.body;

  // postService의 getPostByIdAndPassword() 함수를 사용해 게시글 데이터 확인
  const post = postService.getPostByIdAndPassword(collection, { id, password });

  // 데이터가 있으면 isExist true, 없으면 isExist false
  if (!post) {
    return res.status(404).json({ isExist: false });
  } else {
    return res.json({ isExist: true });
  }
});

// 수정 페이지로 이동 mode는 modify
app.get("/modify/:id", async (req, res) => {
  const { id } = req.params.id;
  // getPostById()  함수로 게시글 데이터를 받아옴
  const post = await postService.getPostById(collection, req.params.id);
  console.log(post);
  res.render("write", { title: "테스트 게시판 ", mode: "modify", post });
});

// 게시글 수정 API
app.post("/modify/", async (req, res) => {
  const { id, title, writer, password, content } = req.body;

  const post = {
    title,
    writer,
    password,
    content,
    createdDt: new Date().toISOString(),
  };
  // 업데이트 결과
  const result = postService.updatePost(collection, id, post);
  res.redirect(`/detail/${id}`);
});

app.delete("/delete", async (req, res) => {
  const { id, password } = req.body;
  try {
    // collection의 deleteOne을 사용해 게시글 하나를 삭제
    const result = await collection.deleteOne({
      _id: ObjectId(id),
      password: password,
    });
    // 삭제 결과가 잘 못된 경우의 처리
    if (result.deletedCount !== 1) {
      console.log("삭제 실패");
      return res.json({ isSuccess: false });
    }
    return res.json({ isSuccess: true });
  } catch (error) {
    // 에러가 난 경우의 처리
    console.error(error);
    return res.json({ isSuccess: false });
  }
});

// 댓글 추가
app.post("/write-comment", async (req, res) => {
  const { id, name, password, comment } = req.body; // body에서 데이터를 가지고 오기
  const post = await postService.getPostById(collection, id); // id로 게시글의 정보를 가져오기
  console.log(post);
  // 게시글에 기존 댓글 리스트가 있으면 추가
  if (post.comments) {
    post.comments.push({
      idx: post.comments.length + 1,
      name,
      password,
      comment,
      createdDt: new Date().toISOString(),
    });
  } else {
    // 게시글에 댓글 정보가 없으면 리스트에 댓글 정보 추가
    post.comments = [
      {
        idx: 1,
        name,
        password,
        comment,
        createdDt: new Date().toISOString(),
      },
    ];
  }

  // 업데이트하기. 업데이트 후에는 상세페이지로 다시 리다이렉트
  postService.updatePost(collection, id, post);
  return res.redirect(`/detail/${id}`);
});

// 댓글 삭제
app.delete("/delete-comment", async (req, res) => {
  const { id, idx, password } = req.body;

  // 게시글(post)의 comments 안에 있는 특정 댓글 데이터를 찾기
  const post = await collection.findOne(
    {
      _id: ObjectId(id),
      comments: { $elemMatch: { idx: parseInt(idx), password } },
    },
    postService.projectionOption
  );

  // 데이터가 없으면 isSuccess : false를 주면서 종료
  if (!post) {
    return res.json({ isSuccess: false });
  }

  // 댓글 번호가 idx 이외인 것만 comments에 다시 할당 후 저장
  post.comments = post.comments.filter((comment) => comment.idx != idx);
  postService.updatePost(collection, id, post);
  return res.json({ isSuccess: true });
});

let collection;
app.listen(3000, async () => {
  console.log("Server started");
  const mongoClient = await mongodbConnection();
  collection = mongoClient.db().collection("post");
  console.log("MongoDB connected");
});


*/


