const ALLOWED_OS = ["Windows", "MacOS", "Linux"];
const ALLOWED_BROWSERS = ["Chrome", "Edge", "Firefox", "Safari", "Brave"];
const ALLOWED_NETWORK_TYPES = ["4g", "ethernet", "wifi", "wimax", "cellular"];
const MIN_DOWNLINK = 1; // 최소 3Mbps 필요
const MAX_RTT = 300; // 최대 250ms 응답 시간
const ALLOWED_IPS = ["127.0.0.1"]; // 허용할 IP 범위나 개별 IP


// 간단한 IP 체크 함수 추가
const ipRangeCheck = require('ip-range-check');// 검증만 담당
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

    // IP 주소 검증 추가
    if (!ipRangeCheck(clientIp, ALLOWED_IPS)) {
        throw new Error(`접속 IP(${clientIp})가 허용된 범위가 아닙니다.`);
    }

    return true;
}

module.exports = { verifyDevice };