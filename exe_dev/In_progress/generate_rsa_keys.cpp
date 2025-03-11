#include <iostream>
#include <fstream>
#include <cryptlib.h>
#include <rsa.h>
#include <osrng.h>
#include <files.h>

using namespace CryptoPP;
using namespace std;

void generate_rsa_keys() {
    // 키 생성기
    AutoSeededRandomPool rng;

    // RSA 키 쌍 생성 (2048비트)
    RSA::PrivateKey privateKey;
    RSA::PublicKey publicKey;

    privateKey.GenerateRandomWithKeySize(rng, 2048);
    publicKey.AssignFrom(privateKey);

    // 공개키를 파일에 저장 (PEM 형식)
    FileSink publicFile("public.key");
    publicKey.Save(publicFile);
    
    // 개인키를 파일에 저장 (PEM 형식)
    FileSink privateFile("private.key");
    privateKey.Save(privateFile);

    cout << "RSA key pair generated and saved as public.key and private.key" << endl;
}

int main() {
    generate_rsa_keys();
    return 0;
}