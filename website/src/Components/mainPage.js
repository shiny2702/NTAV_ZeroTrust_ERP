import React, { Component } from "react";
import withRouter from "../withRouter";  // withRouter HOC 가져오기
import './mainPage.css';  // 스타일 파일

class MainPage extends Component {
  // 로그아웃 모달 상태 관리
  state = {
    showLogoutModal: false,  // 로그아웃 모달을 표시할지 여부
  };

  // 로그아웃 버튼 클릭 시 모달을 표시
  handleLogoutClick = () => {
    this.setState({ showLogoutModal: true });
  };

  // 로그아웃 확인 후 동작
  handleLogoutConfirmation = (confirm) => {
    if (confirm) {
      // YES 클릭 시 로그인 페이지로 리디렉션
      this.props.navigate('/'); // navigate를 사용하여 로그인 페이지로 리디렉션
    } else {
      // NO 클릭 시 모달을 닫음
      this.setState({ showLogoutModal: false });
    }
  };

  // 로고 클릭 시 /main 페이지로 리디렉션
  handleLogoClick = () => {
    this.props.navigate('/main');
  };

  render() {
    const { showLogoutModal } = this.state;

    // `navigate`를 통해 전달된 사용자 데이터 받기
    const { user } = this.props.location.state || {};  // 기본값 처리
    console.log("받은 사용자 데이터:", user);

    return (
      <div className="mainPage">
        <div className="header">
          <div className="logo" onClick={this.handleLogoClick}>NTAV</div>
          <nav className="menu">
            <ul>
              <li>경영</li>
              <li>재무회계</li>
              <li>인사</li>
              <li>고객관리</li>
              <li>물류관리</li>
            </ul>
          </nav>
          <button className="logoutButton" onClick={this.handleLogoutClick}>
            로그아웃
          </button>
        </div>

        {/* 로그아웃 확인 모달 */}
        {showLogoutModal && (
          <div className="logoutModal">
            <div className="modalContent">
              <p>로그아웃 하시겠습니까?</p>
              <button onClick={() => this.handleLogoutConfirmation(true)}>YES</button>
              <button onClick={() => this.handleLogoutConfirmation(false)}>NO</button>
            </div>
          </div>
        )}

        <div className="mainContent">
          <h1>"메인 페이지"</h1>
          <p>{user && user.name ? `${user.name}님 전용 페이지입니다.` : "user님 전용 페이지입니다."}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(MainPage);  // withRouter로 감싸기


