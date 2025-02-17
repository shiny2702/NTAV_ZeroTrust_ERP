#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/sha.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
#include <openssl/err.h>

#define SIGNATURE_FILE "signature.bin"
#define PUBLIC_KEY_FILE "public.pem"
#define PROGRAM_FILE "myapp_v3.exe"  // 이 프로그램의 파일명 (자체를 검사하려는 파일)

void check_windows() {
    printf("Running Windows-specific commands...\n");
    system("wmic /namespace:\\root\\SecurityCenter2 path AntiVirusProduct get displayName,pathToSignedProductExe > antivirus_result.txt");
    // 설치된 백신 제품 정보를 가져옴
    // system("for /f \"tokens=*\" %A in ('wmic /namespace:\\root\\SecurityCenter2 path AntiVirusProduct get pathToSignedProductExe ^| findstr .exe') do wmic datafile where name='%A' get Version >> antivirus_result.txt");
    // 백신 실행 파일의 버전 정보
}

void check_macos() {
    printf("Running macOS-specific commands...\n");
    system("system_profiler SPApplicationsDataType | grep -A 5 -i \"antivirus\" > antivirus_result.txt");
}

void check_linux() {
    printf("Running Linux-specific commands...\n");

    system("ps aux | grep -i \"NTAV Antivirus\"");
    // 시스템에서 실행 중인 프로세스 목록 중 NTAV Antivirus 찾아 출력
    // system("which ntav")
    // system("dpkg -l | grep -i \"clamav\"");
    // system("rpm -qa | grep -i \"clamav\"");
}

// 파일의 SHA-256 해시값 계산
void calculate_sha256(const char *filename, unsigned char *output_hash) {
    FILE *file = fopen(filename, "rb");
    if (!file) {
        perror("Failed to open file");
        exit(1);
    }

    SHA256_CTX sha256_ctx;
    SHA256_Init(&sha256_ctx);

    unsigned char buffer[1024];
    size_t bytes_read;

    while ((bytes_read = fread(buffer, 1, sizeof(buffer), file)) > 0) {
        SHA256_Update(&sha256_ctx, buffer, bytes_read);
    }

    SHA256_Final(output_hash, &sha256_ctx);
    fclose(file);
}

// 저장된 해시값과 비교하여 무결성 검사
int verify_integrity(const char *filename, const char *signature_file) {
    unsigned char calculated_hash[SHA256_DIGEST_LENGTH];
    unsigned char stored_hash[SHA256_DIGEST_LENGTH];

    // 현재 프로그램의 해시값 계산
    calculate_sha256(filename, calculated_hash);

    // 미리 저장된 해시값을 읽어옴
    FILE *sig_file = fopen(signature_file, "rb");
    if (!sig_file) {
        perror("Failed to open signature file");
        return 0;
    }

    fread(stored_hash, 1, SHA256_DIGEST_LENGTH, sig_file);
    fclose(sig_file);

    // 해시값 비교
    if (memcmp(calculated_hash, stored_hash, SHA256_DIGEST_LENGTH) == 0) {
        return 1; // 무결성 검증 성공
    }

    return 0; // 무결성 검증 실패
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <os_type>\n", argv[0]);
        printf("<os_type> can be: windows, macos, or linux.\n");
        return 1;
    }

    // 무결성 확인
    if (!verify_integrity(PROGRAM_FILE, SIGNATURE_FILE)) {
        printf("Integrity check failed! The program has been tampered with.\n");
        return 1;
    }

    printf("Integrity check passed. Program is unmodified.\n");

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
