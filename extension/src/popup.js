document.getElementById("runAppBtn").addEventListener("click", function() {
    if (confirm("보안 소프트웨어 탐지를 위해 네이티브 앱을 실행할까요?")) {
        window.location.href = "myapp://check-antivirus"; // 네이티브 앱 실행
    } else {
        alert("탐지가 취소되었습니다.");
    }
});
