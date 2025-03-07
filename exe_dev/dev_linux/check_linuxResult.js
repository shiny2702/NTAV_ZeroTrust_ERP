const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');

// security_result.txt 파일 경로 설정
//const filePath = path.join(__dirname, 'uploads', 'security_result.txt');
const filePath = path.join(__dirname, 'security_result.txt');

const readSecurityResult = () => {
    if (!fs.existsSync(filePath)) {
        console.error("Error: security_result.txt 파일을 찾을 수 없습니다.");
        return null;
    }

    // 파일을 읽어서 버퍼로 반환
    const buffer = fs.readFileSync(filePath);

    // iconv-lite로 utf-8로 디코딩
    const decodedData = iconv.decode(buffer, 'utf-8');  // 파일을 UTF-8로 변환

    // 줄 단위로 나누어서 배열 반환
    return decodedData.split("\n");
};

// 보안 결과를 검사하고 클라이언트가 통과할 수 있는지 확인합니다.
const checkSecurityStatus = (lines) => {
    console.log(lines);
    if (!lines) return false;

    const result = {
        lsm: false,
        apparmor_selinux: false,
        ufwact: false,
        firewalld: false
    };

    // 1. LSM (Linux Security Module) 활성화 확인
    if (!lines.includes("LSM information not available.")) {
        result.lsm = true;
    }

    // 2. AppArmor 또는 SELinux 활성화 확인
    if (!lines.includes("AppArmor not present or inactive.") && !lines.includes("SELinux not installed or not active.")) {
        result.apparmor_selinux = true;
    }

    // 3. UFW (Uncomplicated Firewall) 상태 확인
    if (lines.includes("UFW is active.")) {
        result.ufwact = true;
    }

    // 4. firewalld 상태 확인
    if (lines.includes("firewalld is active.")) {
        result.firewalld = true;
    }

    // 모든 보안 요구 사항이 충족되는지 확인
    const isSecure = Object.values(result).every(status => status);

    return isSecure;
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
