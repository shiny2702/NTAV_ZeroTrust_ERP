#include <iostream>
#include <cstdlib>

using namespace std;

// OS별 보안 검사 함수 (Windows 전용)
void check_security() {
    cout << "Running Windows-specific security checks..." << endl;

    // Antivirus Products
    system("powershell -Command \"'=== Antivirus Products ===' | Out-File security_result.txt\"");
    system("powershell -Command \"Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct | Select-Object displayName, pathToSignedProductExe | Out-File security_result.txt -Append\"");

    // Windows Defender Status
    system("powershell -Command \"'=== Windows Defender Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-MpPreference | Select-Object -Property DisableRealtimeMonitoring | Out-File security_result.txt -Append\"");

    // Firewall Status
    system("powershell -Command \"'=== Firewall Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-NetFirewallProfile | Select-Object Name, Enabled | Out-File security_result.txt -Append\"");

    // User Account Control (UAC)
    system("powershell -Command \"'=== User Account Control (UAC) ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' -Name EnableLUA | Select-Object EnableLUA | Out-File security_result.txt -Append\"");

    // Remote Desktop (RDP) Status
    system("powershell -Command \"'=== Remote Desktop (RDP) Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name fDenyTSConnections | Select-Object fDenyTSConnections | Out-File security_result.txt -Append\"");

    // Windows Update Status
    system("powershell -Command \"'=== Windows Update Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-WmiObject -Class Win32_OperatingSystem | Select-Object LastBootUpTime | Out-File security_result.txt -Append\"");

    // Auto Login Status
    system("powershell -Command \"'=== Auto Login Status ===' | Out-File security_result.txt -Append\"");
    system("powershell -Command \"Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon' -Name AutoAdminLogon | Select-Object AutoAdminLogon | Out-File security_result.txt -Append\"");

    cout << "Security detection completed. Results saved in security_result.txt." << endl;
}

int main() {
    cout << "Running security check for Windows system" << endl;
    check_security();
    cout << "All tasks completed successfully!" << endl;
    return 0;
}
