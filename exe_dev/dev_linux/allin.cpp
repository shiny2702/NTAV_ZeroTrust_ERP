#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>

#include <unistd.h>


using namespace std;

// OS별 백신 검사 함수
void check_antivirus() {
    cout << "Running Linux-specific commands..." << endl;
    //system("ps aux | grep -i \"NTAV Antivirus\" > antivirus_result.txt");
    system("echo '=== Linux Security Check ===' > antivirus_result.txt; "

    // LSM (Linux Security Module) 활성화 상태 확인
    "echo '[LSM (Linux Security Module) Check]' >> antivirus_result.txt; "
    "if [ -f /sys/kernel/security/lsm ]; then cat /sys/kernel/security/lsm >> antivirus_result.txt; "
    "else echo 'LSM information not available.' >> antivirus_result.txt; fi; "

    // AppArmor / SELinux 상태 확인
    "echo '[AppArmor / SELinux Status]' >> antivirus_result.txt; "
    "if command -v aa-status > /dev/null 2>&1; then sudo aa-status >> antivirus_result.txt; "
    "elif command -v getenforce > /dev/null 2>&1; then getenforce >> antivirus_result.txt; "
    "else echo 'Neither AppArmor nor SELinux found.' >> antivirus_result.txt; fi; "

    // 방화벽 상태 확인 (iptables, UFW, firewalld)
    "echo '[Firewall Check]' >> antivirus_result.txt; "
    "if command -v iptables > /dev/null 2>&1; then echo 'iptables rules:' >> antivirus_result.txt; sudo iptables -L >> antivirus_result.txt; "
    "else echo 'iptables not found.' >> antivirus_result.txt; fi; "

    "if command -v ufw > /dev/null 2>&1; then echo 'UFW status:' >> antivirus_result.txt; sudo ufw status >> antivirus_result.txt; "
    "else echo 'UFW not found.' >> antivirus_result.txt; fi; "

    "if command -v systemctl > /dev/null 2>&1 && systemctl list-unit-files | grep -q firewalld; then echo 'firewalld status:' >> antivirus_result.txt; sudo systemctl is-active firewalld >> antivirus_result.txt; "
    "else echo 'firewalld not found.' >> antivirus_result.txt; fi; "

    "echo 'Security check completed. Results saved in antivirus_result.txt' >> antivirus_result.txt;");

    cout << "Antivirus detection completed. Results saved in antivirus_result.txt." << endl;
}

int main() {
    cout << "Running antivirus check for " << os_type << "..." << endl;
    check_antivirus();

    cout << "All tasks completed successfully!" << endl;

    return 0;
}
