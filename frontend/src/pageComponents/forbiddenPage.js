import React, { Component } from "react";
import "../CSS/forbiddenPage.css"; // CSS 파일을 임포트

class ForbiddenPage extends Component {
  render() {
    return (
      <div className="no-perm-container">
        <h1>Access Denied</h1>
        <hr className="no-perm-line" /> {/* h1 아래 줄 추가 */}
        <p>죄송합니다. 이 페이지에 접근할 권한이 없습니다.</p>
      </div>
    );
  }
}

export default ForbiddenPage;
