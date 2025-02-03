const jwt = require("jsonwebtoken");

const ALLOWED_OS = ["Windows", "MacOS", "Linux"];
const ALLOWED_BROWSERS = ["Chrome", "Edge", "Firefox", "Safari", "Brave"];
const ALLOWED_NETWORK_TYPES = ["ethernet", "wifi", "wimax", "cellular"];
const MIN_DOWNLINK = 3; // 최소 3Mbps 필요
const MAX_RTT = 250; // 최대 250ms 응답 시간

//디바이스 정보 검증 후 deviceToken 발급
function verifyDevice(deviceInfo) {
    const { osInfo, browserInfo, networkInfo } = deviceInfo;
    const { isOnline, networkType, downlink, rtt, saveData } = networkInfo;

    // OS 검증
    if (!ALLOWED_OS.includes(osInfo)) {
        throw new Error("허용되지 않은 OS입니다.");
    }

    // 브라우저 검증
    if (!ALLOWED_BROWSERS.includes(browserInfo)) {
        throw new Error("허용되지 않은 브라우저입니다.");
    }

    // 네트워크 상태 검증
    if (!isOnline) {
        throw new Error("네트워크 연결이 끊어져 있습니다.");
    }
    if (!ALLOWED_NETWORK_TYPES.includes(networkType.toLowerCase())) {
        throw new Error(`허용되지 않은 네트워크 유형입니다: ${networkType}`);
    }
    if (downlink < MIN_DOWNLINK) {
        throw new Error(`네트워크 속도가 너무 느립니다. 최소 ${MIN_DOWNLINK} Mbps 필요.`);
    }
    if (rtt > MAX_RTT) {
        throw new Error(`네트워크 응답 시간이 너무 깁니다. 최대 ${MAX_RTT}ms 필요.`);
    }
    if (saveData) {
        throw new Error("데이터 절약 모드가 활성화되어 보안에 취약할 수 있습니다.");
    }

    // 디바이스 토큰 발급
    const deviceHash = `${osInfo}-${browserInfo}-${Date.now()}`;
    const deviceToken = jwt.sign({ deviceHash }, SECRET_KEY, { expiresIn: "7d" });

    return deviceToken;
}

module.exports = { verifyDevice };