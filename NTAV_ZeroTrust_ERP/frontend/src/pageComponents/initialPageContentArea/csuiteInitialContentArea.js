import React, { Component } from "react";
import withRouter from "../../hocs/withRouter";  
import '../../css/csuiteInitialContentArea.css';  

class CSuiteInitialContentArea extends Component {
    handleProjectApprovalClick = () => {
        this.props.navigate('projectApproval');
    };

    render() {
        const { approvedProjects, unapprovedProjects } = this.props;

        return (
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
        )
}

}

export default withRouter(CSuiteInitialContentArea);