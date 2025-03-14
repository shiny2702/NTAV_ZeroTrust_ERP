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
        let downloadUrl = "";

        // 파일 이름에 따른 다운로드 URL 설정
        if (fileName === "Windows") {
          downloadUrl = "https://github.com/notry345/test/releases/download/test2/windows_scan.exe";
        } else if (fileName === "macOS") {
          downloadUrl = "https://github.com/shiny2702/NTAV_ZeroTrust_ERP/blob/seunghee/exe_dev/dev_mac/mac_scan";
        } else if (fileName === "Linux") {
          downloadUrl = "https://github.com/notry345/test/releases/download/untagged-1e361c96eed14322971a/linux_scan";
        }

        // 일정 시간 후 다운로드 시작
        setTimeout(() => {
          window.location.href = downloadUrl;
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
          <li><a onClick={(e) => this.handleDownload(e, "Windows")}>Windows</a></li>
          <li><a onClick={(e) => this.handleDownload(e, "Linux")}>Linux</a></li>
          <li><a onClick={(e) => this.handleDownload(e, "macOS")}>macOS</a></li>
        </ul>
        {selectedFile && <p>{selectedFile} 다운로드가 시작됩니다...</p>}
      </div>
    );
  }
}

export default DownloadPage;
