const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('SECRET_KEY_ERP is not set!');
}

if (!process.env.SECRET_KEY_QUARANTINE) {
  throw new Error('SECRET_KEY_QUARANTINE is not set!');
}

const SECRET_KEY_ERP = process.env.JWT_SECRET;
const SECRET_KEY_QUARANTINE = process.env.SECRET_KEY_QUARANTINE;

// 토큰 검증 (컨트롤러 형태)
exports.verifyTokens = (req, res) => {
  const { securityToken, userToken } = req.cookies;

  if (!securityToken || !userToken) {
    return res.status(403).json({ error: 'Tokens missing' });
  }

  try {
    const decodedSecurity = jwt.verify(securityToken, SECRET_KEY_QUARANTINE);
    console.log("🔓 Security 토큰 검증 완료:", decodedSecurity);

    const decodedUser = jwt.verify(userToken, SECRET_KEY_ERP);
    console.log("🔓 User 토큰 검증 완료:", decodedUser);

    return res.status(200).json({ valid: true });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    } else {
      return res.status(500).json({ error: 'Token verification failed', detail: err.message });
    }
  }
};
