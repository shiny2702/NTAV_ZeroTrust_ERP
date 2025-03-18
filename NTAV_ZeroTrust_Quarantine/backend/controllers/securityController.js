const { getSecurityVerification } = require("../PolicyModule/securityresultVerify");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("환경 변수 SECRET_KEY가 설정되지 않았습니다.");
}

exports.getSecurityStatus = (req, res) => {
    try {
        const securityStatus = getSecurityVerification(); // 🔹 보안 검증 결과 가져오기

        if (!securityStatus) {
            return res.status(400).json({ success: false, error: "보안 검증 결과를 가져올 수 없습니다." });
        }

        const isSecure = Object.values(securityStatus).every(status => status);

        // 보안 검증 성공 시 쿠키 및 토큰 설정
        /*if (isSecure) {
            res.cookie("securityDone", "true", {
                httpOnly: false, // 클라이언트에서 접근 가능 (보안 고려 필요)
                secure: true, // HTTPS에서만 전송되도록 설정
                sameSite: "Strict", // CSRF 방지
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7일간 유지
            });
        }*/

        // 보안 검증 토큰 생성
        const securityToken = jwt.sign(
          { 
            isSecure, 
            timestamp: Date.now(), 
            clientId: req.ip // 또는 유저 세션 ID 등
          }, 
          SECRET_KEY, 
          { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            securityStatus,
            isSecure,
            securityToken,
            message: isSecure ? "✅ 클라이언트가 보안 요구 사항을 만족합니다." : "❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다."
        });
    } catch (error) {
        console.error("보안 상태 확인 오류:", error.message);
        return res.status(500).json({ success: false, error: "서버 내부 오류" });
    }
};
