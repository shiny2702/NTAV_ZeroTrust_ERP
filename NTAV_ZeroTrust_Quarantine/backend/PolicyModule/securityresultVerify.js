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

    console.log("📁 업로드된 파일 목록 (최신순):", files.map(f => f.file));
    return files.length > 0 ? path.join(uploadsDir, files[0].file) : null;
};

const readSecurityResult = () => {
    const filePath = getResultFilePath();
    if (!filePath || !fs.existsSync(filePath)) {
        console.error("Error: security_result 파일을 찾을 수 없습니다.");
        return null;
    }

    // 파일을 읽어서 UTF-8로 디코딩 후 줄 단위로 분할 (줄바꿈과 \r 모두 안전 처리)
    const buffer = fs.readFileSync(filePath);
    const decodedData = iconv.decode(buffer, 'utf-16le');

    // 방법 1: 정규식으로 \r\n 또는 \n 모두 안전하게 분리
    const lines = decodedData.split(/\r?\n/);

    console.log("📄 보안 결과 파일 경로:", filePath);
    console.log("📋 전체 줄:", lines);

    // 디버깅용 로그
    console.log("전체 줄 출력:", lines);
    console.log("OS 타입 원본:", JSON.stringify(lines[0]));

    return lines;
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

    console.log("🛡️ Windows 보안 상태 분석 결과:", result);
    return Object.values(result).every(status => status);
};

const checkSecurityStatusLinux = (lines) => {
    const result = {
        lsm: !lines.includes("LSM information not available."),
        apparmor_selinux: !lines.includes("AppArmor not present or inactive.") && !lines.includes("SELinux not installed or not active."),
        ufwact: lines.includes("UFW is active."),
        firewalld: lines.includes("firewalld is active.")
    };

    console.log("🛡️ Linux 보안 상태 분석 결과:", result);
    return Object.values(result).every(status => status);
};

// 보안 검사 수행 함수
const performSecurityCheck = () => {
    const securityResult = readSecurityResult();
    if (securityResult) {
        const osTypeLine = securityResult.find(line => line.trim() !== "");
        const osType = osTypeLine ? osTypeLine.trim() : "";
        console.log("OS 타입 원본:", osType);
        let isClientSecure = false;

        if (osType =="Windows") {
            isClientSecure = checkSecurityStatusWindows(securityResult);
        } else if (osType === "Linux") {
            isClientSecure = checkSecurityStatusLinux(securityResult);
        } else {
            console.error("Error: 지원되지 않는 운영체제입니다.");
        }

        console.log("🔐 클라이언트 보안 점검 최종 결과:", isClientSecure);
        return isClientSecure;
    }
    return false;
};

// 파일 변경 감지 및 보안 검사 후 결과 반환하는 함수
const watchUploadsAndCheckSecurity = (callback) => {
    console.log("👀 파일 시스템 감시 시작됨: uploads/");
    fs.watch(uploadsDir, (eventType, filename) => {
        console.log(`🔍 이벤트 감지됨: ${eventType} → ${filename}`);

        if (filename && eventType === 'rename') { // 파일이 추가되거나 삭제될 때 감지
            const filePath = path.join(uploadsDir, filename);
            if (fs.existsSync(filePath)) {  // 새 파일이 추가되었을 경우
                console.log(`새로운 파일이 업로드됨: ${filename}`);
                
                setTimeout(() => {
                    const isSecure = performSecurityCheck();
                    console.log(`🔎 보안 검사 결과 (${filename}):`, isSecure);
                    callback(isSecure);
                }, 200); // 200ms 기다림
                // 보안 검사를 수행하고 결과를 반환
            }
        }
    });
};

// 외부에서 사용할 수 있는 API 함수
const getSecurityVerification = (callback) => {
    // 파일 변경 감지를 시작하고, 결과를 콜백으로 반환
    //console.log("callback type: ", typeof callback); //에러체크용

    console.log("📡 보안검증 함수 진입");  // 함수 진입 확인

    watchUploadsAndCheckSecurity((isSecure) => {
        const result = {
            isSecure,
            message: isSecure
                ? "✅ 클라이언트가 보안 요구 사항을 만족합니다."
                : "❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다."
        };

        console.log("📬 콜백으로 반환될 보안 결과:", result);
        callback(result);
    });
};

module.exports = {
    getSecurityVerification
};


// security_result.txt 파일을 읽어서 보안 검사를 수행
/*const readSecurityResult = () => {
    const filePath = getResultFilePath();
    if (!filePath || !fs.existsSync(filePath)) {
        console.error("Error: security_result 파일을 찾을 수 없습니다.");
        return null;
    }

    // 파일을 읽어서 UTF-8로 디코딩 후 줄 단위로 분할
    const buffer = fs.readFileSync(filePath);
    const decodedData = iconv.decode(buffer, 'utf-8');
    return decodedData.split("\n");
};*/
