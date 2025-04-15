import React, { Component } from "react";
import withRouter from "../../../../../hocs/withRouter";
import '../../../../../css/updateWorkspace.css';
import { updateProjectTitleSection, updateProjectManager, deleteEmployeesFromProject } from "../../../../../api";

class UpdateWorkspace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            proj_no: props.project.proj_no,
            securityLevel: props.project.security_level,
            remark: props.project.remark || "",
            managerId: props.project.projectManager?.employee_id || null,
            originalSecurityLevel: props.project.security_level,
            originalRemark: props.project.remark || "",
            originalManagerId: props.project.projectManager?.employee_id || null,
            removedEmployees: []
        };
    }

    componentDidUpdate(prevProps) {
        // selectedProject (props.project)가 바뀌었을 때 isEditing을 false로 초기화
        if (prevProps.project.proj_no !== this.props.project.proj_no) {
            this.setState({
                isEditing: false,
                proj_no: this.props.project.proj_no,
                securityLevel: this.props.project.security_level,
                remark: this.props.project.remark || "",
                managerId: this.props.project.projectManager?.employee_id || null,
                originalSecurityLevel: this.props.project.security_level,
                originalRemark: this.props.project.remark || "",
                originalManagerId: this.props.project.projectManager?.employee_id || null
            });
        }
    }


    handleEditToggle = async () => {
      const { isEditing } = this.state;
  
      if (isEditing) {
          const {
              securityLevel,
              remark,
              managerId,
              originalSecurityLevel,
              originalRemark,
              originalManagerId,
              proj_no
          } = this.state;
  
          const hasProjectInfoChanged = (
              parseInt(securityLevel) !== parseInt(originalSecurityLevel) ||
              remark.trim() !== originalRemark.trim()
          );
  
          const hasManagerChanged = (
              managerId !== originalManagerId
          );
  
          const hasRemovedEmployees = this.state.removedEmployees.length > 0;
  
          let updateSucceeded = false;
  
          // 1. 프로젝트 정보 수정
          if (hasProjectInfoChanged) {
              const updatedData = {
                  proj_no,
                  security_level: parseInt(securityLevel),
                  remark: remark.trim()
              };
  
              console.log("저장 요청:", updatedData);
  
              try {
                  const updatedProject = await updateProjectTitleSection(updatedData);
  
                  alert("프로젝트 정보 업데이트 완료");
  
                  this.setState({
                      originalSecurityLevel: updatedProject.security_level,
                      originalRemark: updatedProject.remark,
                      securityLevel: updatedProject.security_level,
                      remark: updatedProject.remark
                  });
  
                  updateSucceeded = true;
              } catch (error) {
                  console.error("프로젝트 정보 업데이트 실패:", error);
                  alert("프로젝트 정보 업데이트 중 오류가 발생했습니다.");
              }
          }
  
          // 2. 담당자 변경
          if (hasManagerChanged) {
              const updatedManagerData = {
                  proj_no,
                  original_manager_id: originalManagerId,
                  new_manager_id: managerId
              };
  
              console.log("담당자 변경 요청:", updatedManagerData);
  
              try {
                  await updateProjectManager(updatedManagerData);
  
                  alert("담당자 변경 완료");
  
                  this.setState({
                      originalManagerId: managerId,
                      managerId: managerId
                  });
  
                  updateSucceeded = true;
              } catch (error) {
                  console.error("담당자 변경 실패:", error);
                  alert("담당자 변경 중 오류가 발생했습니다.");
              }
          }
  
          // 3. 담당자 삭제
          if (hasRemovedEmployees) {
              const removedData = this.state.removedEmployees.map((key) => {
                  const [dept_no, team_no, app_no, employee_id] = key.split("-");
  
                  return {
                      dept_no: Number(dept_no),
                      team_no: Number(team_no),
                      app_no: Number(app_no),
                      employee_id: Number(employee_id)
                  };
              });
  
              const payload = {
                  proj_no,
                  removed_employees: removedData
              };
  
              console.log("삭제 요청:", payload);
  
              try {
                  await deleteEmployeesFromProject(payload);
  
                  alert("참여 직원 삭제 완료");
  
                  this.setState({ removedEmployees: [] });
  
                  updateSucceeded = true;
              } catch (error) {
                  console.error("참여 직원 삭제 실패:", error);
                  alert("참여 직원 삭제에 실패했습니다.");
              }
          }
  
          // 공통 처리 (변경된 게 하나라도 있다면)
          if (updateSucceeded) {
              try {
                  await this.props.reloadProjects();
              } catch (error) {
                  console.error("프로젝트 목록 새로고침 실패:", error);
                  alert("프로젝트 목록 갱신에 실패했습니다.");
              }
          }
  
          // 편집 모드 종료
          this.setState({ isEditing: false });
  
      } else {
          // 편집 모드 시작
          this.setState({ isEditing: true });
      }
  };
  

    getLeadDeptEmployees = () => {
      const { project } = this.props;
      const leadApps = project.leadDeptTeam?.applications || [];
  
      const seen = new Set();
      const employees = [];
  
      leadApps.forEach(app => {
          app.employees.forEach(emp => {
              if (!seen.has(emp.employee_id)) {
                  seen.add(emp.employee_id);
                  employees.push(emp);
              }
          });
      });
  
      return employees;
  };

  handleRemoveEmployee = (team, app, emp) => {
    const key = `${team.dept_no}-${team.team_no}-${app.app_no}-${emp.employee_id}`;
    this.setState((prevState) => {
      const isAlreadyRemoved = prevState.removedEmployees.includes(key);
      const updatedList = isAlreadyRemoved
        ? prevState.removedEmployees.filter((k) => k !== key)
        : [...prevState.removedEmployees, key];
  
      return { removedEmployees: updatedList };
    });
  };
  
  
  

    render() {
        const { project } = this.props;
        const { isEditing, securityLevel, remark, managerId, removedEmployees } = this.state;

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
                                        {app.employees.map((emp) => {
                                            const empKey = `${team.dept_no}-${team.team_no}-${app.app_no}-${emp.employee_id}`;
                                            const isRemoved = removedEmployees.includes(empKey);

                                            return (
                                                <li key={emp.employee_id} className="emp-list-item">
                                                    <span style={isRemoved ? { textDecoration: "line-through", color: "#888" } : {}}>
                                                        👤 {emp.employee_name}[{emp.employee_id}] &nbsp; ({emp.from_date} ~ {emp.to_date ?? '현재'})
                                                    </span>
                                                    {isEditing && emp.to_date === null && emp.employee_id !== this.state.managerId && (
                                                      <button
                                                        className={`delete-button ${isRemoved ? "active" : ""}`} // 상태에 따라 클래스 토글
                                                        onClick={() => this.handleRemoveEmployee(team, app, emp)}
                                                        title={isRemoved ? "삭제 취소" : "삭제"}
                                                      >
                                                        dropout
                                                      </button>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>

                                        {isEditing && (
                                          <div className="employee-add-section">
                                            <select
                                              className="employee-select"
                                              value="" // 기본값 유지
                                              onChange={(e) => this.handleAddEmployee(team, app, e.target.value)}
                                            >
                                              <option value="" disabled hidden>
                                                --직원추가--
                                              </option>

                                              {/* 예시로 직원 리스트 들어왔을 때 */}
                                              {this.state.availableEmployees?.map((emp) => (
                                                <option key={emp.employee_id} value={emp.employee_id}>
                                                  {emp.employee_name} [{emp.employee_id}]
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        )}

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
                        {this.state.isEditing ? (
                            <>
                                <strong>담당자 :</strong>
                                <select
                                    className="manager-select"
                                    value={managerId}
                                    onChange={(e) => this.setState({ managerId: e.target.value })}
                                >
                                    {this.getLeadDeptEmployees().map(emp => (
                                        <option key={emp.employee_id} value={emp.employee_id}>
                                            {emp.employee_name}[{emp.employee_id}]
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            project.projectManager ? (
                                <>
                                    <strong>담당자 :</strong> {project.projectManager.employee_name}[{project.projectManager.employee_id}]
                                </>
                            ) : (
                                <div>⚠️ 지정된 프로젝트 관리자가 없습니다.</div>
                            )
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






