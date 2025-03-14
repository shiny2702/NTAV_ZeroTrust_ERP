const { getSecurityVerification } = require("../PolicyModule/securityResultVerify");

exports.getSecurityStatus = (req, res) => {
    try {
        const securityStatus = getSecurityVerification(); // 🔹 보안 검증 결과 가져오기

        if (!securityStatus) {
            return res.status(400).json({ success: false, error: "보안 검증 결과를 가져올 수 없습니다." });
        }

        const isSecure = Object.values(securityStatus).every(status => status);

        return res.status(200).json({
            success: true,
            securityStatus,
            isSecure,
            message: isSecure ? "✅ 클라이언트가 보안 요구 사항을 만족합니다." : "❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다."
        });
    } catch (error) {
        console.error("보안 상태 확인 오류:", error.message);
        return res.status(500).json({ success: false, error: "서버 내부 오류" });
    }
};
