// 운영 체제 정보 (예: windows, macos, linux)를 파라미터로 입력받아 해당 운영 체제에 맞는 작업을 수행

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void check_windows() {
    // Windows에서 보안 소프트웨어 목록을 조회하기 위해 'wmic' 명령어 사용
    printf("Running Windows-specific commands...\n");
    system("wmic /namespace:\\\\root\\SecurityCenter2 path AntiVirusProduct get displayName > antivirus_result.txt");
}

void check_macos() {
    // macOS에서 보안 소프트웨어 목록을 조회하기 위해 'system_profiler' 명령어 사용
    printf("Running macOS-specific commands...\n");
    system("system_profiler SPApplicationsDataType | grep -i \"antivirus\" > antivirus_result.txt");
}

void check_linux() {
    // Linux에서는 'ps' 명령어를 사용하여 'clamav'와 같은 보안 소프트웨어를 확인
    printf("Running Linux-specific commands...\n");
    system("ps aux | grep -i \"clamav\" > antivirus_result.txt");
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <os_type>\n", argv[0]);
        printf("<os_type> can be: windows, macos, or linux.\n");
        return 1;  // 잘못된 인자 입력 시 종료
    }

    // 파라미터로 입력받은 OS 정보를 확인
    if (strcmp(argv[1], "Windows") == 0) {
        check_windows();
    } else if (strcmp(argv[1], "macOS") == 0) {
        check_macos();
    } else if (strcmp(argv[1], "Linux") == 0) {
        check_linux();
    } else {
        printf("Invalid OS type: %s\n", argv[1]);
        return 1;
    }
    printf("Antivirus detection completed. Results saved in antivirus_result.txt.\n");

    return 0;
}
