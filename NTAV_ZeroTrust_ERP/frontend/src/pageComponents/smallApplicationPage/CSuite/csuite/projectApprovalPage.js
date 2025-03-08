import React, { Component } from "react";
import withRouter from "../../../../hocs/withRouter";  
import '../../../../css/projectApprovalPage.css';  
import WholeHeaderBar from "../../../partialComponents/wholeHeaderBar";

class ProjectApprovalPage extends Component {
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
                
              </div>
            </div>
          </div>
        );
      }

}

export default withRouter(ProjectApprovalPage);
