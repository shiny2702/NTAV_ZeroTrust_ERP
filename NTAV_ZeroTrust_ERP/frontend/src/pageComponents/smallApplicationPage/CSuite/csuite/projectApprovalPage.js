import React, { Component } from "react";
import withRouter from "../../../../hocs/withRouter";  
import '../../../../css/projectApprovalPage.css';  
import ApprovalWorkspace from "./workspace/approvalWorkspace";
import UpdateWorkspace from "./workspace/updateWorkspace";
import ReadOnlyWorkspace from "./workspace/readOnlyWorkspace";  
import NoneSelectedWorkspace from "./workspace/noneSelectedWorkspace";  

class ProjectApprovalPage extends Component {
    state = {
        viewMode: 'all', // 'all', 'approved', 'unapproved' 중 하나
        selectedProjectId: null, // 선택된 프로젝트 ID
    };

    handleViewChange = (viewMode) => {
        this.setState((prevState) => {
            const { selectedProjectId } = prevState;
            const { waitingForApprovalProjects, approvedOngoingProjects, approvedEndedProjects, rejectedProjects } = this.props;
            
            if (
                (viewMode === 'waitingForApprovalProjects' || viewMode === 'approvedOngoingProjects' || viewMode === 'approvedEndedProjects') &&
                rejectedProjects.some(project => project.no === selectedProjectId)
              ) {
                return { viewMode, selectedProjectId: null };
              }

            if (
                (viewMode === 'waitingForApprovalProjects' || viewMode === 'approvedOngoingProjects' || viewMode === 'rejectedProjects') &&
                approvedEndedProjects.some(project => project.no === selectedProjectId)
              ) {
                return { viewMode, selectedProjectId: null };
              }

            if (
                (viewMode === 'waitingForApprovalProjects' || viewMode === 'approvedEndedProjects' || viewMode === 'rejectedProjects') &&
                approvedOngoingProjects.some(project => project.no === selectedProjectId)
              ) {
                return { viewMode, selectedProjectId: null };
              }

            if (
                (viewMode === 'approvedOngoingProjects' || viewMode === 'approvedEndedProjects' || viewMode === 'rejectedProjects') &&
                waitingForApprovalProjects.some(project => project.no === selectedProjectId)
              ) {
                return { viewMode, selectedProjectId: null };
              }
    
            return { viewMode };
        });
    };

    handleProjectClick = (projectId) => {
        // 프로젝트 클릭 시 해당 프로젝트를 선택하거나 선택 해제
        this.setState((prevState) => ({
            selectedProjectId: prevState.selectedProjectId === projectId ? null : projectId,
        }));
    };

    render() {
        const { waitingForApprovalProjects, approvedOngoingProjects, approvedEndedProjects, rejectedProjects } = this.props;
        const { viewMode, selectedProjectId } = this.state;

        // 필터링된 프로젝트 목록
        let filteredProjects = [];
        if (viewMode === 'waitingForApprovalProjects') {
            filteredProjects = waitingForApprovalProjects;
        } else if (viewMode === 'approvedOngoingProjects') {
            filteredProjects = approvedOngoingProjects;
        } else if (viewMode === 'approvedEndedProjects') {
            filteredProjects = approvedEndedProjects;
        } else if (viewMode === 'rejectedProjects') {
            filteredProjects = rejectedProjects;
        } else {
            filteredProjects = [...waitingForApprovalProjects, ...approvedOngoingProjects, ...approvedEndedProjects, ...rejectedProjects];
        }

        // 선택된 프로젝트 ID가 null일 때, 결재완료 프로젝트, 결재미완료 프로젝트 구분
        const selectedProject = filteredProjects.find(project => project.no === selectedProjectId);

        return (
            <div className="projectApprovalPage">
                <div className="sidebar">
                    <div className="buttonContainer">
                        <button 
                            className={`viewButton ${viewMode === 'waitingForApprovalProjects' ? 'active' : ''}`}
                            onClick={() => this.handleViewChange('waitingForApprovalProjects')}
                        >
                            결재대기건
                        </button>
                        <button 
                            className={`viewButton ${viewMode === 'approvedOngoingProjects' ? 'active' : ''}`}
                            onClick={() => this.handleViewChange('approvedOngoingProjects')}
                        >
                            진행건
                        </button>
                        <button 
                            className={`viewButton ${viewMode === 'approvedEndedProjects' ? 'active' : ''}`}
                            onClick={() => this.handleViewChange('approvedEndedProjects')}
                        >
                            종료건
                        </button>
                        <button 
                            className={`viewButton ${viewMode === 'rejectedProjects' ? 'active' : ''}`}
                            onClick={() => this.handleViewChange('rejectedProjects')}
                        >
                            반려건
                        </button>
                        <button 
                            className={`viewButton ${viewMode === 'all' ? 'active' : ''}`}
                            onClick={() => this.handleViewChange('all')}
                        >
                            전체보기
                        </button>
                    </div>

                    <div className="sidebar-separator"></div>

                    <div className="projectList">
                        {filteredProjects.map((project, index) => {
                            let projectStatus = '';

                            if (waitingForApprovalProjects.some(p => p.no === project.no)) {
                                projectStatus = 'waitingForApproval';
                            } else if (approvedOngoingProjects.some(p => p.no === project.no)) {
                                projectStatus = 'approvedOngoing';
                            } else if (approvedEndedProjects.some(p => p.no === project.no)) {
                                projectStatus = 'approvedEnded';
                            } else if (rejectedProjects.some(p => p.no === project.no)) {
                                projectStatus = 'rejected';
                            }

                            return (
                                <button
                                    key={project.no}
                                    className={`projectItem ${projectStatus} ${selectedProjectId === project.no ? 'selected' : ''}`}
                                    onClick={() => this.handleProjectClick(project.no)}
                                >
                                    {index + 1} || &nbsp;{project.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
                   
                <div className="workspace">
                {
                    selectedProjectId === null ? (
                        <NoneSelectedWorkspace />
                    ) : waitingForApprovalProjects.some(project => project.no === selectedProjectId) ? (
                        <ApprovalWorkspace project={selectedProject} />
                    ) : approvedOngoingProjects.some(project => project.no === selectedProjectId) ? (
                        <UpdateWorkspace project={selectedProject} />
                    ) : approvedEndedProjects.some(project => project.no === selectedProjectId) || rejectedProjects.some(project => project.no === selectedProjectId) ? (
                        <ReadOnlyWorkspace project={selectedProject} />
                    ) : null
                }
                </div>
            </div>
        );
    }
}

export default withRouter(ProjectApprovalPage);

