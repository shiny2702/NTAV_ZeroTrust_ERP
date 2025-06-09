const jwt = require('jsonwebtoken');

exports.clearingUserCookie = (req, res) => {  // 로그아웃 시 userToken 쿠키 삭제
  try {
    // 클라이언트에서 받은 쿠키들을 확인할 필요는 없고, 그냥 삭제
    res.clearCookie('userToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    return res.status(200).json({ message: 'userToken 쿠키 삭제 완료' });
  } catch (error) {
    console.error('userToken 쿠키 삭제 실패:', error);
    return res.status(500).json({ message: 'userToken 쿠키 삭제 중 오류 발생' });
  }
};

exports.clearingDeviceCookie = (req, res) => {  // 로그아웃 시 userToken 쿠키 삭제
  try {
    // 클라이언트에서 받은 쿠키들을 확인할 필요는 없고, 그냥 삭제
    res.clearCookie('deviceToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    return res.status(200).json({ message: 'deviceToken 쿠키 삭제 완료' });
  } catch (error) {
    console.error('deviceToken 쿠키 삭제 실패:', error);
    return res.status(500).json({ message: 'deviceToken 쿠키 삭제 중 오류 발생' });
  }
};

exports.clearingSecurityCookie = (req, res) => {  // 로그아웃 시 userToken 쿠키 삭제
  try {
    // 클라이언트에서 받은 쿠키들을 확인할 필요는 없고, 그냥 삭제
    res.clearCookie('securityToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    return res.status(200).json({ message: 'securityToken 쿠키 삭제 완료' });
  } catch (error) {
    console.error('securityToken 쿠키 삭제 실패:', error);
    return res.status(500).json({ message: 'securityToken 쿠키 삭제 중 오류 발생' });
  }
};
