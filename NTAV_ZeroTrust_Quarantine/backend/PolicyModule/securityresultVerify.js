const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');

// 업로드 디렉토리 경로
const uploadsDir = path.join(__dirname, '..', 'uploads');

// 파일 경로에서 가장 최근의 security_result.txt 파일을 읽기
const getResultFilePath = () => {
    const files = fs.readdirSync(uploadsDir)
        .map(file => ({ file, time: fs.statSync(path.join(uploadsDir, file)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);
    return files.length > 0 ? path.join(uploadsDir, files[0].file) : null;
};

// security_result.txt 파일을 읽어서 보안 검사를 수행
const readSecurityResult = () => {
    const filePath = getResultFilePath();
    if (!filePath || !fs.existsSync(filePath)) {
        console.error("Error: security_result 파일을 찾을 수 없습니다.");
        return null;
    }

    // 파일을 읽어서 UTF-8로 디코딩 후 줄 단위로 분할
    const buffer = fs.readFileSync(filePath);
    const decodedData = iconv.decode(buffer, 'utf-16le');
    return decodedData.split("\n");
};

const checkSecurityStatusWindows = (lines) => {
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
        if (trimmedLine.startsWith("===")) {
            currentSection = trimmedLine;
            continue;
        }

        switch (currentSection) {
            case "=== Antivirus Products ===":
                if (/\bWindows Defender\b/.test(trimmedLine)) {
                    result.antivirus = true;
                }
                break;
            case "=== Windows Defender Status ===":
                if (/\bFalse\b/.test(trimmedLine)) {
                    result.defenderStatus = true; // 실시간 모니터링이 활성화된 상태
                } else if (/\bTrue\b/.test(trimmedLine)) {
                    result.defenderStatus = false; 
                }
                break;
            case "=== Firewall Status ===":
                if (/\bTrue\b/.test(trimmedLine)) {
                    firewallTrueCount++;
                    if (firewallTrueCount === 3) {
                        result.firewallStatus = true;
                    }
                }
                break;
            case "=== User Account Control (UAC) ===":
                if (/\b1\b/.test(trimmedLine)) {
                    result.uacStatus = true;
                }
                break;
            case "=== Remote Desktop (RDP) Status ===":
                if (/\b1\b/.test(trimmedLine)) {
                    result.rdpStatus = true;
                }
                break;
            case "=== Auto Login Status ===":
                if (/\b0\b/.test(trimmedLine)) {
                    result.autoLoginStatus = true;
                }
                break;
        }
    }
    return Object.values(result).every(status => status);
};

const checkSecurityStatusLinux = (lines) => {
    const result = {
        lsm: !lines.includes("LSM information not available."),
        apparmor_selinux: !lines.includes("AppArmor not present or inactive.") && !lines.includes("SELinux not installed or not active."),
        ufwact: lines.includes("UFW is active."),
        firewalld: lines.includes("firewalld is active.")
    };
    return Object.values(result).every(status => status);
};

// 보안 검사 수행 함수
const performSecurityCheck = () => {
    const securityResult = readSecurityResult();
    if (securityResult) {
        const osType = securityResult[0].trim();
        let isClientSecure = false;

        if (osType === "windows") {
            isClientSecure = checkSecurityStatusWindows(securityResult);
        } else if (osType === "Linux") {
            isClientSecure = checkSecurityStatusLinux(securityResult);
        } else {
            console.error("Error: 지원되지 않는 운영체제입니다.");
        }

        return isClientSecure;
    }
    return false;
};

// 파일 변경 감지 및 보안 검사 후 결과 반환하는 함수
const watchUploadsAndCheckSecurity = (callback) => {
    fs.watch(uploadsDir, (eventType, filename) => {
        if (filename && eventType === 'rename') { // 파일이 추가되거나 삭제될 때 감지
            const filePath = path.join(uploadsDir, filename);
            if (fs.existsSync(filePath)) {  // 새 파일이 추가되었을 경우
                console.log(`새로운 파일이 업로드됨: ${filename}`);
                
                // 보안 검사를 수행하고 결과를 반환
                const isSecure = performSecurityCheck();
                callback(isSecure);
            }
        }
    });
};

// 외부에서 사용할 수 있는 API 함수
const getSecurityVerification = (callback) => {
    // 파일 변경 감지를 시작하고, 결과를 콜백으로 반환
    watchUploadsAndCheckSecurity((isSecure) => {
        callback({
            isSecure,
            message: isSecure ? "✅ 클라이언트가 보안 요구 사항을 만족합니다." : "❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다."
        });
    });
};

module.exports = {
    getSecurityVerification
};



