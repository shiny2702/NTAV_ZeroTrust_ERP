import React, { Component } from 'react';
import withRouter from '../../../../../hocs/withRouter';
import "../../../../../css/updateWorkspace.css"; // 스타일 파일

class UpdateWorkspace extends Component {
  render() {
    const { project } = this.props;
    const { leadDeptTeam, collabDeptTeam } = project; // 협력부서와 대표부서 정보 모두 사용

    // 대표부서 팀 데이터 준비
    const departments = [
      { dept: leadDeptTeam.dept, team: leadDeptTeam.team, applications: leadDeptTeam.applications }
    ];

    // 협력부서 팀 데이터 준비
    const collabDepartments = collabDeptTeam.map(collabDept => ({
      dept: collabDept.dept,
      team: collabDept.team,
      applications: collabDept.applications
    }));

    return (
      <div className="updateWorkspace">
        <div className="headerWithEdit">
          <h2>대표부서 및 팀 정보</h2>
          <button className="editButton">Edit</button>
        </div>
        <table className="projectInfoTable">
          <thead>
            <tr>
              <th>대표부서</th>
              <th>대표팀</th>
              <th>애플리케이션</th>
              <th>직원사번</th>
              <th>이름</th> 
            </tr>
          </thead>
          <tbody>
            {departments.map((department, deptIndex) => {
              const appEntries = Object.entries(department.applications); // 애플리케이션별로 분리
              return appEntries.map(([appName, { employees }], appIndex) => (
                <tr key={`${deptIndex}-${appIndex}`}>
                  {appIndex === 0 && (
                    <td rowSpan={appEntries.length}>{department.dept}</td> // 대표부서 한 번만 보여주기
                  )}
                  {appIndex === 0 && (
                    <td rowSpan={appEntries.length}>{department.team}</td> // 대표팀 한 번만 보여주기
                  )}
                  <td>{appName}</td>
                  <td>
                    {Array.isArray(employees)
                      ? employees.map(employee => (
                          <div key={employee.id}>{employee.id}</div>
                        ))
                      : "직원 정보 없음"}
                  </td>
                  <td>
                    {Array.isArray(employees)
                      ? employees.map(employee => (
                          <div key={employee.id}>{employee.name}</div> 
                        ))
                      : "사번 정보 없음"}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>

        {/* 경계선 추가 */}
        <div className="workspace-separator"></div>

        {/* 협력부서 테이블 추가 */}
        <div className="headerWithEdit">
          <h2>협력부서 및 팀 정보</h2>
          <button className="editButton">Edit</button>
        </div>
        <table className="projectInfoTable">
          <thead>
            <tr>
              <th>협력부서</th>
              <th>협력팀</th>
              <th>애플리케이션</th>
              <th>직원사번</th>
              <th>이름</th> 
            </tr>
          </thead>
          <tbody>
            {collabDepartments.map((department, deptIndex) => {
              const appEntries = Object.entries(department.applications); // 애플리케이션별로 분리
              return appEntries.map(([appName, { employees }], appIndex) => (
                <tr key={`${deptIndex}-${appIndex}`}>
                  {appIndex === 0 && (
                    <td rowSpan={appEntries.length}>{department.dept}</td> // 협력부서 한 번만 보여주기
                  )}
                  {appIndex === 0 && (
                    <td rowSpan={appEntries.length}>{department.team}</td> // 협력팀 한 번만 보여주기
                  )}
                  <td>{appName}</td>
                  <td>
                    {Array.isArray(employees)
                      ? employees.map(employee => (
                          <div key={employee.id}>{employee.id}</div>
                        ))
                      : "직원 정보 없음"}
                  </td>
                  <td>
                    {Array.isArray(employees)
                      ? employees.map(employee => (
                          <div key={employee.id}>{employee.name}</div> 
                        ))
                      : "사번 정보 없음"}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(UpdateWorkspace);





