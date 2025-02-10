import React, { Component } from "react";
import withRouter from "../hocs/withRouter";  // withRouter HOC 가져오기
import '../css/mainPage.css';  // 스타일 파일

class MainPage extends Component {
  state = {
    showLogoutModal: false,  // 로그아웃 모달을 표시할지 여부
    user: JSON.parse(localStorage.getItem('user')) || null,
  };

  handleLogoutClick = () => {
    this.setState({ showLogoutModal: true });
  };

  // 로그아웃 확인 후 동작
  handleLogoutConfirmation = (confirm) => {
    if (confirm) { // YES 클릭 시 로그인 페이지로 리디렉션
      localStorage.removeItem('user'); // 로그아웃 시 localStorage에서 사용자 정보 삭제
      localStorage.removeItem('token');
      this.props.navigate('/');
    } else { // NO 클릭 시 모달을 닫음
      this.setState({ showLogoutModal: false });
    }
  };

  handleLogoClick = () => {
    this.props.navigate('/main');
  };

  handlePasswordResetClick = () => {
    this.props.navigate('/passwordReset');  // 비밀번호 변경 페이지로 이동
  };

  render() {
    const { showLogoutModal, user } = this.state;

    // `navigate`를 통해 전달된 사용자 데이터 받기
    console.log("받은 사용자 데이터:", user);

    const lineStyle = {
      border: "none",
      borderTop: "1px solid #ccc",
      marginTop: "30px", 
      marginBottom: "30px", 
      width: "98%", 
      marginLeft: "0", 
    };

    return (
      <div className="mainPage">
        <div className="header">
          <div className="logo" onClick={this.handleLogoClick}>NTAV</div>
          <nav className="menu">
            <ul>
              <li>경영</li>
              <li>재무회계</li>
              <li className="dropdown">인사 ▾
                <ul className="dropdown-menu">
                  <li>채용관리</li>
                  <li>HR데이터분석및리포팅</li>
                  <li>급여관리</li>
                  <li>복리후생관리</li>
                </ul>
              </li>
              <li>고객관리</li>
              <li>물류관리</li>
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

        <div className="mainContent">
          <div className="profileCard">
            <div className="profileImage"></div> {/* 프로필 이미지 자리 */}
            <h3>{user ? `${user.username}` : "사용자 이름"}</h3>
            <div className="profileDetails">
              <p>{user ? `E-mail :: ${user.email}` : "E-mail :: 이메일 주소"}</p>
              <p>{user ? `Dept :: ${user.dept}` : "Dept :: 부서 정보"}</p>
              <p>{user ? `Role :: ${user.role}` : "Role :: 직급"}</p>
            </div>
            <button className="passwordResetLink" onClick={this.handlePasswordResetClick}>
              비밀번호 변경
            </button> {/* 비밀번호 변경 링크 */}
          </div> 

          <div className="dashboard">
            <h3>{user ? `${user.username}'s Dashboard` : "사용자 대시보드"}</h3>
            <hr style={lineStyle} /> 
            <table className="projectTable">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {user && user.projects && user.projects.length > 0 ? (
                  user.projects.map((project, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td> 
                      <td>
                        <a
                          className="projectLink"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // 링크 기본 동작 방지
                            this.handleProjectClick(project); // 기존 기능 유지
                          }}
                        >
                          {project} 
                        </a>
                      </td>
                      <td></td> 
                      <td></td> 
                      <td></td> 
                      <td></td> 
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No ongoing projects available.</td> 
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MainPage);  // withRouter로 감싸기



