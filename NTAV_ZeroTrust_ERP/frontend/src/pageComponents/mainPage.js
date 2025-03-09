import React, { Component } from "react";
import withRouter from "../hocs/withRouter";  // withRouter HOC 가져오기
import '../css/mainPage.css';  // 스타일 파일
import WholeHeaderBar from "./partialComponents/wholeHeaderBar";
import ProfileCard from "./partialComponents/profileCard";

// 일반 직원 페이지
class MainPage extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
  };

  handleLogoClick = () => {
    this.props.navigate('/main');
  };

  handlePasswordResetClick = () => {
    this.props.navigate('/passwordReset');  // 비밀번호 변경 페이지로 이동
  };

  render() {
    const { user } = this.state;
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
        <WholeHeaderBar handleLogoClick={this.handleLogoClick} />

        <div className="mainContent"> 
          <ProfileCard/>
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