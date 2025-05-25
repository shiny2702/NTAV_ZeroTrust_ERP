/*const { getSecurityVerification } = require("../PolicyModule/securityresultVerify");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("환경 변수 SECRET_KEY가 설정되지 않았습니다.");
}

exports.getSecurityStatus = (req, res) => {
    try {
        getSecurityVerification((securityStatus) => { // 🔹 콜백 함수 사용
            if (!securityStatus) {
                return res.status(400).json({ success: false, error: "보안 검증 결과를 가져올 수 없습니다." });
            }

            const isSecure = Object.values(securityStatus).every(status => status);

            // 보안 검증 토큰 생성
            const securityToken = jwt.sign(
                { 
                    isSecure, 
                    timestamp: Date.now()
                }, 
                SECRET_KEY, 
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                success: true,
                securityToken,
                message: isSecure ? "✅ 클라이언트가 보안 요구 사항을 만족합니다." : "❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다."
            });
        });

    } catch (error) {
        console.error("보안 상태 확인 오류:", error.message);
        return res.status(500).json({ success: false, error: "서버 내부 오류" });
    }
};*/

const { getSecurityVerification } = require("../PolicyModule/securityresultVerify");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("환경 변수 SECRET_KEY가 설정되지 않았습니다.");
}

exports.getSecurityStatus = (req, res) => {
  try {
    // 🔐 쿠키에서 디바이스 토큰 읽기
    const deviceToken = req.cookies.deviceToken;
    if (!deviceToken) {
      return res.status(401).json({ success: false, error: "디바이스 토큰이 없습니다." });
    }

    let deviceInfo;
    try {
      deviceInfo = jwt.verify(deviceToken, SECRET_KEY);
    } catch (err) {
      return res.status(403).json({ success: false, error: "디바이스 토큰이 유효하지 않습니다." });
    }

    getSecurityVerification((securityStatus) => {
      if (!securityStatus) {
        return res.status(400).json({ success: false, error: "보안 검증 결과를 가져올 수 없습니다." });
      }

      const isSecure = Object.values(securityStatus).every(status => status);

      const securityToken = jwt.sign(
        {
          isSecure,
          deviceHash: deviceInfo.deviceHash, // 🔗 디바이스 토큰 내용 포함
          timestamp: Date.now()
        },
        SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        securityToken,
        message: isSecure
          ? "✅ 클라이언트가 보안 요구 사항을 만족합니다."
          : "❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다."
      });
    });
  } catch (error) {
    console.error("보안 상태 확인 오류:", error.message);
    return res.status(500).json({ success: false, error: "서버 내부 오류" });
  }
};

