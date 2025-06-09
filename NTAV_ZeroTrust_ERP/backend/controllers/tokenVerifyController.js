const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('SECRET_KEY_ERP is not set!');
}
if (!process.env.SECRET_KEY_QUARANTINE) {
  throw new Error('SECRET_KEY_QUARANTINE is not set!');
}

const SECRET_KEY_ERP = process.env.JWT_SECRET;
const SECRET_KEY_QUARANTINE = process.env.SECRET_KEY_QUARANTINE;

exports.verifyTokens = (req, res) => {
  const { deviceToken, securityToken, userToken } = req.cookies;

  const results = {
    deviceToken: null,
    securityToken: null,
    userToken: null
  };

  // 쿠키 존재 여부 확인
  if (!deviceToken) results.deviceToken = 'missing';
  if (!securityToken) results.securityToken = 'missing';
  if (!userToken) results.userToken = 'missing';

  // 존재하는 경우만 유효성 검사
  if (deviceToken) {
    try {
      jwt.verify(deviceToken, SECRET_KEY_QUARANTINE);
      results.deviceToken = 'valid';
    } catch (err) {
      results.deviceToken =
        err.name === 'TokenExpiredError' ? 'expired' :
        err.name === 'JsonWebTokenError' ? 'invalid' :
        'error';
    }
  }

  if (securityToken) {
    try {
      jwt.verify(securityToken, SECRET_KEY_QUARANTINE);
      results.securityToken = 'valid';
    } catch (err) {
      results.securityToken =
        err.name === 'TokenExpiredError' ? 'expired' :
        err.name === 'JsonWebTokenError' ? 'invalid' :
        'error';
    }
  }

  if (userToken) {
    try {
      jwt.verify(userToken, SECRET_KEY_ERP);
      results.userToken = 'valid';
    } catch (err) {
      results.userToken =
        err.name === 'TokenExpiredError' ? 'expired' :
        err.name === 'JsonWebTokenError' ? 'invalid' :
        'error';
    }
  }

  // 유효성 결과 정리
  const allValid = Object.values(results).every(status => status === 'valid');

  if (allValid) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(401).json({ valid: false, reasons: results });
  }
};

