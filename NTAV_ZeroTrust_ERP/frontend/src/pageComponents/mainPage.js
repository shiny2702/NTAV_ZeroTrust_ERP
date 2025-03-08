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
              <li className="dropdown">경영 ▾
                <div className="dropdown-menu">
                  <div className="dropdown-column">
                    <h3>영업</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>영업목표</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>성과평가</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>고객(B2B)관리</li>
                    </ul>
                  </div>
                  <div className="dropdown-divider"></div> {/* 세로 구분선 */}
                  <div className="dropdown-column">
                    <h3>기획</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>영업전략기획</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>신제품/서비스기획</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>시장조사</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
                    </ul>
                  </div>
                  <div className="dropdown-divider"></div> {/* 세로 구분선 */}
                  <div className="dropdown-column">
                    <h3>운영</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("directOperation")}>직영점관리</li>
                      <li onClick={() => this.handleMenuClick("directOperation")}>메뉴관리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>매출분석및보고</li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="dropdown">재무회계 ▾
                <div className="dropdown-menu">
                  <div className="dropdown-column">
                    <h3>재무</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>재무계획수립</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>예산관리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>재무데이터분석</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>재무요청</li>
                    </ul>
                  </div>
                  <div className="dropdown-divider"></div> {/* 세로 구분선 */}
                  <div className="dropdown-column">
                    <h3>회계</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("directOperation")}>회계기록유지</li>    {/* 모든 돈관련 ,, 월급까지 */}
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>세무관리</li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="dropdown">인사 ▾
                <div className="dropdown-menu">
                  <div className="dropdown-column">
                    <h3>HR정책</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>인사정책수립</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>휴가정책수립</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>조직구성관리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>직원교육</li>
                    </ul>
                  </div>
                  <div className="dropdown-divider"></div> {/* 세로 구분선 */}
                  <div className="dropdown-column">
                    <h3>인사관리</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("directOperation")}>채용관리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>인력지원</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>급여관리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>근태관리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>성과평가</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="dropdown">마케팅 ▾
                <div className="dropdown-menu">
                  <div className="dropdown-column">
                    <h3>마케팅</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅시장조사</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅전략개발</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅캠페인</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>마케팅성과평가</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="dropdown">고객관리 ▾
                <div className="dropdown-menu">
                  <div className="dropdown-column">
                    <h3>고객서비스</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("directOperation")}>서비스정책수립</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>회원관리</li>
                      <li onClick={() => this.handleMenuClick("directOperation")}>고객요청및피드백수집</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>고객요청및피드백분석</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="dropdown">물류 ▾
                <div className="dropdown-menu">
                  <div className="dropdown-column">
                    <h3>공급망관리</h3>
                    <ul> 
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>공급업체관리</li>  {/* contract도 */}
                      <li onClick={() => this.handleMenuClick("directOperation")}>배송업체관리</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>구매전략수립</li>
                      <li onClick={() => this.handleMenuClick("salesStrategy")}>비용처리</li>
                    </ul>
                  </div>
                  <div className="dropdown-divider"></div> {/* 세로 구분선 */}
                  <div className="dropdown-column">
                    <h3>물류</h3>
                    <ul>
                      <li onClick={() => this.handleMenuClick("directOperation")}>제품관리</li>
                      <li onClick={() => this.handleMenuClick("directOperation")}>주문/배송관리</li>
                      <li onClick={() => this.handleMenuClick("directOperation")}>품질/재고관리</li>
                    </ul>
                  </div>
                </div>
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