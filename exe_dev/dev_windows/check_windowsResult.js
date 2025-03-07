const fs = require('fs');
const path = require('path');

// security_result.txt 파일 경로 설정
//const filePath = path.join(__dirname, 'uploads', 'security_result.txt');
const filePath = path.join(__dirname, 'security_result.txt');

// 보안 결과 파일을 읽어옵니다.
const readSecurityResult = () => {
    if (!fs.existsSync(filePath)) {
        console.error("Error: security_result.txt 파일을 찾을 수 없습니다.");
        return null;
    }
    return fs.readFileSync(filePath, 'utf8').split("\n"); // 줄 단위로 나눠서 배열 반환
};

// 보안 결과를 검사하고 클라이언트가 통과할 수 있는지 확인합니다.
const checkSecurityStatus = (securityResult) => {
    if (!lines) return false;

    const result = {
        antivirus: false,
        /*defenderStatus: false,
        firewallStatus: false,
        uacStatus: false,
        rdpStatus: false,
        autoLoginStatus: false*/
    };

    // 1. Antivirus Products: Windows Defender가 활성화되어 있는지 확인
    let currentSection = "";

    for (const line of lines) {
        const trimmedLine = line.trim();

        // 섹션 헤더 업데이트
        if (trimmedLine.startsWith("===")) {
            currentSection = trimmedLine;
            continue;
        }

        switch (currentSection) {
            case "=== Antivirus Products ===":
                if (trimmedLine.includes("Windows Defender")) result.antivirus = true;
                break;

            case "=== Windows Defender Status ===":
                if (trimmedLine.startsWith("DisableRealtimeMonitoring")) {
                    const value = trimmedLine.split(/\s+/).pop();
                    if (value === "False") result.defenderStatus = true;
                }
                break;

            case "=== Firewall Status ===":
                if (trimmedLine.startsWith("Domain") || trimmedLine.startsWith("Private") || trimmedLine.startsWith("Public")) {
                    if (trimmedLine.endsWith("True")) {
                        result.firewallStatus = true;
                    }
                }
                break;

            case "=== User Account Control (UAC) ===":
                if (trimmedLine.startsWith("EnableLUA")) {
                    if (trimmedLine.endsWith("1")) result.uacStatus = true;
                }
                break;

            case "=== Remote Desktop (RDP) Status ===":
                if (trimmedLine.startsWith("fDenyTSConnections")) {
                    if (trimmedLine.endsWith("1")) result.rdpStatus = true;
                }
                break;
            case "=== Auto Login Status ===":
                if (trimmedLine.startsWith("AutoAdminLogon")) {
                    if (trimmedLine.endsWith("0" || trimmedLine.endsWith(""))) result.rdpStatus = true;
                }
                break;
        }
    }
}
    return Object.values(result).every(status => status);

// 보안 결과 파일을 읽어오고 체크합니다.
const securityResult = readSecurityResult();

if (securityResult) {
    const isClientSecure = checkSecurityStatus(securityResult);
    if (isClientSecure) {
        console.log("✅ 클라이언트가 보안 요구 사항을 만족합니다.");
    } else {
        console.log("❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다.");
    }
}
