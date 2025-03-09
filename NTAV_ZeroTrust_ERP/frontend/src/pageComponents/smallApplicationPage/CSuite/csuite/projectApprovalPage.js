import React, { Component } from "react";
import withRouter from "../../../../hocs/withRouter";  
import '../../../../css/projectApprovalPage.css';  
import ApprovalWorkspace from "./workspace/approvalWorkspace";
import UpdateWorkspace from "./workspace/updateWorkspace";
import NoneSelectedWorkspace from "./workspace/noneSelectedWorkspace";  

class ProjectApprovalPage extends Component {
    state = {
        viewMode: 'all', // 'all', 'approved', 'unapproved' 중 하나
        selectedProjectId: null, // 선택된 프로젝트 ID
    };

    handleViewChange = (viewMode) => {
        this.setState((prevState) => {
            const { selectedProjectId } = prevState;
            const { approvedProjects, unapprovedProjects } = this.props;
    
            // 선택된 프로젝트가 approvedProjects에 속해 있을 때 결재미완료 버튼을 누르면 selectedProjectId를 null로 설정
            if (viewMode === 'unapproved' && approvedProjects.some(project => project.no === selectedProjectId)) {
                return { viewMode, selectedProjectId: null };
            }
    
            // 선택된 프로젝트가 unapprovedProjects에 속해 있을 때 결재완료 버튼을 누르면 selectedProjectId를 null로 설정
            if (viewMode === 'approved' && unapprovedProjects.some(project => project.no === selectedProjectId)) {
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
        const { approvedProjects, unapprovedProjects } = this.props;
        const { viewMode, selectedProjectId } = this.state;

        // 필터링된 프로젝트 목록
        let filteredProjects = [];
        if (viewMode === 'approved') {
            filteredProjects = approvedProjects;
        } else if (viewMode === 'unapproved') {
            filteredProjects = unapprovedProjects;
        } else {
            filteredProjects = [...approvedProjects, ...unapprovedProjects];
        }

        // 선택된 프로젝트 ID가 null일 때, 결재완료 프로젝트, 결재미완료 프로젝트 구분
        const selectedProject = filteredProjects.find(project => project.no === selectedProjectId);

        return (
            <div className="projectApprovalPage">
                <div className="sidebar">
                    <div className="buttonContainer">
                        <button 
                            className={`viewButton ${viewMode === 'approved' ? 'active' : ''}`}
                            onClick={() => this.handleViewChange('approved')}
                        >
                            결재완료
                        </button>
                        <button 
                            className={`viewButton ${viewMode === 'unapproved' ? 'active' : ''}`}
                            onClick={() => this.handleViewChange('unapproved')}
                        >
                            결재미완료
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
                        {filteredProjects.map((project, index) => (
                            <button
                                key={project.no}
                                className={`projectItem ${approvedProjects.some(p => p.no === project.no) ? 'approved' : 'unapproved'} 
                                                        ${selectedProjectId === project.no ? 'selected' : ''}`}
                                onClick={() => this.handleProjectClick(project.no)}
                            >
                                {index + 1} || &nbsp;{project.name}
                            </button>
                        ))}
                    </div>
                </div>
                   
                <div className="workspace">
                {
                    // selectedProjectId가 null일 때는 NoneSelectedWorkspace
                    // 결재완료된 프로젝트를 선택했을 때는 UpdateWorkspace
                    // 결재미완료된 프로젝트를 선택했을 때는 ApprovalWorkspace
                    selectedProjectId === null ? (
                    <NoneSelectedWorkspace />
                    ) : approvedProjects.some(project => project.no === selectedProjectId) ? (
                    <UpdateWorkspace project={selectedProject} />
                    ) : unapprovedProjects.some(project => project.no === selectedProjectId) ? (
                    <ApprovalWorkspace project={selectedProject} />
                    ) : null
                }
                </div>
            </div>
        );
    }
}

export default withRouter(ProjectApprovalPage);

