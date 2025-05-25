/*require("dotenv").config();
const jwt = require("jsonwebtoken");
const { verifyDevice } = require("../PolicyModule/deviceVerify");

const SECRET_KEY = process.env.SECRET_KEY; // 환경 변수에서 불러오기

// 환경 변수 확인
if (!SECRET_KEY) {
  throw new Error("환경 변수 SECRET_KEY가 설정되지 않았습니다.");
}

// 디바이스 검증 후 토큰 발급 및 쿠키 설정
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

        // 쿠키 설정 (HttpOnly는 필요에 따라 변경)
        /*res.cookie("deviceDone", "true", {
            httpOnly: false, // 클라이언트에서도 접근 가능하게 설정 (보안 고려 필요)
            secure: true, // HTTPS에서만 전송되도록 설정
            sameSite: "Strict", // CSRF 방지
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7일간 유지
        });*/
/*
        return res.status(200).json({
          success: true,
          deviceToken,
          message: "디바이스 검증 성공",
        });
    } catch (error) {
      console.error("디바이스 토큰 생성 오류:", error.message); // 로그 기록
      return res.status(400).json({ success: false, error: error.message });
    }
};*/

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { verifyDevice } = require("../PolicyModule/deviceVerify");

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("환경 변수 SECRET_KEY가 설정되지 않았습니다.");
}

exports.generateDeviceToken = (req, res) => {
  try {
    const { osInfo, browserInfo, networkInfo } = req.body;

    if (!osInfo || !browserInfo || !networkInfo) {
      return res.status(400).json({ error: "필수 데이터가 누락되었습니다." });
    }

    verifyDevice({ osInfo, browserInfo, networkInfo });

    const deviceHash = `${osInfo}-${browserInfo}-${Date.now()}`;
    const deviceToken = jwt.sign({ deviceHash }, SECRET_KEY, { expiresIn: "7d" });

    // 디바이스 토큰을 HttpOnly 쿠키로 설정
    res.cookie("deviceToken", deviceToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "디바이스 검증 성공 및 토큰 저장 완료"
    });

  } catch (error) {
    console.error("디바이스 토큰 생성 오류:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};
