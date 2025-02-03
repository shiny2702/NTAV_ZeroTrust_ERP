#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void check_windows() {
    printf("Running Windows-specific commands...\n");
    system("wmic /namespace:\\root\\SecurityCenter2 path AntiVirusProduct get displayName,pathToSignedProductExe > antivirus_result.txt");
    system("for /f \"tokens=*\" %A in ('wmic /namespace:\\root\\SecurityCenter2 path AntiVirusProduct get pathToSignedProductExe ^| findstr .exe') do wmic datafile where name='%A' get Version >> antivirus_result.txt");
}

void check_macos() {
    printf("Running macOS-specific commands...\n");
    system("system_profiler SPApplicationsDataType | grep -A 5 -i \"antivirus\" > antivirus_result.txt");
}

void check_linux() {
    printf("Running Linux-specific commands...\n");
    system("dpkg -l | grep -i \"clamav\" > antivirus_result.txt 2>/dev/null");
    system("rpm -qa | grep -i \"clamav\" >> antivirus_result.txt 2>/dev/null");
    system("clamav --version >> antivirus_result.txt 2>/dev/null");
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <os_type>\n", argv[0]);
        printf("<os_type> can be: windows, macos, or linux.\n");
        return 1;
    }

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
