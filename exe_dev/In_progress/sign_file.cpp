#include <iostream>
#include <fstream>
#include <cryptlib.h>
#include <rsa.h>
#include <pssr.h>
#include <osrng.h>
#include <sha.h>
#include <files.h>
#include <hex.h>

using namespace CryptoPP;
using namespace std;

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

// 개인키로 서명
void sign_file(const string& filename, const string& private_key_file, const string& signature_file) {
    try {
        // SHA-256 해시 계산
        vector<CryptoPP::byte> hash = calculate_sha256(filename);

        // 개인키 로드
        RSA::PrivateKey privateKey;
        FileSource(private_key_file.c_str(), true, new HexDecoder);
        privateKey.Load(FileSource(private_key_file.c_str(), true).Ref());

        // 서명 생성 (PSS 방식 사용)
        AutoSeededRandomPool rng;
        RSASS<PSS, SHA256>::Signer signer(privateKey);

        // 서명 생성
        string signature;
        StringSource(hash.data(), hash.size(), true,
            new SignerFilter(rng, signer,
                new StringSink(signature)
            )
        );

        // 서명 파일로 저장
        CryptoPP::FileSink signatureSink(signature_file.c_str());
        CryptoPP::StringSource(signature, true, new CryptoPP::Redirector(signatureSink));
        cout << "Signature created and saved as " << signature_file << endl;

    } catch (const Exception& e) {
        cerr << "Error during signing: " << e.what() << endl;
    }
}

int main() {
    string executable_path = "v3.exe";  // 서명할 파일 경로
    string private_key_file = "private.key";  // 개인 키 파일 경로
    string signature_file = "signature.bin";  // 서명 파일 경로

    sign_file(executable_path, private_key_file, signature_file);
    return 0;
}