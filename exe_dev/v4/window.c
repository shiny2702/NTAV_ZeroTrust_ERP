#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void check_windows() {
    printf("Running Windows-specific commands...\n");
    // PowerShell을 사용하여 백신 정보 가져오기 (Get-CimInstance 사용)
    system("powershell -Command \"Get-CimInstance -Namespace 'root\\SecurityCenter2' -ClassName AntiVirusProduct | Select-Object displayName > antivirus_result.txt\"");
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <os_type>\n", argv[0]);
        return 1;
    }

    if (strcmp(argv[1], "Windows") == 0) {
        check_windows();
    }

    printf("Antivirus detection completed. Results saved in antivirus_result.txt.\n");
    return 0;
}
