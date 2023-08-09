const express  = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./config.js'); 
const bodyParser = require('body-parser');
router.use(bodyParser.json());

let memberList = [
    {id:"testid1", password:"testpwd1", name:"홍길동", refreshToken:""},
    {id:"testid2", password:"testpwd2", name:"김철수", refreshToken:""},
    {id:"testid3", password:"testpwd3", name:"이영희", refreshToken:""}];

    module.exports = { router, memberList };    

router.post('/login', async function(req, res, next) {
	console.log("REST API Post Method - Member Login And JWT Sign");
	const memberId = req.body.id;
	const memberPassword = req.body.password;
	var memberItem = memberList.find(object => object.id == memberId);
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
						config.secret,
						{
							expiresIn : '10m'
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
			} catch(err) {
				errorMessageRT = err;
			}
			console.log("Refresh-Token : " + refreshToken);
			console.log("Refresh-Token Error : " + errorMessageRT);
			
			if (errorMessageAT == "" && errorMessageRT == "") {
				memberItem.refreshToken = refreshToken;
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
});

router.post('/refresh', async function (req, res, next) {
    console.log("REST API Post Method - Member JWT Refresh");
    const memberId = req.body.id;
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;
    var memberItem = memberList.find(object => object.id == memberId);
    if (memberItem != null) {
        try {
            // Refresh-Token Verify
            const refreshPayload = await new Promise((resolve, reject) => {
                jwt.verify(refreshToken, config.secret,
                    (err, decoded) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(decoded);
                        }
                    });
            });

            console.log("Refresh-Token Payload : ");
            console.log(refreshPayload);

            const accessPayload = await new Promise((resolve, reject) => {
                jwt.verify(accessToken, config.secret,
                    { ignoreExpiration: true },
                    (err, decoded) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(decoded);
                        }
                    });
            });

            console.log("Access-Token Payload : ");
            console.log(accessPayload);

            if (memberId == accessPayload.memberId && memberId == refreshPayload.memberId && memberItem.refreshToken == refreshToken) {
                let newAccessToken = "";

                // Access-Token
                try {
                    newAccessToken = await new Promise((resolve, reject) => {
                        jwt.sign({
                            memberId: memberItem.id,
                            memberName: memberItem.name
                        },
                            config.secret,
                            {
                                expiresIn: '10m'
                            },
                            (err, token) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(token);
                                }
                            });
                    });

                    console.log("Access-Token : " + newAccessToken);

                    res.json({ success: true, accessToken: newAccessToken });
                } catch (err) {
                    console.log("Access-Token Error : " + err);
                    res.status(401).json({ success: false, errormessage: 'token sign fail' });
                }
            } else {
                res.status(401).json({ success: false, errormessage: 'Token is not identical' });
            }
        } catch (err) {
            console.log("Refresh-Token Error : " + err);
            res.status(401).json({ success: false, errormessage: 'Refresh-Token has expired or invalid signature' });
        }
    } else {
        res.status(401).json({ success: false, errormessage: 'id is not identical' });
    }
});





module.exports = router;