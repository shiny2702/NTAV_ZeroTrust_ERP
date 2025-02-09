import React, { Component } from 'react';
import { sendInfoToServer, getDeviceToken } from '../api';
import withRouter from '../hocs/withRouter'; // withRouter HOC 가져오기
import LoadingBar from './loadingBar.js'; // LoadingBar 컴포넌트 가져오기
import '../CSS/loadingPage.css';

class LoadingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isVerified: true, // 서버에서 검증된 상태
    };
  }

  getOSInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    return "Unknown OS";
  };

  getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Brave") || userAgent.includes("OPR")) return "Brave";
    return "Unknown Browser";
  };

  getNetworkInfo = () => {
    const isOnline = navigator.onLine ? "Online" : "Offline";
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const networkType = connection ? connection.effectiveType : "Unknown";
    const downlink = connection ? connection.downlink : "Unknown";
    const rtt = connection ? connection.rtt : "Unknown";
    const saveData = connection ? connection.saveData : "Unknown";

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

  checkDeviceToken = async () => {
    const { navigate } = this.props;
    try {
      const token = await getDeviceToken(); // 서버에서 토큰 가져오기
      console.log("Device Token: ", token);
      if (!token) {
        console.warn("Device token not found, redirecting...");
        this.props.navigate("/noPerm"); // 토큰이 없으면 차단 페이지로 이동
      }
    } catch (error) {
      console.error("Error fetching device token: ", error);
      this.props.navigate("/error"); // 오류 발생 시 에러 페이지로 이동
    }
  };

  async initializeApp() {
    const osInfo = this.getOSInfo();
    const browserInfo = this.getBrowserInfo();
    const networkInfo = this.getNetworkInfo();

    console.log("OS Info: ", osInfo);
    console.log("Browser Info: ", browserInfo);
    console.log("Network Info: ", networkInfo);

    try {
      // 서버로 OS, 브라우저, 네트워크 정보 전송
      const response = await sendInfoToServer(osInfo, browserInfo, networkInfo); // 서버로 정보 전송
      console.log("Server Response: ", response);

      if (response.success) {
        // 서버에서 성공적인 검증을 받으면
        await this.checkDeviceToken(); // 서버에서 디바이스 토큰 확인
        this.setState({ loading: false, isVerified: true });
        this.props.navigate("/download"); // 검증 성공 후 downloadPage로 리디렉션
      } else {
        // 서버에서 검증 실패 응답 받으면
        this.setState({ loading: false, isVerified: false });
        this.props.navigate("/forbidden"); // 에러 페이지로 이동
      }
    } catch (error) {
      console.error("Error during initialization: ", error);
      this.setState({ loading: false });
      this.props.navigate("/error"); // 에러 페이지로 리디렉션
    }
  }

  async componentDidMount() {
    await this.initializeApp(); // 비동기 초기화 함수 실행
  }

  render() {
    const { loading, isVerified } = this.state;
    return (
      <div className="App">
        {loading ? (
          <div>
            <img src="../../public/ntav_loading.gif" alt="Loading..." /> 
            <p>Loading...</p> {/* You can add a message while loading */}
          </div>
        ) : isVerified ? (
          <header className="App-header">
            <p>You have entered NTAV's quarantine zone.</p>
          </header>
        ) : (
          <header className="App-header">
            <p>Verification failed. You are not authorized to proceed.</p>
          </header>
        )}
      </div>
    );
  }
  
}

export default withRouter(LoadingPage);
