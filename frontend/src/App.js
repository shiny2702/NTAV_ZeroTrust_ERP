import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  // OS 정보 수집집
  const getOSInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("like Mac")) return "iOS";
    return "Unknown OS";
  };
  console.log(getOSInfo());

  // 브라우저 정보 수집
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    return "Unknown Browser";
  };
  console.log(getBrowserInfo());

  // 네트워크 정보
  const getNetworkInfo = () => {
    const isOnline = navigator.onLine ? "Online" : "Offline";
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const networkType = connection ? connection.effectiveType : "Unknown";

    return { isOnline, networkType };
  };

  // 보안 소프트웨어 확인은 프론트엔드에서 불가능

  // 정보 전송 로직
  useEffect(() => {
    const sendInfoToServer = async () => {
      const osInfo = getOSInfo();
      const browserInfo = getBrowserInfo();
      const networkInfo = getNetworkInfo();

      const payload = {
        os: osInfo,
        browser: browserInfo,
        network: networkInfo,
        // 보안 소프트웨어 관련 정보는 별도로 추가 필요
      };

      try {
        const response = await fetch('https://your-backend-endpoint.com/collect-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log("Data sent successfully");
        } else {
          console.error("Failed to send data");
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };
    sendInfoToServer();
  }, []);

  // 로딩바
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // 로딩 상태를 3초 후에 false로 설정
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  }, []);

  return (
    <div className="App">
      {loading ? (
        <div className="loading-container">
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <p>Loading...</p>
        </div>
      ) : (
        <header className="App-header">
          <p>You have entered NTAV's quarantine zone.</p>
        </header>
      )}
    </div>
  );
}

export default App;
