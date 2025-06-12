const jwt = require('jsonwebtoken'); 
 
// 인증이 필요 없는 public 경로 목록 (일부 경로만 포함되어도 통과)
const publicPaths = [
  '/api/auth/login',
  '/api/clearCookies/clearingUserCookie',
  '/api/clearCookies/clearingDeviceCookie',
  '/api/clearCookies/clearingSecurityCookie',
];

function authenticate(req, res, next) {
  // 요청 경로에 publicPaths 중 하나라도 포함되면 인증 생략
  if (publicPaths.some(path => req.path.includes(path))) {
    return next();
  }

  // 1. 쿠키에서 토큰 추출 
  const token = req.cookies.userToken; 
 
  if (!token) { 
    return res.status(401).json({ error: 'Unauthorized: No token provided' }); 
  } 
 
  try { 
    // 2. 토큰 검증 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // 사용자 정보 저장 
    next(); 
  } catch (err) { 
    return res.status(403).json({ error: 'Invalid or expired token' }); 
  } 
} 
 
module.exports = authenticate; 