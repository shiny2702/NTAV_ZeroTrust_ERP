import React, { useState, useEffect } from "react";
import Modal from "./modalOrgPage"; // 모달 컴포넌트
import {  fetchEmployeeLists, fetchDepartment, fetchTeam, fetchDeptHead, fetchTeamHead, fetchEmployeeDetail, updateEmployeeDetail } from "../../../../api";

const OrgStructureManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("재직");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [teamHeads, setTeamHeads] = useState([]);
  const [deptHeads, setDeptHeads] = useState([]);

  // 직원 목록 가져오기
  useEffect(() => {
    const loadEmployees = async () => {
      const data = await fetchEmployeeLists();
      const sorted = data.sort((a, b) => a.employee_id - b.employee_id);
      setEmployees(sorted);
      setFilteredEmployees(sorted);
      const uniqueStatuses = [...new Set(data.map((emp) => emp.status))];
      setStatuses(uniqueStatuses);
    };
    loadEmployees();
  }, []);

  // 부서 목록
  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartment();
      setDepartments(data.map((d) => d.dept_name));
    };
    loadDepartments();
  }, []);

  // 팀 목록
  useEffect(() => {
    const loadTeams = async () => {
      const data = await fetchTeam();
      setTeams(data);
    };
    loadTeams();
  }, []);

  // 팀장 목록
  useEffect(() => {
    const loadTeamHeads = async () => {
      const data = await fetchTeamHead();
      setTeamHeads(data);
    };
    loadTeamHeads();
  }, []);

  // 부서장 목록
  useEffect(() => {
    const loadDeptHeads = async () => {
      const data = await fetchDeptHead();
      setDeptHeads(data);
    };
    loadDeptHeads();
  }, []);

  // 필터 처리
  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const fullName = `${employee.last_name}${employee.first_name}`.toLowerCase();
      const filterName = nameFilter.toLowerCase();

      return (
        (departmentFilter ? employee.dept_name === departmentFilter : true) &&
        (teamFilter ? employee.team_name === teamFilter : true) &&
        (statusFilter ? employee.status === statusFilter : true) &&
        (nameFilter ? fullName.includes(filterName) : true)
      );
    });
    setFilteredEmployees(filtered);
  }, [departmentFilter, teamFilter, statusFilter, nameFilter, employees]);

  // 상세정보 보기
  const handleEmployeeClick = async (id) => {
    const data = await fetchEmployeeDetail(id);
    setSelectedEmployee(data);
  };

  // 수정 모드 진입
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  // 수정 저장
  const handleSave = async (employee) => {
    const result = await updateEmployeeDetail({
      id: employee.employee_id,
      dept_name: employee.dept_name,
      team_name: employee.team_name,
      status: employee.status,
    });

    if (result) {
      setEditingEmployee(null);
      const refreshed = await fetchEmployeeLists();
      const sorted = refreshed.sort((a, b) => a.employee_id - b.employee_id);
      setEmployees(sorted);
      setFilteredEmployees(sorted);
    }
  };

  // 수정 중 값 변경
  const handleChange = (e, field) => {
    const updated = { ...editingEmployee, [field]: e.target.value };
    setEditingEmployee(updated);
  };

  // 부서장 / 팀장 여부 판별
  const isTeamHead = (employee) =>
    teamHeads.some(
      (head) => head.team_no === employee.team_no && head.head === employee.employee_id
    );

  const isDeptHead = (employee) =>
    deptHeads.some(
      (head) => head.dept_no === employee.dept_no && head.head === employee.employee_id
    );

    
  return (
    <div style={{ padding: "20px" }}>
      <h1>👥 조직 구성원 관리</h1>

      {/* 필터 */}
      <div>
        <label style={{ marginLeft: 10 }}>이름: </label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="이름 검색"
        />
        <label style={{ marginLeft: 10 }}>부서: </label>
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">전체</option>
          {departments.map((dept, i) => (
            <option key={i} value={dept}>{dept}</option>
          ))}
        </select>
        <label style={{ marginLeft: 10 }}>팀: </label>
        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
          <option value="">전체</option>
          {teams.map((team, i) => (
            <option key={i} value={team}>{team}</option>
          ))}
        </select>
        <label style={{ marginLeft: 10 }}>상태: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">전체</option>
          {statuses.map((status, i) => (
            <option key={i} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* 테이블 */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>부서</th>
            <th>팀</th>
            <th>상태</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td
                  onClick={() => handleEmployeeClick(employee.employee_id)}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                  {employee.last_name}{employee.first_name}
                </td>
                <td>
                  {editingEmployee?.employee_id === employee.employee_id ? (
                    <select
                      value={editingEmployee.dept_name || ""}
                      onChange={(e) => handleChange(e, "dept_name")}
                    >
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <>
                      {employee.dept_name}
                      {isDeptHead(employee) && (
                        <span style={{
                          marginLeft: 5,
                          padding: "2px 6px",
                          backgroundColor: "#007bff",
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "0.8em"
                        }}>
                          부서장
                        </span>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {editingEmployee?.employee_id === employee.employee_id ? (
                    <select
                      value={editingEmployee.team_name || ""}
                      onChange={(e) => handleChange(e, "team_name")}
                    >
                      <option value="">선택하세요</option>
                      {teams.map((team, index) => (
                        <option key={index} value={team}>{team}</option>
                      ))}
                    </select>
                  ) : (
                    <>
                      {employee.team_name}
                      {isTeamHead(employee) && (
                        <span style={{
                          marginLeft: 5,
                          padding: "2px 6px",
                          backgroundColor: "#28a745",
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "0.8em"
                        }}>
                          팀장
                        </span>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {editingEmployee?.employee_id === employee.employee_id ? (
                    <select
                      value={editingEmployee.status || ""}
                      onChange={(e) => handleChange(e, "status")}
                    >
                      {statuses.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    employee.status
                  )}
                </td>
                <td>
                  {editingEmployee?.employee_id === employee.employee_id ? (
                    <button onClick={() => handleSave(editingEmployee)}>저장</button>
                  ) : (
                    <button onClick={() => handleEdit(employee)}>수정</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">데이터가 없습니다.</td></tr>
          )}
        </tbody>
      </table>

      {/* 모달 */}
      <Modal isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)}>
        {selectedEmployee && (
          <div>
            <h3>직원 상세 정보</h3>
            <p><strong>이름:</strong> {selectedEmployee.last_name}{selectedEmployee.first_name}</p>
            <p><strong>전화번호:</strong> {selectedEmployee.phone_no}</p>
            <p><strong>이메일:</strong> {selectedEmployee.email}</p>
            <p><strong>직무:</strong> {selectedEmployee.job}</p>
            <p><strong>역할 정보:</strong> {selectedEmployee.roleInfo}</p>
            <p><strong>급여 계좌:</strong> {selectedEmployee.salary_account}</p>
            <p><strong>생년월일:</strong> {selectedEmployee.birth_date}</p>
            <p><strong>입사일:</strong> {selectedEmployee.hire_date}</p>
            <p><strong>퇴사일:</strong> {selectedEmployee.end_date || "현재 재직 중"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrgStructureManagementPage;