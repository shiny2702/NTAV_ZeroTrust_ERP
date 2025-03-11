import React, { Component } from 'react';
import { getDeviceToken, sendInfoToServer } from '../api';
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
    const networkType = connection ? connection.effectiveType : "Unknown";
    const downlink = connection ? connection.downlink : "Unknown";
    const rtt = connection ? connection.rtt : "Unknown";

    return {
      isOnline,
      networkType,
      downlink,
      rtt,
    };
  };

  async initializeApp() {
    if (this.initialized) return;
    this.initialized = true;

    const steps = [
      { progress: 10, statusMessage: "Gathering OS info...", action: this.getOSInfo },
      { progress: 30, statusMessage: "Gathering browser info...", action: this.getBrowserInfo },
      { progress: 50, statusMessage: "Gathering network info...", action: this.getNetworkInfo },
      { progress: 70, statusMessage: "Sending data to server...", action: async () => sendInfoToServer(this.getOSInfo(), this.getBrowserInfo(), this.getNetworkInfo()) },
      { progress: 80, statusMessage: "Processing server response...", action: async () => {} },
      { progress: 90, statusMessage: "Generating device token...", action: getDeviceToken }
    ];

    try {
      let response;
      let deviceToken;
      for (let step of steps) {
        this.setState({ progress: step.progress, statusMessage: step.statusMessage });
        await new Promise(resolve => setTimeout(resolve, 500));
        if (step.progress === 70) response = await step.action();
        if (step.progress === 90) deviceToken = await step.action();
      }

      if (response?.success) {
        this.setState({ progress: 100, isVerified: true, deviceToken, statusMessage: "Verification complete!" }, () => {
          setTimeout(() => this.props.navigate("/exe-download"), 1000);
        });
      } else {
        this.setState({ progress: 100, isVerified: false, statusMessage: "Verification failed." }, () => {
          setTimeout(() => this.props.navigate("/forbidden"), 4000);
        });
      }
    } catch (error) {
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
        <img src="ntav_loading.gif" alt="Loading..." />
        <div className="milestone-container" style={{ display: 'flex', justifyContent: 'space-between', width: '40%', margin: '10px auto' }}>
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

export default withRouter(LoadingPage);