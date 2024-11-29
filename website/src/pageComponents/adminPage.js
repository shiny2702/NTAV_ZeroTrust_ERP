import React, { Component } from "react";
import withRouter from "../hocs/withRouter";  
import '../CSS/adminPage.css';  

class AdminPage extends Component {
  state = {
    showLogoutModal: false,  // 로그아웃 모달을 표시할지 여부
  };

  handleLogoutClick = () => {
    this.setState({ showLogoutModal: true });
  };

  // 로그아웃 확인 후 동작
  handleLogoutConfirmation = (confirm) => {
    if (confirm) { // YES 클릭 시 로그인 페이지로 리디렉션
      this.props.navigate('/');
    } else { // NO 클릭 시 모달을 닫음
      this.setState({ showLogoutModal: false });
    }
  };

  handleLogoClick = () => {   // 로고 클릭 시 /main 페이지로 리디렉션
    this.props.navigate('/admin');
  };


  render() {
    const { showLogoutModal } = this.state;

    // `navigate`를 통해 전달된 사용자 데이터 받기
    const { user } = this.props.location.state || {}; 
    console.log("받은 사용자 데이터:", user);

    return (
      <div className="adminPage">
        <div className="header">
          <div className="logo" onClick={this.handleLogoClick}>NTAV</div>
          <nav className="menu">
            <ul>
              <li>경영</li>
              <li>재무회계</li>
              <li>인사</li>
              <li>고객관리</li>
              <li>물류관리</li>
              <li className="dropdown">관리기능 ▾
                <ul className="dropdown-menu">
                  <li>직원관리</li>
                  <li>권한관리</li>
                  <li>로그관리</li>
                  <li>프로젝트할당관리</li>
                </ul>
              </li>
            </ul>
          </nav>
          <button className="logoutButton" onClick={this.handleLogoutClick}>
            Logout
          </button>
        </div>

        {showLogoutModal && (
          <div className="logoutModal">
            <div className="modalContent">
              <p>로그아웃 하시겠습니까?</p>
              <button onClick={() => this.handleLogoutConfirmation(true)}>YES</button>
              <button onClick={() => this.handleLogoutConfirmation(false)}>NO</button>
            </div>
          </div>
        )}

        <div className="adminContent">        
            <div className="profileCard">
              <div className="profileImage"></div> {/* 프로필 이미지 자리 */}
              <h3>{user ? user.name : "사용자 이름"}</h3>
              <p>{user ? `E-mail :: ${user.email}` : "이메일 주소"}</p>
              <p>{user ? `Dept :: ${user.dept}` : "부서 정보"}</p>
              <p>{user ? `Role :: ${user.role}` : "직급"}</p>
            </div>           
        </div>
      </div>
    );
  }
}

export default withRouter(AdminPage);  // withRouter로 wrap