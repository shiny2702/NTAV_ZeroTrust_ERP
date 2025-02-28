import React, { Component } from 'react';
import { sendInfoToServer } from '../api';
import withRouter from '../hocs/withRouter';
import '../css/loadingPage.css';

class LoadingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isVerified: false,
      error: null,
    };
    this.initialized = false;
  }

  // OS 정보 추출
  getOSInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    return "Unknown OS";
  };

  // 브라우저 정보 추출
  getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Brave") || userAgent.includes("OPR")) return "Brave";
    return "Unknown Browser";
  };

  // 네트워크 정보 추출
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

  // 앱 초기화 처리
  async initializeApp() {
    if (this.initialized) return;
    this.initialized = true;

    // 2초 대기 후 실행
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.setState({ loading: true, error: null });

    const osInfo = this.getOSInfo();
    const browserInfo = this.getBrowserInfo();
    const networkInfo = this.getNetworkInfo();

    console.log("OS Info: ", osInfo);
    console.log("Browser Info: ", browserInfo);
    console.log("Network Info: ", networkInfo);

    try {
      const response = await sendInfoToServer(osInfo, browserInfo, networkInfo);
      console.log("Server Response: ", response);

      this.setState(
        {
          loading: false,
          isVerified: response.success,
        },
        () => {
          // 상태가 변경된 후에 navigate 호출
          if (this.state.isVerified) {
            console.log("Verification successful. Navigating to /exe-download");          
            // 1.5초 후에 navigate 호출
            setTimeout(() => {
              this.props.navigate("/exe-download");
            }, 1500); 
          } else {
            console.log("Verification failed. Navigating to /forbidden");
            // 1.5초 후에 navigate 호출
            setTimeout(() => {
              this.props.navigate("/forbidden");
            }, 4000); 
          }
        }
      );
    } catch (error) {
      console.error("Error during initialization: ", error);
      this.setState({ loading: false, error: 'Initialization failed' });
    }
  }

  // componentDidMount에서 초기화 호출
  componentDidMount() {
    if (this.state.loading && !this.initialized) {
      this.initializeApp();
    }
  }

  render() {
    const { loading, isVerified } = this.state;

    if (loading) {
      return (
        <div className="loading-container">
          <img src="ntav_loading.gif" alt="Loading..." />
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="App">
        {isVerified ? (
          <div className="loading-container">
          <img src="ntav_loading.gif" alt="Loading..." />
          <p>You have entered NTAV's quarantine zone.</p>
        </div>
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







