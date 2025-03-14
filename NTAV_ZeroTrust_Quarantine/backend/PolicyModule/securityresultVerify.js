const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');

// uploads 디렉토리에서 가장 최근 파일 찾기
const uploadsDir = path.join(__dirname, '..', 'uploads');
const getResultFilePath = () => {
    const files = fs.readdirSync(uploadsDir)
        .map(file => ({ file, time: fs.statSync(path.join(uploadsDir, file)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);
    return files.length > 0 ? path.join(uploadsDir, files[0].file) : null;
};

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
                    //console.log("Antivirus status changed: ", result.antivirus);
                }
                break;
            case "=== Windows Defender Status ===":
                if (/\bFalse\b/.test(trimmedLine)) {
                    result.defenderStatus = true; // 실시간 모니터링이 활성화된 상태태
                    //console.log("Defender status changed: ", result.defenderStatus);
                } else if (/\bTrue\b/.test(trimmedLine)) {
                    result.defenderStatus = false; 
                    //console.log("Defender status changed: ", result.defenderStatus);
                }
                break;
            case "=== Firewall Status ===":
                if (/\bTrue\b/.test(trimmedLine)) {
                    firewallTrueCount++;
                    //console.log("Firewall True count: ", firewallTrueCount);
                    if (firewallTrueCount === 3) {
                        result.firewallStatus = true;
                        //console.log("Firewall status changed: ", result.firewallStatus);
                    }
                }
                break;
            case "=== User Account Control (UAC) ===":
                if (/\b1\b/.test(trimmedLine)) {
                    result.uacStatus = true;
                    //console.log("UAC status changed: ", result.uacStatus);
                }
                break;
            case "=== Remote Desktop (RDP) Status ===":
                if (/\b1\b/.test(trimmedLine)) {
                    result.rdpStatus = true;
                    //console.log("RDP status changed: ", result.rdpStatus);
                }
                break;
            case "=== Auto Login Status ===":
                if (/\b0\b/.test(trimmedLine)) {
                    result.autoLoginStatus = true;
                    //console.log("Auto Login status changed: ", result.autoLoginStatus);
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

const securityResult = readSecurityResult();
if (securityResult) {
    const osType = securityResult[0].trim();
    let isClientSecure = false;
    
    if (osType === "Windows") {
        isClientSecure = checkSecurityStatusWindows(securityResult);
    } else if (osType === "Linux") {
        isClientSecure = checkSecurityStatusLinux(securityResult);
    } else {
        console.error("Error: 지원되지 않는 운영체제입니다.");
    }

    if (isClientSecure) {
        console.log("✅ 클라이언트가 보안 요구 사항을 만족합니다.");
    } else {
        console.log("❌ 클라이언트는 보안 요구 사항을 만족하지 않습니다.");
    }
}
