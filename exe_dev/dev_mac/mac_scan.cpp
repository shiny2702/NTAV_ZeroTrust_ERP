#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>

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

int main() {
    cout << "Running security check for mac..." << endl;
    check_security();

    cout << "All tasks completed successfully!" << endl;

    return 0;
}
