import React, { Component } from "react";
import '../css/downloadPage.css';

class DownloadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserConfirmed: null,
    };
    this.hasConfirmed = false; // 중복 실행 방지용 인스턴스 변수
  }

  componentDidMount() {
    // 이미 실행되었으면 더 이상 실행하지 않음
    if (this.hasConfirmed) return;
    this.hasConfirmed = true; // 실행 여부 업데이트

    const userConfirmed = window.confirm("보안 소프트웨어 탐지를 위해 네이티브 앱을 실행할까요?");
    
    if (userConfirmed) {
      this.setState({ isUserConfirmed: true }, () => {
        setTimeout(() => {
          window.location.href = "/download/exefile.exe"; // 1.5초 후 다운로드 시작
        }, 1500);
      });   
    } else {
      this.setState({ isUserConfirmed: false });
    }
  }

  render() {
    const { isUserConfirmed } = this.state;

    return (
      <div className="download-container">
        {isUserConfirmed === null ? (
          <>
            <h1>보안 소프트웨어 탐지를 위한 확인</h1>
            <p>잠시 후 보안 검사를 진행합니다...</p>
          </>
        ) : isUserConfirmed ? (
          <h1>다운로드가 시작되었습니다.</h1>
        ) : (
          <h1>탐지가 취소되었습니다.</h1>
        )}
      </div>
    );
  }
}

export default DownloadPage;


