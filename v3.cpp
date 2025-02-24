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

#define SIGNATURE_FILE "signature.bin"
#define PUBLIC_KEY_FILE "public.pem"
#define PROGRAM_FILE "myapp_v3.exe"

using namespace CryptoPP;
using namespace std;

void check_windows() {
    cout << "Running Windows-specific commands..." << endl;
    system("wmic /namespace:\\root\\SecurityCenter2 path AntiVirusProduct get displayName,pathToSignedProductExe > antivirus_result.txt");
}

void check_macos() {
    cout << "Running macOS-specific commands..." << endl;
    system("system_profiler SPApplicationsDataType | grep -A 5 -i \"antivirus\" > antivirus_result.txt");
}

void check_linux() {
    cout << "Running Linux-specific commands..." << endl;
    system("ps aux | grep -i \"NTAV Antivirus\"");
}

vector<byte> calculate_sha256(const string& filename) {
    SHA256 hash;
    vector<byte> digest(SHA256::DIGESTSIZE);
    FileSource(filename.c_str(), true, new HashFilter(hash, new ArraySink(digest.data(), digest.size())));
    return digest;
}

bool verify_signature(const string& filename, const string& signature_file, const string& public_key_file) {
    try {
        vector<byte> hash = calculate_sha256(filename);
        
        RSA::PublicKey publicKey;
        FileSource fs(public_key_file.c_str(), true, new PEM_Load(publicKey));
        
        vector<byte> signature;
        FileSource(signature_file.c_str(), true, new VectorSink(signature));
        
        RSASS<PSS, SHA256>::Verifier verifier(publicKey);
        return verifier.VerifyMessage(hash.data(), hash.size(), signature.data(), signature.size());
    } catch (const Exception& e) {
        cerr << "Signature verification failed: " << e.what() << endl;
        return false;
    }
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cout << "Usage: " << argv[0] << " <os_type>\n";
        cout << "<os_type> can be: Windows, macOS, or Linux." << endl;
        return 1;
    }

    if (!verify_signature(PROGRAM_FILE, SIGNATURE_FILE, PUBLIC_KEY_FILE)) {
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