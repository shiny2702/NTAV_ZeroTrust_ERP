const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');

// security_result.txt 파일 경로 설정
//const filePath = path.join(__dirname, 'uploads', 'security_result.txt');
const filePath = path.join(__dirname, 'security_result.txt');

// 보안 결과 파일을 읽어옵니다.
/*const readSecurityResult = () => {
    if (!fs.existsSync(filePath)) {
        console.error("Error: security_result.txt 파일을 찾을 수 없습니다.");
        return null;
    }
    return fs.readFileSync(filePath, 'utf8').split("\n"); // 줄 단위로 나눠서 배열 반환
};*/
const readSecurityResult = () => {
    if (!fs.existsSync(filePath)) {
        console.error("Error: security_result.txt 파일을 찾을 수 없습니다.");
        return null;
    }

    // 파일을 읽어서 버퍼로 반환
    const buffer = fs.readFileSync(filePath);

    // iconv-lite로 utf-8로 디코딩
    const decodedData = iconv.decode(buffer, 'utf-16');  // 파일을 UTF-8로 변환

    // 줄 단위로 나누어서 배열 반환
    return decodedData.split("\n");
};

// 보안 결과를 검사하고 클라이언트가 통과할 수 있는지 확인합니다.
const checkSecurityStatus = (lines) => {
    console.log(lines);
    if (!lines) return false;

    const result = {
        antivirus: false,
        defenderStatus: false,
        firewallStatus: false,
        uacStatus: false,
        rdpStatus: false,
        autoLoginStatus: false
    };

    let firewallTrueCount = 0;

    let currentSection = "";

    for (const line of lines) {
        const trimmedLine = line.trim();

        // 섹션 헤더 업데이트
        if (trimmedLine.startsWith("===")) {
            currentSection = trimmedLine;
            continue;
        }

        // 1. Antivirus Products: Windows Defender가 활성화되어 있는지 확인
        switch (currentSection) {
            case "=== Antivirus Products ===":
                // console.log("Trimmed Line: ", trimmedLine);
                if (/\bWindows Defender\b/.test(trimmedLine)) {
                    result.antivirus = true;
                    console.log("Antivirus status changed: ", result.antivirus);
                }
                break;

            case "=== Windows Defender Status ===":
                // console.log("Trimmed Line: ", trimmedLine);
                if (/\bFalse\b/.test(trimmedLine)) {
                    result.defenderStatus = true; // 실시간 모니터링이 활성화된 상태태
                    console.log("Defender status changed: ", result.defenderStatus);
                } else if (/\bTrue\b/.test(trimmedLine)) {
                    result.defenderStatus = false; 
                    console.log("Defender status changed: ", result.defenderStatus);
                }
                break;

            case "=== Firewall Status ===":
                // console.log("Trimmed Line: ", trimmedLine);
                if (/\bTrue\b/.test(trimmedLine)) {
                    firewallTrueCount++;
                    console.log("Firewall True count: ", firewallTrueCount);
                    if (firewallTrueCount === 3) {
                        result.firewallStatus = true;
                        console.log("Firewall status changed: ", result.firewallStatus);
                    }
                }
                break;

            case "=== User Account Control (UAC) ===":
                // console.log("Trimmed Line: ", trimmedLine);
                if (/\b1\b/.test(trimmedLine)) {
                    result.uacStatus = true;
                    console.log("UAC status changed: ", result.uacStatus);
                }
                break;

            case "=== Remote Desktop (RDP) Status ===":
                // console.log("Trimmed Line: ", trimmedLine);
                if (/\b1\b/.test(trimmedLine)) {
                    result.rdpStatus = true;
                    console.log("RDP status changed: ", result.rdpStatus);
                }
                break;
            case "=== Auto Login Status ===":
                // console.log("Trimmed Line: ", trimmedLine);
                if (/\b0\b/.test(trimmedLine)) {
                    result.autoLoginStatus = true;
                    console.log("Auto Login status changed: ", result.autoLoginStatus);
                } 
                break;
        }
    }
    return Object.values(result).every(status => status);
}

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
