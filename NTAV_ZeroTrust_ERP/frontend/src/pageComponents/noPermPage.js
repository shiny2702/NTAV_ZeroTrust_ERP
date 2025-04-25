import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import

const NoPermPage = () => {
  const navigate = useNavigate(); // navigate 함수 생성

  const containerStyle = {
    width: "60%",
    margin: "5% auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  };

  const lineStyle = {
    border: "none",
    borderTop: "1px solid #ccc",
    margin: "20px auto",
    width: "80%",
  };

  const linkStyle = {
    color: "#007bff",
    textDecoration: "none",
    cursor: "pointer", // 마우스 커서가 링크 모양으로 변경
  };

  // 로그인 페이지로 이동하는 함수
  const handleRedirect = () => {
    navigate("/"); // /login으로 리디렉션
  };

  return (
    <div style={containerStyle}>
      <h1>접근 권한 없음</h1>
      <hr style={lineStyle} />
      <p>죄송합니다. 이 페이지에 접근할 권한이 없습니다.</p>
      <span style={linkStyle} onClick={handleRedirect}>로그인 페이지로 이동하기</span> {/* 클릭 시 handleRedirect 호출 */}
    </div>
  );
};

export default NoPermPage;


