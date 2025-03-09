import React, { Component } from "react";
import withRouter from "../../../../hocs/withRouter";  
import '../../../../css/projectApprovalPage.css';  

class ProjectApprovalPage extends Component {
    state = {
        viewMode: 'all', // 'all', 'approved', 'unapproved' 중 하나
        selectedProjectId: null, // 선택된 프로젝트 ID
    };

    handleViewChange = (viewMode) => {
        this.setState({ viewMode });
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

                    <div className="separator"></div>

                    <div className="projectList">
                        {filteredProjects.map((project, index) => (
                            <button
                                key={project.id}
                                className={`projectItem ${project.approvalDate ? 'approved' : 'unapproved'} ${selectedProjectId === project.id ? 'selected' : ''}`}
                                onClick={() => this.handleProjectClick(project.id)}
                            >
                                {index + 1} || &nbsp;{project.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="workspace">
                    
                    
                </div>
            </div>
        );
    }
}

export default withRouter(ProjectApprovalPage);

