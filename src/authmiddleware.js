const jwt = require('jsonwebtoken');
const config = require('./config.js');

const authMiddleware = async (req, res, next) => {
	const accessToken = req.header('Access-Token');
	if (accessToken == null) {
		res.status(403).json({success:false, errormessage:'Authentication fail'});
	} else {
		try {
			const tokenInfo = await new Promise((resolve, reject) => {
				jwt.verify(accessToken, config.secret, 
					(err, decoded) => {
						if (err) {
							reject(err);
						} else {
							resolve(decoded);
						}
					});
			});
			req.tokenInfo = tokenInfo;
			next();
		} catch(err) {
			console.log(err);
			res.status(403).json({success:false, errormessage:'Authentication fail'});
		}
	}
}

module.exports = authMiddleware;


/* 토큰 만료 에러 처리 못하는 코드
const authMiddleware = async (req, res, next) => {
	const accessToken = req.header('Access-Token');
	if (accessToken == null) {
		res.status(403).json({success:false, errormessage:'Authentication fail'});
	} else {
		try {
			const tokenInfo = await new Promise((resolve, reject) => {
				jwt.verify(accessToken, config.secret, 
					(err, decoded) => {
						if (err) {
							reject(err);
						} else {
							resolve(decoded);
						}
					});
			});
			req.tokenInfo = tokenInfo;
			next();
		} catch(err) {
			console.log(err);
			res.status(403).json({success:false, errormessage:'Authentication fail'});
		}
	}
}
*/

/*
const authMiddleware = async (req, res, next) => {
    const accessToken = req.header('Access-Token');
    if (accessToken == null) {
        res.status(403).json({ success: false, errormessage: '인증 실패' });
    } else {
        try {
            const memberList = require('./memberapi').memberList;
            const memberItem = memberList.find((object) => object.id === refreshPayload.memberId);
            const tokenInfo = await new Promise((resolve, reject) => {
                jwt.verify(accessToken, config.secret, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            req.tokenInfo = tokenInfo;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                // 토큰이 만료된 경우, 토큰 갱신 시도
                try {
                    const refreshToken = req.header('Refresh-Token');
                    if (!refreshToken) {
                        throw new Error('리프레시 토큰이 제공되지 않았습니다.');
                    }
                    const refreshPayload = await new Promise((resolve, reject) => {
                        jwt.verify(refreshToken, config.secret, (err, decoded) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(decoded);
                            }
                        });
                    });
                    // 가정: memberList는 해당 파일에서 접근 가능하도록 되어 있어야 함
                    const memberItem = memberList.find((object) => object.id === refreshPayload.memberId);
                    if (!memberItem) {
                        throw new Error('잘못된 사용자입니다.');
                    }
                    // 새로운 액세스 토큰 생성
                    const newAccessToken = jwt.sign(
                        {
                            memberId: memberItem.id,
                            memberName: memberItem.name,
                        },
                        config.secret,
                        {
                            expiresIn: '10m',
                        }
                    );
                    req.tokenInfo = { ...refreshPayload, ...memberItem }; // 토큰 정보 업데이트
                    res.set('Access-Token', newAccessToken); // 응답 헤더에 새로운 액세스 토큰 전송
                    next();
                } catch (refreshErr) {
                    res.status(401).json({ success: false, errormessage: '토큰이 만료되었으며 갱신에 실패했습니다.' });
                }
            } else {
                res.status(403).json({ success: false, errormessage: '인증 실패' });
            }
        }
    }
};
*/