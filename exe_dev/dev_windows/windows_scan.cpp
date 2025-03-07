#include <iostream>
#include <fstream>
#include <string>
#include <curl/curl.h>

// OS별 보안 검사 함수 (Windows 전용)
void check_security() {
    std::cout << "Running Windows-specific security checks..." << std::endl;

    system("powershell -Command \"'Windows' | Out-File security_result.txt\"");

    // Antivirus Products
    system("powershell -Command \"'=== Antivirus Products ===' | Out-File security_result.txt -Append\"");
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

    // Auto Login Status
    // Auto Login Status
    system("powershell -Command \"'=== Auto Login Status ===' | Out-File security_result.txt -Append\"");

    // AutoAdminLogon 확인 후 포맷 변경
    system("powershell -Command \"$autoAdminLogon = Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon' -ErrorAction SilentlyContinue; "
            "$status = if ($autoAdminLogon -and $autoAdminLogon.AutoAdminLogon -eq '1') { '1' } else { '0' }; "
            "'AutoAdminLogon' + [System.Environment]::NewLine + '--------------' + [System.Environment]::NewLine + $status | Out-File security_result.txt -Append\"");

    // Add ending marker to the file
    system("powershell -Command \"echo '-1' | Out-File security_result.txt -Append\"");  // Corrected to append "-1" at the end

    std::cout << "Security detection completed. Results saved in security_result.txt." << std::endl;
}

// cURL 요청을 처리하는 함수
bool uploadFile(const std::string& url, const std::string& filePath) {
    CURL *curl;
    CURLcode res;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();

    if (!curl) {
        std::cerr << "Failed to initialize cURL" << std::endl;
        return false;
    }

    // MIME 형식으로 데이터를 설정
    curl_mime *mime;
    curl_mimepart *part;

    mime = curl_mime_init(curl);

    // "file" 필드에 파일을 첨부
    part = curl_mime_addpart(mime);
    curl_mime_name(part, "file");
    curl_mime_filedata(part, filePath.c_str()); // 업로드할 파일 경로

    // cURL 옵션 설정
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_MIMEPOST, mime);

    // 요청 수행
    res = curl_easy_perform(curl);

    // 에러 처리
    if (res != CURLE_OK) {
        std::cerr << "Request failed: " << curl_easy_strerror(res) << std::endl;
        curl_mime_free(mime);
        curl_easy_cleanup(curl);
        return false;
    }

    std::cout << "Request successful!" << std::endl;

    // 리소스 정리
    curl_mime_free(mime);
    curl_easy_cleanup(curl);
    return true;
}

int main() {

    std::cout << "Running security check for Windows system" << std::endl;
    check_security();

    std::cout << "Uploading the security result..." << std::endl;

    std::string url = "http://localhost:3001/upload";  // 서버 URL
    std::string filePath = "security_result.txt";      // 업로드할 파일 경로

    // 파일 업로드 함수 호출
    if (!uploadFile(url, filePath)) {
        std::cerr << "File upload failed!" << std::endl;
        return 1;
    }

    return 0;

}