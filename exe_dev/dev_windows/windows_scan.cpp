/*#include <iostream>
#include <cstdlib>

using namespace std;

// OS별 보안 검사 함수 (Windows 전용)
void check_security() {
    cout << "Running Windows-specific security checks..." << endl;

    // Antivirus Products
    system("powershell -Command \"'=== Antivirus Products ===' | Out-File security_result.txt\"");
    system("powershell -Command \"Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct | Select-Object displayName, pathToSignedProductExe | Out-File security_result.txt -Append\"");

    // Windows Defender Status
    system("powershell -Command \"'=== Windows Defender Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-MpPreference | Select-Object -Property DisableRealtimeMonitoring | Out-File security_result.txt -Append\"");

    // Firewall Status
    system("powershell -Command \"'=== Firewall Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-NetFirewallProfile | Select-Object Name, Enabled | Out-File security_result.txt -Append\"");

    // User Account Control (UAC)
    system("powershell -Command \"'=== User Account Control (UAC) ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' -Name EnableLUA | Select-Object EnableLUA | Out-File security_result.txt -Append\"");

    // Remote Desktop (RDP) Status
    system("powershell -Command \"'=== Remote Desktop (RDP) Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name fDenyTSConnections | Select-Object fDenyTSConnections | Out-File security_result.txt -Append\"");

    // Windows Update Status
    system("powershell -Command \"'=== Windows Update Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-WmiObject -Class Win32_OperatingSystem | Select-Object LastBootUpTime | Out-File security_result.txt -Append\"");

    // Auto Login Status
    system("powershell -Command \"'=== Auto Login Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon' -Name AutoAdminLogon | Select-Object AutoAdminLogon | Out-File security_result.txt -Append\"");

    cout << "Security detection completed. Results saved in security_result.txt." << endl;
}

int main() {
    cout << "Running security check for Windows system" << endl;
    check_security();
    cout << "All tasks completed successfully!" << endl;
    return 0;
}*/

#include <iostream>
#include <fstream>
#include <windows.h>
#include <wininet.h>
#include <cstdlib>
#include <sstream>

#pragma comment(lib, "wininet.lib")

// OS별 보안 검사 함수 (Windows 전용)
void check_security() {
    std::cout << "Running Windows-specific security checks..." << std::endl;
    system("echo 'Windows' > security_result.txt; ");

    // Antivirus Products
    system("powershell -Command \"'=== Antivirus Products ===' | Out-File security_result.txt\"");
    system("powershell -Command \"Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct | Select-Object displayName, pathToSignedProductExe | Out-File security_result.txt -Append\"");

    // Windows Defender Status
    system("powershell -Command \"'=== Windows Defender Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-MpPreference | Select-Object -Property DisableRealtimeMonitoring | Out-File security_result.txt -Append\"");

    // Firewall Status
    system("powershell -Command \"'=== Firewall Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-NetFirewallProfile | Select-Object Name, Enabled | Out-File security_result.txt -Append\"");

    // User Account Control (UAC)
    system("powershell -Command \"'=== User Account Control (UAC) ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' -Name EnableLUA | Select-Object EnableLUA | Out-File security_result.txt -Append\"");

    // Remote Desktop (RDP) Status
    system("powershell -Command \"'=== Remote Desktop (RDP) Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name fDenyTSConnections | Select-Object fDenyTSConnections | Out-File security_result.txt -Append\"");

    // Windows Update Status
    system("powershell -Command \"'=== Windows Update Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-WmiObject -Class Win32_OperatingSystem | Select-Object LastBootUpTime | Out-File security_result.txt -Append\"");

    // Auto Login Status
    system("powershell -Command \"'=== Auto Login Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon' -Name AutoAdminLogon | Select-Object AutoAdminLogon | Out-File security_result.txt -Append\"");

    std::cout << "Security detection completed. Results saved in security_result.txt." << std::endl;
}

// 파일을 서버로 전송하는 함수
bool uploadFile(const std::string& filePath, const std::string& serverUrl) {
    HINTERNET hInternet, hConnect;
    DWORD bytesWritten;
    
    // 파일 열기
    std::ifstream file(filePath, std::ios::binary);
    if (!file.is_open()) {
        std::cerr << "파일을 열 수 없습니다!" << std::endl;
        return false;
    }

    // HTTP 요청을 위한 초기화
    hInternet = InternetOpen(L"Security File Upload", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) {
        std::cerr << "인터넷 연결을 열 수 없습니다!" << std::endl;
        return false;
    }

    // 서버와 연결
    hConnect = InternetOpenUrlA(hInternet, serverUrl.c_str(), NULL, 0, INTERNET_FLAG_RELOAD, 0);
    if (!hConnect) {
        std::cerr << "서버와의 연결을 열 수 없습니다!" << std::endl;
        InternetCloseHandle(hInternet);
        return false;
    }

    // HTTP 헤더 작성
    std::stringstream requestStream;
    requestStream << "POST /upload HTTP/1.1\r\n";
    requestStream << "Host: " << serverUrl << "\r\n";
    requestStream << "Content-Type: application/octet-stream\r\n";
    
    // 파일 크기 계산
    file.seekg(0, std::ios::end);
    long fileSize = file.tellg();
    file.seekg(0, std::ios::beg);

    requestStream << "Content-Length: " << fileSize << "\r\n";
    requestStream << "Connection: close\r\n\r\n";

    std::string requestHeader = requestStream.str();

    // HTTP 헤더 전송
    send(hConnect, requestHeader.c_str(), requestHeader.length(), 0);

    // 파일 내용 전송
    char buffer[1024];
    while (file.read(buffer, sizeof(buffer)) || file.gcount() > 0) {
        send(hConnect, buffer, file.gcount(), 0);
    }

    // 전송 후 연결 종료
    closesocket(hConnect);
    InternetCloseHandle(hInternet);
    file.close();

    std::cout << "파일 업로드 성공!" << std::endl;
    return true;
}

int main() {
    std::cout << "Running security check for Windows system" << std::endl;
    check_security();

    std::cout << "Uploading the security result..." << std::endl;

    // security_result.txt 파일을 서버로 업로드
    std::string filePath = "security_result.txt";  // 업로드할 파일 경로
    std::string serverUrl = "http://yourserver.com/upload";  // 서버의 업로드 URL

    if (uploadFile(filePath, serverUrl)) {
        std::cout << "Security result uploaded successfully!" << std::endl;
    } else {
        std::cerr << "Failed to upload the security result!" << std::endl;
    }

    return 0;
}
