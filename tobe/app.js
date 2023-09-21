const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // .env 파일에서 환경 변수 로드

const app = express()
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));

const boardsRouter = require('./routes/boards');
const membersRouter = require('./routes/members');
const uploadRouter = require('./routes/upload');
const blockchainRouter = require('./routes/blockchain');
const transactionRouter = require('./routes/transaction');


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB 연결 성공..."))
  .catch((err) => console.log(err));


app.use('/boards', boardsRouter);
app.use('/members', membersRouter);
app.use('/upload', uploadRouter);
app.use('/blockchain', blockchainRouter);
app.use('/transactions', transactionRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
