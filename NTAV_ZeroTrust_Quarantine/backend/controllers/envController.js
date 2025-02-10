require("dotenv").config();
const jwt = require("jsonwebtoken");
const { verifyDevice } = require("../PolicyModule/deviceVerify");

const SECRET_KEY = process.env.SECRET_KEY; // 환경 변수에서 불러오기

// 환경 변수 확인
if (!SECRET_KEY) {
  throw new Error("환경 변수 SECRET_KEY가 설정되지 않았습니다.");
}

// 디바이스 검증 후 토큰 발급 및 응답 반환
exports.generateDeviceToken = (req, res) => {
    try {
        // 요청 받은 데이터 전체 출력
        console.log("Received raw request body:", req.body);

        const { osInfo, browserInfo, networkInfo } = req.body;
        console.log("Received data:", { osInfo, browserInfo, networkInfo });

        if (!osInfo || !browserInfo || !networkInfo) {
            return res.status(400).json({ error: "잘못된 요청입니다. 필수 데이터가 누락되었습니다." });
        }

        verifyDevice({ osInfo, browserInfo, networkInfo }); // 검증 수행

        // 검증 성공 시 디바이스 토큰 발급
        const deviceHash = `${osInfo}-${browserInfo}-${Date.now()}`;
        const deviceToken = jwt.sign({ deviceHash }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).json({
          success: true,
          deviceToken,
          message: "디바이스 검증 성공",
        });
    } catch (error) {
      console.error("디바이스 토큰 생성 오류:", error.message); // 로그 기록
      return res.status(400).json({ success: false, error: error.message });
    }
};
