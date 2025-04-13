import React, { Component } from "react";
import withRouter from "../../../../../hocs/withRouter";
import '../../../../../css/updateWorkspace.css';
import { updateProjectTitleSection } from "../../../../../api";

class UpdateWorkspace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            proj_no: props.project.proj_no,
            securityLevel: props.project.security_level,
            remark: props.project.remark || "",
            originalSecurityLevel: props.project.security_level,
            originalRemark: props.project.remark || ""
        };
    }

    componentDidUpdate(prevProps) {
        // selectedProject (props.project)가 바뀌었을 때 isEditing을 false로 초기화
        if (prevProps.project.proj_no !== this.props.project.proj_no) {
            this.setState({
                isEditing: false,
                securityLevel: this.props.project.security_level,
                remark: this.props.project.remark || "",
                originalSecurityLevel: this.props.project.security_level,
                originalRemark: this.props.project.remark || ""
            });
        }
    }

    handleEditToggle = async () => {
        const { isEditing } = this.state;
    
        if (isEditing) {
            // Save mode → update 처리
            const {
                securityLevel,
                remark,
                originalSecurityLevel,
                originalRemark,
                proj_no  // 프로젝트 번호가 상태에 있다고 가정
            } = this.state;
    
            const hasChanged = (
                parseInt(securityLevel) !== parseInt(originalSecurityLevel) ||
                remark.trim() !== originalRemark.trim()
            );
    
            if (hasChanged) {
                try {
                    const updatedData = {
                        proj_no,
                        security_level: parseInt(securityLevel),
                        remark: remark.trim()
                    };
    
                    console.log("저장 요청:", updatedData);
    
                    // DB 업데이트 요청
                    const updatedProject = await updateProjectTitleSection(updatedData);
    
                    // lert 창 표시 → 확인 누르면 setState 반영
                    alert("프로젝트 정보 업데이트 완료");
    
                    this.setState({
                        originalSecurityLevel: updatedProject.security_level,
                        originalRemark: updatedProject.remark,
                        securityLevel: updatedProject.security_level, // 혹시 화면에 수정된 게 안 반영될 경우
                        remark: updatedProject.remark,
                        isEditing: false // 저장 후 edit 모드 종료
                    });

                    // reloadProjects 호출하여 프로젝트 목록을 최신 상태로 갱신
                await this.props.reloadProjects();  

                } catch (error) {
                    console.error("❌ 프로젝트 업데이트 실패:", error);
                    alert("프로젝트 업데이트 중 오류가 발생했습니다.");
                }
    
                return; // 아래 setState 실행되지 않도록 조기 리턴
            }
        }
    
        // edit 모드 → 토글
        this.setState({ isEditing: !isEditing });
    };
  

    render() {
        const { project } = this.props;
        const { isEditing, securityLevel, remark } = this.state;

        if (!project) return <div className="read-only-container">데이터를 불러오는 중입니다...</div>;

        return (
            <div className="read-only-container">
                <div className="workspace-header">
                    <h2 className="workspace-title">📁 프로젝트 정보</h2>
                    <button className="edit-button" onClick={this.handleEditToggle}>
                        {isEditing ? "💾 Save" : "✏️ Edit"}
                    </button>
                </div>

                {/* 기본 정보 */}
                <section className="section">
                    <h3>기본 정보</h3>
                    <div className="info-grid">
                        <div><strong>프로젝트 번호 :</strong> {project.proj_no}</div>
                        <div><strong>프로젝트명 :</strong> {project.proj_name}</div>
                        <div><strong>보안등급 : </strong>
                            {isEditing ? (
                                <select
                                    value={securityLevel}
                                    onChange={(e) => this.setState({ securityLevel: e.target.value })}
                                    className="input-select"
                                >
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            ) : (
                                project.security_level
                            )}
                        </div>
                        <div><strong>상태 :</strong> {project.status}</div>
                        <div><strong>시작일 :</strong> {project.start_date || "  - "}</div>
                        <div><strong>예상 기간 :</strong> {project.expected_duration_month}</div>
                        <div><strong>종료일 :</strong> {project.actual_end_date || "  - "}</div>
                    </div>

                    <div className="description-block">
                        <strong>설명 :</strong>
                        <p>{project.description}</p>
                    </div>

                    {project.dms_report_link && (
                        <div className="info-link">
                            📎 <a href={project.dms_report_link} target="_blank" rel="noreferrer">DMS 보고서 링크</a>
                        </div>
                    )}

                    <div className="description-block">
                        <strong>비고 :</strong>
                        {isEditing ? (
                            <textarea
                                className="remark-input"
                                value={remark}
                                onChange={(e) => this.setState({ remark: e.target.value })}
                            />
                        ) : (
                            <p>{project.remark || '  - '}</p>
                        )}
                    </div>
                </section>

                {/* 나머지 섹션은 이후 단계에서 수정 추가 예정 */}
                {/* 부서 및 팀 정보 */}
                <section className="section">
                    <h3>부서 및 팀</h3>
                    <div className="team-block">
                        <strong>📌 주관 부서 :</strong>
                        <div>- {project.leadDeptTeam.dept_name} / {project.leadDeptTeam.team_name}</div>
                    </div>

                    {project.collabDeptTeam.length > 0 && (
                        <>
                            <strong>🤝 협업 부서 :</strong>
                            {project.collabDeptTeam.map((team) => (
                                <div
                                    key={`${team.dept_name}-${team.team_name}`}
                                    className="team-block"
                                >
                                    - {team.dept_name} / {team.team_name}
                                </div>
                            ))}
                        </>
                    )}
                </section>

                {/* 앱 및 인력 정보 */}
                <section className="section">
                    <h3>사용 애플리케이션 및 담당자</h3>
                    {[project.leadDeptTeam, ...project.collabDeptTeam].map((team) => (
                        <div
                            key={`team-${team.dept_name}-${team.team_name}`}
                            className="app-block"
                        >
                            <div className="team-title">- {team.dept_name} / {team.team_name}</div>
                            {team.applications.length > 0 ? (
                                team.applications.map((app) => (
                                    <div
                                        key={`app-${app.app_name}-${team.dept_name}-${team.team_name}`}
                                        className="app-item"
                                    >
                                        <div className="app-name">📦 {app.app_name}</div>
                                        <ul>
                                            {app.employees.map((emp) => (
                                                <li key={emp.employee_id}>
                                                    👤 {emp.employee_name}[{emp.employee_id}] &nbsp; ({emp.from_date} ~ {emp.to_date})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">⚠️ 애플리케이션 없음</div>
                            )}
                        </div>
                    ))}
                </section>

                {/* 프로젝트 관리자 */}
                <section className="section">
                    <h3>프로젝트 관리자</h3>
                    <div className="manager-block">
                        {project.projectManager ? (
                            <>
                                <strong>담당자 :</strong> {project.projectManager.employee_name}[{project.projectManager.employee_id}] 
                            </>
                        ) : (
                            <div>⚠️ 지정된 프로젝트 관리자가 없습니다.</div>
                        )}
                    </div>
                </section>

                <div className="timestamp-block">
                    <div>📅 생성일: {project.created_at}</div>
                    <div>✏️ 마지막 수정일: {project.updated_at}</div>
                </div>
            </div>
        );
    }
}

export default withRouter(UpdateWorkspace);






