#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void check_window() {
    printf("Checking for Symantec Endpoint Security installation...\n");
    system("powershell -Command \"Get-CimInstance -Namespace 'root\\SecurityCenter2' -ClassName AntiVirusProduct | Where-Object {$_.displayName -match 'Symantec'} | Select-Object displayName > symantec_check.txt\"");

    printf("Checking if ccSvcHst.exe is running...\n");
    system("powershell -Command \"Get-Process -Name ccSvcHst -ErrorAction SilentlyContinue | Select-Object ProcessName > symantec_process.txt\"");
}

void check_mac() {
    printf("Checking for Symantec Endpoint Security installation on macOS...\n");
    system("if [ -d \"/Applications/Symantec Endpoint Protection.app\" ] || pkgutil --pkgs | grep -qi symantec; then echo 'Symantec Endpoint Security is installed' > symantec_mac_check.txt; else echo 'Not installed' > symantec_mac_check.txt; fi");

    printf("Checking if symdaemon process is running...\n");
    system("pgrep -x symdaemon > symantec_mac_process.txt && echo 'symdaemon is running' >> symantec_mac_process.txt || echo 'symdaemon is not running' >> symantec_mac_process.txt");
}

void check_linux() {
    printf("Checking for Symantec Endpoint Security installation on Linux...\n");
    system("if [ -d \"/opt/Symantec\" ]; then echo 'Symantec Endpoint Security is installed' > symantec_linux_check.txt; else echo 'Not installed' > symantec_linux_check.txt; fi");

    printf("Checking if symdaemon process is running on Linux...\n");
    system("pgrep -x symdaemon > symantec_linux_process.txt && echo 'symdaemon is running' >> symantec_linux_process.txt || echo 'symdaemon is not running' >> symantec_linux_process.txt");
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <os_type>\n", argv[0]);
        return 1;
    }

    if (strcmp(argv[1], "Windows") == 0) {
        check_window();
    } else if (strcmp(argv[1], "Mac") == 0) {
        check_mac();
    } else if (strcmp(argv[1], "Linux") == 0) {
        check_linux();
    } else {
        printf("Invalid OS type. Use 'Windows', 'Mac', or 'Linux'.\n");
        return 1;
    }

    printf("Symantec Endpoint Security and process check completed.\n");
    printf("Results saved in respective files based on OS.\n");
    return 0;
}
