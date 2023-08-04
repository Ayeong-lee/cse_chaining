const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/', (req, res) => {
    res.send('Hello Node.js!');
});

app.listen(port, () => {
    console.log('Listening...');
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
});

app.use('/boards', require('./boardapi'));
app.listen(9000, () => {
    console.log('Listening...');
});
