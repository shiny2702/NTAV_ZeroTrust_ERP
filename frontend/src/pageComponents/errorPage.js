import React, { Component } from "react";
import "../CSS/forbiddenPage.css"; // CSS 파일을 임포트

class ErrorPage extends Component {
  render() {
    return (
      <div className="no-perm-container">
        <h1>Error</h1>
        <hr className="no-perm-line" /> {/* h1 아래 줄 추가 */}
      </div>
    );
  }
}

export default ErrorPage;
