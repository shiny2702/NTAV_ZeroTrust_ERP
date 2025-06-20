import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      progress: 0, // 로딩 진행 상태
      statusMessage: "Initializing..."
    };
    this.initialized = false;
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
    return "Unknown Browser";
  };

  getNetworkInfo = () => {
    const isOnline = navigator.onLine ? "Online" : "Offline";
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    let networkType = "Unknown";
    let downlink = "Unknown";
    let rtt = "Unknown";

    if (connection) {
      networkType = connection.effectiveType || "Unknown";
      downlink = connection.downlink || "Unknown";
      rtt = connection.rtt || "Unknown";
    }

    return { isOnline, networkType, downlink, rtt };
  };

  async initializeApp() {
    if (this.initialized) return;
    this.initialized = true;
  
    try {
      let response = null;
      let message = "";
      //let deviceToken = null;
  
      const steps = [
        { progress: 10, statusMessage: "Gathering OS info...", action: this.getOSInfo },
        { progress: 30, statusMessage: "Gathering browser info...", action: this.getBrowserInfo },
        { progress: 50, statusMessage: "Gathering network info...", action: this.getNetworkInfo },
        { progress: 70, statusMessage: "Sending data to server...", action: async () => {
            console.log("🔹 서버로 데이터 전송 중...");
            response = await sendInfoToServer(this.getOSInfo(), this.getBrowserInfo(), this.getNetworkInfo());
            console.log("🔹 서버 응답:", response);
            return response;
        }},
        { progress: 80, statusMessage: "Processing server response...", action: async () => {
            if (!response?.success) {
                console.error("🚨 서버 검증 실패:", response);
                throw new Error("Server verification failed");
            }
            return response;
        }},
        { progress: 90, statusMessage: "Generating device token...", action: async () => {
          if (response?.success) {
            //deviceToken = await getDeviceToken();
            message = response.message;
            return message;
          } else {
            throw new Error("Device token generation skipped due to failed verification");
          }
        }}
      ];
  
      for (let step of steps) {
        console.log(`✅ [${step.progress}%] ${step.statusMessage}`);
        this.setState({ progress: step.progress, statusMessage: step.statusMessage });
        await new Promise(resolve => setTimeout(resolve, 500));
  
        try {
          await step.action();
        } catch (error) {
          console.error(`❌ Error at step ${step.progress}:`, error.message);
          this.setState({ progress: 100, isVerified: false, statusMessage: "Verification failed." });
          setTimeout(() => this.props.navigate("/forbidden"), 3000);
          return;
        }
      }
  
      this.setState(
        { progress: 100, isVerified: true, message, statusMessage: "Verification complete!" },
        () => this.props.navigate("/exe-download")
      );
  
    } catch (error) {
      console.error("❌ Error during initialization:", error);
      this.setState({ loading: false, error: "Initialization failed", statusMessage: "Error occurred." });
    }
  }
  

  componentDidMount() {
    if (this.state.loading && !this.initialized) {
      this.initializeApp();
    }
  }

  render() {
    const { progress, statusMessage } = this.state;
    const milestones = [10, 30, 50, 70, 80, 90];

    return (
      <div className="loading-container">
        <img src="/quarantine-frontend/ntav_loading.gif" alt="Loading..." />
        <div className="milestone-container" style={{ display: 'flex', justifyContent: 'space-between', width: '40%', margin: '0 auto 10px auto' }}>
          {milestones.map((milestone, index) => (
            <span key={index} className={`milestone ${progress >= milestone ? 'checked' : ''}`} style={{ margin: '0 10px' }}>
              {progress >= milestone ? '✔' : '○'}
            </span>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{statusMessage} ({progress}%)</p>
      </div>
    );
  }
}

LoadingPage.propTypes = {
  navigate: PropTypes.func.isRequired, // navigate 추가
};

export default withRouter(LoadingPage);
