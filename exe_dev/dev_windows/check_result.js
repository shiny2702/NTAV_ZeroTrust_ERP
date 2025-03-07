const fs = require('fs');
const path = require('path');

// security_result.txt 파일 경로 설정
const filePath = path.join(__dirname, 'uploads', 'security_result.txt');

// 보안 결과 파일을 읽어옵니다.
const readSecurityResult = () => {
    if (!fs.existsSync(filePath)) {
        console.error("Error: security_result.txt 파일을 찾을 수 없습니다.");
        return null;
    }
    return fs.readFileSync(filePath, 'utf8');
};

// 보안 결과를 검사하고 클라이언트가 통과할 수 있는지 확인합니다.
const checkSecurityStatus = (securityResult) => {
    if (!securityResult) return false;

    const result = {
        antivirus: false,
        defenderStatus: false,
        firewallStatus: false,
        uacStatus: false,
        rdpStatus: false,
        updateStatus: false,
        autoLoginStatus: false
    };

    // 1. Antivirus Products: Windows Defender가 활성화되어 있는지 확인
    if (securityResult.includes("Windows Defender")) {
        result.antivirus = true;
    }

    // 2. Windows Defender Status: 실시간 모니터링이 비활성화되지 않아야 함
    if (securityResult.includes("DisableRealtimeMonitoring") && !securityResult.includes("True")) {
        result.defenderStatus = true;
    }

    // 3. Firewall Status: 모든 프로파일에서 방화벽이 활성화되어야 함
    if (securityResult.includes("Domain     True") && securityResult.includes("Private    True") && securityResult.includes("Public     True")) {
        result.firewallStatus = true;
    }

    // 4. User Account Control (UAC): UAC가 활성화되어야 함
    if (securityResult.includes("EnableLUA") && securityResult.includes("1")) {
        result.uacStatus = true;
    }

    // 5. Remote Desktop (RDP) Status: 원격 데스크탑이 비활성화되어야 함
    if (securityResult.includes("fDenyTSConnections") && securityResult.includes("1")) {
        result.rdpStatus = true;
    }

    // 6. Windows Update Status: 부팅 시간이 존재하면 업데이트된 것으로 간주
    if (securityResult.includes("LastBootUpTime")) {
        result.updateStatus = true;
    }

    // 7. Auto Login Status: 자동 로그인이 비활성화되어야 함
    if (securityResult.includes("AutoAdminLogon") && securityResult.includes("0")) {
        result.autoLoginStatus = true;
    }

    // 모든 보안 요구 사항이 충족되는지 확인
    const isSecure = Object.values(result).every(status => status);

    return isSecure;
};

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
