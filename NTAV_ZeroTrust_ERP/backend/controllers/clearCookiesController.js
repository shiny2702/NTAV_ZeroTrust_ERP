const jwt = require('jsonwebtoken');

exports.clearingCookies = (req, res) => {
  try {
    // 클라이언트에서 받은 쿠키들을 확인할 필요는 없고, 그냥 삭제
    res.clearCookie('securityToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
   });

    res.clearCookie('userToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    return res.status(200).json({ message: '쿠키 삭제 완료' });
  } catch (error) {
    console.error('쿠키 삭제 실패:', error);
    return res.status(500).json({ message: '쿠키 삭제 중 오류 발생' });
  }
};
