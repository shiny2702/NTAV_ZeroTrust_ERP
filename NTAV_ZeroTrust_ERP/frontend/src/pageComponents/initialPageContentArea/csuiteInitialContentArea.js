import React, { Component } from "react";
import withRouter from "../../hocs/withRouter";  
import '../../css/csuiteInitialContentArea.css';  

class CSuiteInitialContentArea extends Component {
    handleProjectApprovalClick = () => {
        this.props.navigate('projectApproval');
    };

    render() {
        const { waitingForApprovalProjects, approvedOngoingProjects, approvedEndedProjects, rejectedProjects } = this.props;

        return (
            <div className="projectApprovalSection">
              <button className="projectApprovalButton" onClick={this.handleProjectApprovalClick}>
                프로젝트 결재 ‣
              </button>

              <div className="approvalStatus">
                <div className="waitingForApprovalProjects">
                  <h4>결재 대기중</h4>
                  <ul>
                    {waitingForApprovalProjects.map((project) => (
                      <li key={project.no}>{project.name} | {project.created_at}</li>
                    ))}
                  </ul>
                </div>

                <div className="divider"></div>

                <div className="approvedOngoingProjects">
                <h4>진행중인 프로젝트</h4>
                <ul>
                    {approvedOngoingProjects.map((project) => (
                    <li key={project.no}>{project.name} | {project.start_date} | {project.status}</li>
                    ))}
                </ul>
                </div>
            </div>
            </div>
        )
}

}

export default withRouter(CSuiteInitialContentArea);