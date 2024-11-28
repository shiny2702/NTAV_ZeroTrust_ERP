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

    const lineStyle = {
      border: "none",
      borderTop: "1px solid #ccc",
      marginTop: "30px", // 위쪽 간격
      marginBottom: "30px", // 아래쪽 간격
      width: "98%", // 줄의 가로 길이
      marginLeft: "0", // 왼쪽 정렬
    };

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
            Logout
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
          <div className="profileCard">
            <div className="profileImage"></div> {/* 프로필 이미지 자리 */}
            <h3>{user ? user.name : "사용자 이름"}</h3>
            <p>{user ? `E-mail :: ${user.email}` : "이메일 주소"}</p>
            <p>{user ? `Dept :: ${user.dept}` : "부서 정보"}</p>
            <p>{user ? `Role :: ${user.role}` : "직급"}</p>
          </div> 

          <div className="dashboard">
            <h3>{user ? `${user.name}'s Dashboard` : "사용자 대시보드"}</h3>
            <hr style={lineStyle} /> {/* h1 아래 줄 추가 */}
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
                      <td>{index + 1}</td> {/* Number 열 */}
                      <td>
                        <a
                          className="projectLink"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // 링크 기본 동작 방지
                            this.handleProjectClick(project); // 기존 기능 유지
                          }}
                        >
                          {project} {/* Project Name 열 */}
                        </a>
                      </td>
                      <td></td> {/* Description 열 */}
                      <td></td> {/* Team Members 열 */}
                      <td></td> {/* Start Date 열 */}
                      <td></td> {/* End Date 열 */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No ongoing projects available.</td> {/* 빈 테이블 메시지 */}
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


