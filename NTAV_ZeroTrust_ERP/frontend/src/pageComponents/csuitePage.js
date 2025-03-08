import React, { Component } from "react";
import withRouter from "../hocs/withRouter";  
import '../css/csuitePage.css';  
import WholeHeaderBar from "./partialComponents/wholeHeaderBar";

// 경영진 페이지
class CSuitePage extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    approvedProjects: [
      { id: 1, name: '프로젝트 A', approvalDate: '2025-03-01' },
      { id: 2, name: '프로젝트 B', approvalDate: '2025-02-20' }
    ],
    unapprovedProjects: [
      { id: 3, name: '프로젝트 C', approvalDate: null },
      { id: 4, name: '프로젝트 D', approvalDate: null }
    ]
  };

  handleLogoClick = () => {
    this.props.navigate('/csuite');
  };

  handlePasswordResetClick = () => {
    this.props.navigate('/passwordReset');
  };

  handleProjectApprovalClick = () => {
    this.props.navigate('/projectApproval');
  };

  render() {
    const { user, approvedProjects, unapprovedProjects } = this.state;

    return (
      <div className="csuitePage">
        <WholeHeaderBar />

        <div className="adminContent">
          <div className="profileCard">
            <div className="profileImage"></div>
            <h3>{user ? `${user.username}` : "사용자 이름"}</h3>
            <div className="profileDetails">
              <p>{user ? `E-mail :: ${user.email}` : "E-mail :: 이메일 주소"}</p>
              <p>{user ? `Dept :: ${user.dept}` : "Dept :: 부서 정보"}</p>
              <p>{user ? `Role :: ${user.role}` : "Role :: 직급"}</p>
            </div>
            <button className="passwordResetLink" onClick={this.handlePasswordResetClick}>
              비밀번호 변경
            </button>
          </div>

          <div className="contentArea">
            <div className="projectApprovalSection">
              <button className="projectApprovalButton" onClick={this.handleProjectApprovalClick}>
                프로젝트 결재 ‣
              </button>

              <div className="approvalStatus">
                <div className="approvedProjects">
                  <h4>결재 완료</h4>
                  <ul>
                    {approvedProjects.map((project) => (
                      <li key={project.id}>{project.name} - {project.approvalDate}</li>
                    ))}
                  </ul>
                </div>

                <div className="divider"></div>

                <div className="unapprovedProjects">
                  <h4>결재 미완료</h4>
                  <ul>
                    {unapprovedProjects.map((project) => (
                      <li key={project.id}>{project.name} - 대기 중</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CSuitePage);
