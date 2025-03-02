import React, { Component } from "react";
import "../css/downloadPage.css";

class DownloadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null, // 선택한 파일
    };
  }

  handleDownload = (event, fileName) => {
    event.preventDefault(); // 기본 다운로드 동작 방지

    const userConfirmed = window.confirm(`${fileName}을(를) 다운로드하시겠습니까?`);

    if (userConfirmed) {
      this.setState({ selectedFile: fileName }, () => {
        setTimeout(() => {
          window.location.href = `https://github.com/notry345/test/releases/download/test/${fileName}`; // 다운로드 시작
        }, 1500);
      });
    } else {
      this.setState({ selectedFile: null });
    }
  };

  render() {
    const { selectedFile } = this.state;

    return (
      <div className="download-container">
        <h1>파일 다운로드</h1>
        <p>다운로드할 파일을 선택하세요.</p>

        <ul className="download-links">
          <li><a href="/download/file1.exe" onClick={(e) => this.handleDownload(e, "allin.exe")}>allin.exe</a></li>
          <li><a href="/download/file1.exe" onClick={(e) => this.handleDownload(e, "window.exe")}>Windows</a></li>
          <li><a href="/download/file2.exe" onClick={(e) => this.handleDownload(e, "mac.exe")}>macOS</a></li>
          <li><a href="/download/file3.exe" onClick={(e) => this.handleDownload(e, "linux.exe")}>Linux</a></li>
        </ul>

        {selectedFile && <p>{selectedFile} 다운로드가 시작됩니다...</p>}
      </div>
    );
  }
}

export default DownloadPage;
