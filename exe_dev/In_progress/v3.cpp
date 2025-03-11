#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>

#include <cryptlib.h>
#include <sha.h>
#include <hex.h>
#include <files.h>
#include <rsa.h>
#include <osrng.h>
#include <pssr.h>

#ifdef _WIN32
    #include <windows.h>
#else
    #include <unistd.h>
#endif

#define SIGNATURE_FILE "signature.bin"
#define PUBLIC_KEY_FILE "public.key"  // PEM 대신 DER 또는 바이너리 키 사용

using namespace CryptoPP;
using namespace std;

// 실행 중인 바이너리 경로를 얻는 함수
string get_executable_path() {
    char path[1024] = {0};
#ifdef _WIN32
    GetModuleFileNameA(NULL, path, sizeof(path));
#else
    ssize_t len = readlink("/proc/self/exe", path, sizeof(path) - 1);
    if (len != -1) {
        path[len] = '\0';
    }
#endif
    return string(path);
}

// SHA-256 해시 계산
vector<CryptoPP::byte> calculate_sha256(const string& filename) {
    SHA256 hash;
    vector<CryptoPP::byte> digest(SHA256::DIGESTSIZE);
    
    FileSource(filename.c_str(), true,
        new HashFilter(hash,
            new ArraySink(digest.data(), digest.size())
        )
    );
    return digest;
}

// 공개키를 로드하는 함수 (PEM 없이 BER 형식 사용)
void LoadPublicKey(const string& filename, RSA::PublicKey& key) {
    FileSource file(filename.c_str(), true);
    key.BERDecode(file);
}

// RSA-PSS 서명을 이용한 무결성 검증
bool verify_signature(const string& filename, const string& signature_file, const string& public_key_file) {
    try {
        // SHA-256 해시 계산
        vector<CryptoPP::byte> hash = calculate_sha256(filename);
        
        // 공개키 로드 (PEM이 아닌 BER 형식)
        RSA::PublicKey publicKey;
        LoadPublicKey(public_key_file, publicKey);
        
        // 서명 로드
        vector<CryptoPP::byte> signature;
        FileSource(signature_file.c_str(), true, new VectorSink(signature));
        
        // 서명 검증
        RSASS<PSS, SHA256>::Verifier verifier(publicKey);
        return verifier.VerifyMessage(hash.data(), hash.size(), signature.data(), signature.size());
    } catch (const Exception& e) {
        cerr << "Signature verification failed: " << e.what() << endl;
        return false;
    }
}

// Windows 백신 검사
void check_windows() {
    cout << "Running Windows-specific commands..." << endl;
    system("wmic /namespace:\\\\root\\SecurityCenter2 path AntiVirusProduct get displayName,pathToSignedProductExe > antivirus_result.txt");
}

// macOS 백신 검사
void check_macos() {
    cout << "Running macOS-specific commands..." << endl;
    system("system_profiler SPApplicationsDataType | grep -A 5 -i \"antivirus\" > antivirus_result.txt");
}

// Linux 백신 검사
void check_linux() {
    cout << "Running Linux-specific commands..." << endl;
    system("ps aux | grep -i \"NTAV Antivirus\" > antivirus_result.txt");
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cout << "Usage: " << argv[0] << " <os_type>\n";
        cout << "<os_type> can be: Windows, macOS, or Linux." << endl;
        return 1;
    }

    string executable_path = get_executable_path();
    cout << "Checking integrity of: " << executable_path << endl;

    // 무결성 검증
    if (!verify_signature(executable_path, SIGNATURE_FILE, PUBLIC_KEY_FILE)) {
        cout << "Integrity check failed! The program has been tampered with." << endl;
        return 1;
    }

    cout << "Integrity check passed. Program is unmodified." << endl;

    string os_type(argv[1]);
    if (os_type == "Windows") {
        check_windows();
    } else if (os_type == "macOS") {
        check_macos();
    } else if (os_type == "Linux") {
        check_linux();
    } else {
        cout << "Invalid OS type: " << os_type << endl;
        return 1;
    }

    cout << "Antivirus detection completed. Results saved in antivirus_result.txt." << endl;
    return 0;
}

/*#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>

#include <cryptlib.h>
#include <sha.h>
#include <hex.h>
#include <files.h>
#include <rsa.h>
#include <osrng.h>
#include <pssr.h>
#include <pem.h>

#ifdef _WIN32
    #include <windows.h>
#else
    #include <unistd.h>
#endif

#define SIGNATURE_FILE "signature.bin"
#define PUBLIC_KEY_FILE "public.pem"

using namespace CryptoPP;
using namespace std;

// 실행 중인 바이너리 경로를 얻는 함수
string get_executable_path() {
    char path[1024] = {0};
#ifdef _WIN32
    GetModuleFileNameA(NULL, path, sizeof(path));
#else
    ssize_t len = readlink("/proc/self/exe", path, sizeof(path) - 1);
    if (len != -1) {
        path[len] = '\0';
    }
#endif
    return string(path);
}

// SHA-256 해시 계산
vector<byte> calculate_sha256(const string& filename) {
    SHA256 hash;
    vector<byte> digest(SHA256::DIGESTSIZE);
    
    FileSource(filename.c_str(), true,
        new HashFilter(hash,
            new ArraySink(digest.data(), digest.size())
        )
    );
    return digest;
}

// RSA-PSS 서명을 이용한 무결성 검증
bool verify_signature(const string& filename, const string& signature_file, const string& public_key_file) {
    try {
        // SHA-256 해시 계산
        vector<byte> hash = calculate_sha256(filename);
        
        // 공개키 로드
        RSA::PublicKey publicKey;
        FileSource fs(public_key_file.c_str(), true, new PEM_Load(publicKey));
        
        // 서명 로드
        vector<byte> signature;
        FileSource(signature_file.c_str(), true, new VectorSink(signature));
        
        // 서명 검증
        RSASS<PSS, SHA256>::Verifier verifier(publicKey);
        return verifier.VerifyMessage(hash.data(), hash.size(), signature.data(), signature.size());
    } catch (const Exception& e) {
        cerr << "Signature verification failed: " << e.what() << endl;
        return false;
    }
}

// Windows 백신 검사
void check_windows() {
    cout << "Running Windows-specific commands..." << endl;
    system("wmic /namespace:\\\\root\\SecurityCenter2 path AntiVirusProduct get displayName,pathToSignedProductExe > antivirus_result.txt");
}

// macOS 백신 검사
void check_macos() {
    cout << "Running macOS-specific commands..." << endl;
    system("system_profiler SPApplicationsDataType | grep -A 5 -i \"antivirus\" > antivirus_result.txt");
}

// Linux 백신 검사
void check_linux() {
    cout << "Running Linux-specific commands..." << endl;
    system("ps aux | grep -i \"NTAV Antivirus\" > antivirus_result.txt");
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cout << "Usage: " << argv[0] << " <os_type>\n";
        cout << "<os_type> can be: Windows, macOS, or Linux." << endl;
        return 1;
    }

    string executable_path = get_executable_path();
    cout << "Checking integrity of: " << executable_path << endl;

    // 무결성 검증
    if (!verify_signature(executable_path, SIGNATURE_FILE, PUBLIC_KEY_FILE)) {
        cout << "Integrity check failed! The program has been tampered with." << endl;
        return 1;
    }

    cout << "Integrity check passed. Program is unmodified." << endl;

    string os_type(argv[1]);
    if (os_type == "Windows") {
        check_windows();
    } else if (os_type == "macOS") {
        check_macos();
    } else if (os_type == "Linux") {
        check_linux();
    } else {
        cout << "Invalid OS type: " << os_type << endl;
        return 1;
    }

    cout << "Antivirus detection completed. Results saved in antivirus_result.txt." << endl;
    return 0;
}*/
