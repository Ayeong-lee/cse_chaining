const express  = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./config.js');

let memberList = [
    {id:"testid1", password:"testpwd1", name:"홍길동"},
    {id:"testid2", password:"testpwd2", name:"김철수"},
    {id:"testid3", password:"testpwd3", name:"이영희"}];



router.post('/login', async function(req, res, next) {
    console.log("REST API Post Method - Member Login And JWT Sign");
    const memberId = req.body.id;
    const memberPassword = req.body.password;
    var memberItem = memberList.find(object => object.id == memberId);
    if (memberItem != null) {
        if (memberItem.password == memberPassword) {
            
            try {
                const accessToken = await new Promise((resolve, reject) => {
                    jwt.sign({
                            memberId : memberItem.id,
                            memberName : memberItem.name
                        },
                        config.secret,
                        {
                            expiresIn : '1d'
                        },
                        (err, token) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(token);
                            }
                        });
                });
                res.json({success:true, accessToken:accessToken});
            } catch(err) {
                console.log(err);
                res.status(401).json({success:false, errormessage:'token sign fail'});
            }
        } else {
            res.status(401).json({success:false, errormessage:'id and password are not identical'});
        }
    } else {
        res.status(401).json({success:false, errormessage:'id and password are not identical'});
    }
});

// GET 요청을 처리하는 핸들러 추가
router.get('/login', function (req, res, next) {
    res.status(405).json({ success: false, errormessage: 'Only POST requests are allowed for /members/login' });
});

// GET 요청을 처리하는 핸들러 추가
router.get('/', function (req, res, next) {
    res.json(memberList);
});

module.exports = router;

