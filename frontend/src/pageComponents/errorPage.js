import React, { Component } from "react";

class ErrorPage extends Component {
  render() {
    const containerStyle = {
      width: "60%", // 박스의 가로 크기 (조정 가능)
      margin: "5% auto", // 화면 중앙 정렬
      padding: "20px", // 내부 여백
      border: "1px solid #ccc", // 테두리
      borderRadius: "10px", // 둥근 모서리
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 그림자 효과
      backgroundColor: "#f9f9f9", // 배경색
      textAlign: "center", // 텍스트 가운데 정렬
    };

    const lineStyle = {
      border: "none",
      borderTop: "1px solid #ccc",
      margin: "20px auto", // 상하 간격
      width: "80%", // 줄의 가로 길이
    };

    const linkStyle = {
      color: "#007bff", // 링크 색상
      textDecoration: "none", // 밑줄 제거
    };

    return (
      <div style={containerStyle}>
        <hr style={lineStyle} /> {/* h1 아래 줄 추가 */}
        <p>Error</p>
      </div>
    );
  }
}

export default ErrorPage;

