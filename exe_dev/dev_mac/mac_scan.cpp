#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>
#include <curl/curl.h>

using namespace std;

// OS별 백신 검사 함수
void check_security() {
    cout << "Running macOS-specific commands..." << endl;

    // 스파이웨어 및 보안 검사 관련 결과를 저장
    system("spctl --status > security_result.txt");
    system("system_profiler SPInstallHistoryDataType | grep -i 'xprotect' >> security_result.txt");

    // System Integrity Protection (SIP) 상태 확인
    system("csrutil status >> security_result.txt");

    // FileVault (디스크 암호화) 상태 확인
    system("fdesetup status >> security_result.txt");

    cout << "Security detection completed. Results saved in security_result.txt." << endl;
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

    std::cout << "Running security check for Mac system" << std::endl;
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
