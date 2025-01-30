import React, { Component } from 'react';
import { sendInfoToServer } from './api';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    // 초기 상태 설정
    this.state = {
      loading: true,
    };
  }

  // OS 정보 수집
  getOSInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    // if (userAgent.includes("Android")) return "Android";
    // if (userAgent.includes("like Mac")) return "iOS";
    return "Unknown OS";
  };

  // 브라우저 정보 수집
  getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    return "Unknown Browser";
  };

  // 네트워크 정보 수집
  getNetworkInfo = () => {
    const getNetworkInfo = () => {
      const isOnline = navigator.onLine ? "Online" : "Offline";
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const networkType = connection ? connection.effectiveType : "Unknown";
      const downlink = connection ? connection.downlink : "Unknown";
      const rtt = connection ? connection.rtt : "Unknown";
      const saveData = connection ? connection.saveData : "Unknown";
    
      // IP 주소 확인 (외부 API 사용)
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          console.log("IP Address: ", data.ip);
        })
        .catch(error => console.error("Error fetching IP: ", error));
    
      return {
        isOnline,
        networkType,
        downlink,
        rtt,
        saveData,
      };
    };
  };

  // 보안 소프트웨어 확인은 프론트엔드에서 불가능
  // 보안 소프트웨어 관련 정보는 별도로 추가 필요

  // 컴포넌트가 마운트될 때 실행되는 메서드
  // 비동기 함수 async/await의 사용으로 네트워크 요청이 완료될 때까지 다른 코드 실행 X
  // sendInfoToServer(네트워크 요청을 보내는 비동기 작업)가 완료될 때까지 기다림
  async componentDidMount() {
      const osInfo = this.getOSInfo();
      const browserInfo = this.getBrowserInfo();
      const networkInfo = this.getNetworkInfo();

      // 콘솔에 정보 출력
      console.log("OS Info: ", osInfo);
      console.log("Browser Info: ", browserInfo);
      console.log("Network Info: ", networkInfo);

      // sendInfoToServer 호출하며 수집한 정보 전달
      await sendInfoToServer(osInfo, browserInfo, networkInfo);

      // 로딩 상태를 1.5초 후에 false로 설정정
      setTimeout(() => {
        this.setState({ loading: false });
      }, 1500);
    }

    render() {
      const { loading } = this.state;
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
};

export default App;
