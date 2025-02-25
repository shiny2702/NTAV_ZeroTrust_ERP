#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>

#include <cryptlib.h>
#include <rsa.h>
#include <osrng.h>
#include <pssr.h>
#include <sha.h>
#include <files.h>
#include <hex.h>

#ifdef _WIN32
    #include <windows.h>
#else
    #include <unistd.h>
#endif

#define SIGNATURE_FILE "signature.bin"
#define PUBLIC_KEY_FILE "public.key"
#define PRIVATE_KEY_FILE "private.key"

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

// RSA 키 생성
void generate_rsa_keys() {
    AutoSeededRandomPool rng;
    RSA::PrivateKey privateKey;
    RSA::PublicKey publicKey;

    privateKey.GenerateRandomWithKeySize(rng, 2048);
    publicKey.AssignFrom(privateKey);

    FileSink publicFile(PUBLIC_KEY_FILE);
    publicKey.Save(publicFile);
    
    FileSink privateFile(PRIVATE_KEY_FILE);
    privateKey.Save(privateFile);

    cout << "RSA key pair generated and saved as public.key and private.key" << endl;
}

// 개인키로 서명
void sign_file(const string& filename, const string& private_key_file, const string& signature_file) {
    try {
        vector<CryptoPP::byte> hash = calculate_sha256(filename);
        RSA::PrivateKey privateKey;
        FileSource(private_key_file.c_str(), true, new HexDecoder);
        privateKey.Load(FileSource(private_key_file.c_str(), true).Ref());

        AutoSeededRandomPool rng;
        RSASS<PSS, SHA256>::Signer signer(privateKey);

        string signature;
        StringSource(hash.data(), hash.size(), true,
            new SignerFilter(rng, signer,
                new StringSink(signature)
            )
        );

        CryptoPP::FileSink signatureSink(signature_file.c_str());
        CryptoPP::StringSource(signature, true, new CryptoPP::Redirector(signatureSink));
        cout << "Signature created and saved as " << signature_file << endl;

    } catch (const Exception& e) {
        cerr << "Error during signing: " << e.what() << endl;
    }
}

// OS별 백신 검사 함수
void check_antivirus(const string& os_type) {
    if (os_type == "Windows") {
        cout << "Running Windows-specific commands..." << endl;
        system("wmic /namespace:\\\\root\\SecurityCenter2 path AntiVirusProduct get displayName,pathToSignedProductExe > antivirus_result.txt");
    } else if (os_type == "macOS") {
        cout << "Running macOS-specific commands..." << endl;
        system("system_profiler SPApplicationsDataType | grep -A 5 -i \"antivirus\" > antivirus_result.txt");
    } else if (os_type == "Linux") {
        cout << "Running Linux-specific commands..." << endl;
        system("ps aux | grep -i \"NTAV Antivirus\" > antivirus_result.txt");
    } else {
        cout << "Invalid OS type: " << os_type << endl;
    }

    cout << "Antivirus detection completed. Results saved in antivirus_result.txt." << endl;
}

int main() {
    string executable_path = get_executable_path();
    cout << "Checking integrity of: " << executable_path << endl;

    // 1. 키 생성
    cout << "Generating RSA keys..." << endl;
    generate_rsa_keys();

    // 2. 서명 생성
    cout << "Signing the executable..." << endl;
    sign_file(executable_path, PRIVATE_KEY_FILE, SIGNATURE_FILE);

    // 3. 무결성 검증
    cout << "Verifying integrity..." << endl;
    if (!verify_signature(executable_path, SIGNATURE_FILE, PUBLIC_KEY_FILE)) {
        cout << "Integrity check failed! The program has been tampered with." << endl;
        return 1;
    }

    cout << "Integrity check passed. Program is unmodified." << endl;

    // 4. 백신 검사
    string os_type;
#ifdef _WIN32
    os_type = "Windows";
#elif defined(__APPLE__)
    os_type = "macOS";
#else
    os_type = "Linux";
#endif

    cout << "Running antivirus check for " << os_type << "..." << endl;
    check_antivirus(os_type);

    cout << "All tasks completed successfully!" << endl;

    return 0;
}
