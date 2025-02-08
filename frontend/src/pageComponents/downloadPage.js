import React, { Component } from "react";
import '../CSS/downloadPage.css';

class DownloadPage extends Component {
  componentDidMount() {
    // 페이지 로드 후 실행될 함수
    const userConfirmed = window.confirm("보안 소프트웨어 탐지를 위해 네이티브 앱을 실행할까요?");
    
    if (userConfirmed) {
      // "확인"을 클릭하면 서버 측 exe 파일 다운로드가 시작되게 함
      window.location.href = "/download/exefile.exe"; // 서버에서 제공하는 다운로드 URL로 리디렉션
    } else {
      // "취소"를 클릭하면 알림 메시지 표시
      alert("탐지가 취소되었습니다.");
    }
  }

  render() {
    return (
      <div className="download-container">
        <h1>보안 소프트웨어 탐지를 위해 네이티브 앱을 실행할까요?</h1>
        <p>보안 검사를 진행하려면 '확인'을 클릭해주세요.</p>
      </div>
    );
  }
}

export default DownloadPage;
