import React, { Component } from "react";
import withRouter from "../../../../../hocs/withRouter";  
import '../../../../../css/readOnlyWorkspace.css';  

class ReadOnlyWorkspace extends Component {
    render() {
        const { project } = this.props;

        if (!project) return <div className="read-only-container">데이터를 불러오는 중입니다...</div>;

        return (
            <div className="read-only-container">
                <h2 className="workspace-title">📁 프로젝트 정보</h2>

                {/* 기본 정보 */}
                <section className="section">
                    <h3>기본 정보</h3>
                    <div className="info-grid">
                        <div><strong>프로젝트 번호 :</strong> {project.proj_no}</div>
                        <div><strong>프로젝트명 :</strong> {project.proj_name}</div>
                        <div><strong>보안등급 :</strong> {project.security_level}</div>
                        <div><strong>상태 :</strong> {project.status}</div>
                        <div><strong>시작일 :</strong> {project.start_date || " - "}</div>
                        <div><strong>예상 기간 :</strong> {project.expected_duration_month}</div>
                        <div><strong>종료일 :</strong> {project.actual_end_date || " - "}</div>
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
                        <p>{project.remark || ' - '}</p>
                    </div>
                </section>

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

export default withRouter(ReadOnlyWorkspace);

