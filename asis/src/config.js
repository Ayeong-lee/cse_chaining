module.exports = {
    'secret' : '005c9780fe7c11eb89b4e39719de58a5'
};

const express = require('express')
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.

}));