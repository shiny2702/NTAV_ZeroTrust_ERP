#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>

#include <unistd.h>


using namespace std;

// OS별 백신 검사 함수
void check_security() {
    cout << "Running Linux-specific commands..." << endl;
    //system("ps aux | grep -i \"NTAV Security\" > security_result.txt");
    system("echo '=== Linux Security Check ===' > security_result.txt; "

    // LSM (Linux Security Module) 활성화 상태 확인
    "echo '[LSM (Linux Security Module) Check]' >> security_result.txt; "
    "if [ -f /sys/kernel/security/lsm ]; then cat /sys/kernel/security/lsm >> security_result.txt; "
    "else echo 'LSM information not available.' >> security_result.txt; fi; "
    
    // AppArmor / SELinux 상태 확인
    "echo '[AppArmor / SELinux Status]' >> security_result.txt; "
    "if command -v aa-status > /dev/null 2>&1; then aa-status >> security_result.txt; "
    "elif command -v getenforce > /dev/null 2>&1; then getenforce >> security_result.txt; "
    "else echo 'Neither AppArmor nor SELinux found.' >> security_result.txt; fi; "
    
    // 방화벽 상태 확인 (UFW, firewalld)
    "if command -v ufw > /dev/null 2>&1; then echo 'UFW is installed.' >> security_result.txt; "
    "if ufw status 2>&1 | grep -q 'Status: active'; then echo 'UFW is active.' >> security_result.txt; "
    "else echo 'UFW is inactive or access denied.' >> security_result.txt; fi; "
    "else echo 'UFW not found.' >> security_result.txt; fi; "
    
    "if command -v systemctl > /dev/null 2>&1 && systemctl list-unit-files | grep -q firewalld; then "
    "if systemctl is-active firewalld --quiet; then echo 'firewalld is active.' >> security_result.txt; "
    "else echo 'firewalld is inactive.' >> security_result.txt; fi; "
    "else echo 'firewalld not found.' >> security_result.txt; fi; "
    
    "echo 'Security check completed. Results saved in security_result.txt' >> security_result.txt;");

    cout << "Security detection completed. Results saved in security_result.txt." << endl;
}

int main() {
    cout << "Running security check for linux..." << endl;
    check_security();

    cout << "All tasks completed successfully!" << endl;

    return 0;
}
