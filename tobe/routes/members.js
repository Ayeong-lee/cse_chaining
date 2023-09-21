const express = require("express");
const router = express.Router();
const { Member } = require('../models/index');
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middlewares/authmiddleware");
const {Board} = require('../models');
const dayjs = require('dayjs');

// 기존 memberList 테스트 데이터를 MongoDB에 추가하는 작업
const testMembers = [
  { id: 'testid1', password: 'testpwd1', name: '홍길동', refreshToken: '', privateKey: '7fabe3a4d5b282d443fecbf52b26bd795b98f99288f348dd8cd92d36b1633729', myAccount: '0x56046E66fC6CB654Bbf2aCDEBECaad28F0c1b426'  },
  { id: 'testid2', password: 'testpwd2', name: '김철수', refreshToken: '', privateKey: '7fabe3a4d5b282d443fecbf52b26bd795b98f99288f348dd8cd92d36b1633729', myAccount: '0xd3781f83cfFd979a8C8001DbBf6FAf6B4686ee2d' },
  { id: 'testid3', password: 'testpwd3', name: '이영희', refreshToken: '' }
];

// MongoDB에 데이터 추가
Member.insertMany(testMembers)
  .then(() => {
    console.log('테스트용 계정 삽입 성공');
  })
  .catch(error => {
    console.error('Error inserting test members:', error);
  });

router.post('/sign-up', async (req, res) => {
  const { name, id, password, myAccount, privateKey } = req.body;
  const member = new Member();
  member.name = name;
  member.id = id;
  member.password = password;
  member.myAccount = myAccount;
  member.privateKey = privateKey;
  const savedMember = await member.save();
  res.json({ success:true, data: savedMember });
})

router.put('/', authMiddleware, async (req, res) => {
  const { id, password, name } = req.body;
  const memberId = req.tokenInfo.memberId;
  const member = await Member.findOne({ id: memberId });
  if (id) {
    member.id = id;
  }
  if (password) {
    member.password = password;
  }
  if (name) {
    member.name = name;
  }
  await member.save();
  res.json({ success:true });
})

router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  const memberId = id;
  const memberPassword = password

  try {
    var memberItem = await Member.findOne({ id: memberId });

    if (memberItem != null) {
      if (memberItem.password == memberPassword) {
        let accessToken = "";
        let errorMessageAT = "";

        // Access-Token
        try {
          accessToken = await new Promise((resolve, reject) => {
            jwt.sign({
                memberId : memberItem.id,
                memberName : memberItem.name
              },
              process.env.JWT_SECRET,
              {
                expiresIn : '180d'
              },
              (err, token) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(token);
                }
              });
          });
        } catch(err) {
          errorMessageAT = err;
        }
        console.log("Access-Token : " + accessToken);
        console.log("Access-Token Error : " + errorMessageAT);

        let refreshToken = "";
        let errorMessageRT = "";

        // Refresh-Token
        try {
          refreshToken = await new Promise((resolve, reject) => {
            jwt.sign({
                memberId : memberItem.id
              },
              process.env.JWT_SECRET,
              {
                expiresIn : '180d'
              },
              (err, token) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(token);
                }
              });
          });
        } catch(err) {
          errorMessageRT = err;
        }
        console.log("Refresh-Token : " + refreshToken);
        console.log("Refresh-Token Error : " + errorMessageRT);

        if (errorMessageAT == "" && errorMessageRT == "") {
          memberItem.refreshToken = refreshToken;
          await memberItem.save(); // Save the updated memberItem
          res.json({success:true, accessToken:accessToken, refreshToken:refreshToken});
        } else {
          res.status(401).json({success:false, errormessage:'token sign fail'});
        }
      } else {
        res.status(401).json({success:false, errormessage:'id and password is not identical'});
      }
    } else {
      res.status(401).json({success:false, errormessage:'id and password is not identical'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({success:false, errormessage:'Internal server error'});
  }
});

router.post('/refresh', async (req, res) => {
  const memberId = req.body.id;
  const accessToken = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  try {
    var memberItem = await Member.findOne({ id: memberId });

    if (memberItem != null) {
      let refreshPayload = "";
      let errorMessageRT = "";

      // Refresh-Token Verify
      try {
        refreshPayload = await new Promise((resolve, reject) => {
          jwt.verify(refreshToken, process.env.JWT_SECRET,
            (err, decoded) => {
              if (err) {
                reject(err);
              } else {
                resolve(decoded);
              }
            });
        });
      } catch(err) {
        errorMessageRT = err;
      }
      console.log("Refresh-Token Payload : ");
      console.log(refreshPayload);
      console.log("Refresh-Token Verify : " + errorMessageRT);

      let accessPayload = "";
      let errorMessageAT = "";

      // Access-Token Verify
      try {
        accessPayload = await new Promise((resolve, reject) => {
          jwt.verify(accessToken, process.env.JWT_SECRET, {ignoreExpiration: true},
            (err, decoded) => {
              if (err) {
                reject(err);
              } else {
                resolve(decoded);
              }
            });
        });
      } catch(err) {
        errorMessageAT = err;
      }
      console.log("Access-Token Payload : ");
      console.log(accessPayload);
      console.log("Access-Token Verify : " + errorMessageAT);

      if (errorMessageRT == "" && errorMessageAT == "") {
        if (memberId == accessPayload.memberId && memberId == refreshPayload.memberId && memberItem.refreshToken == refreshToken) {
          let accessToken = "";
          errorMessageAT = "";

          // Access-Token
          try {
            accessToken = await new Promise((resolve, reject) => {
              jwt.sign({
                  memberId : memberItem.id,
                  memberName : memberItem.name
                },
                process.env.JWT_SECRET,
                {
                  expiresIn : '180d'
                },
                (err, token) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(token);
                  }
                });
            });
          } catch(err) {
            errorMessageAT = err;
          }
          console.log("Access-Token : " + accessToken);
          console.log("Access-Token Error : " + errorMessageAT);

          if (errorMessageAT == "") {
            res.json({success:true, accessToken:accessToken});
          } else {
            res.status(401).json({success:false, errormessage:'token sign fail'});
          }
        } else {
          res.status(401).json({success:false, errormessage:'Token is not identical'});
        }
      } else if (errorMessageRT != "") {
        res.status(401).json({success:false, errormessage:'Refresh-Token has expired or invalid signature'});
      } else if (errorMessageAT != "") {
        res.status(401).json({success:false, errormessage:'Access-Token is invalid signature'});
      }
    } else {
      res.status(401).json({success:false, errormessage:'id is not identical'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({success:false, errormessage:'Internal server error'});
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.tokenInfo.memberId });

    if (!member) {
      res.status(404).json({ success: false, errormessage: 'not found' });
      return;
    }
    res.json({ success: true, data: member });

  } catch (error) {
    res.status(500).json({ success: false, errormessage: 'internal server error' });
  }
});


module.exports = router;
