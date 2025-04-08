import React, { useState, useEffect } from "react";
import { fetchEmployees, fetchRegisterableEmployeeIds, fetchEmployeeDetails, registerEmployee, deleteSelectedEmployees, updateEmployee, resetInitPassword } from '../../../../api';
import "../../../../css/admin_accountManagementPage.css";

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState("register");
  // const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [registerableIds, setRegisterableIds] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(""); // 한 명 선택
  const [employeeInfo, setEmployeeInfo] = useState(null); // 해당 직원 정보
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState(null); // 수정용
  const [resetTarget, setResetTarget] = useState(null); // 초기화용
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchRegisterableEmployeeIds().then(setRegisterableIds);
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchEmployeeDetails(selectedEmployeeId).then(setEmployeeInfo);
    } else {
      setEmployeeInfo(null);
    }
  }, [selectedEmployeeId]);

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    setFilteredEmployees(data);
  };

  const handleRegisterEmployee = async (employeeId, employeeName) => {
    const result = await registerEmployee(employeeId);
  
    if (result.success) {
      alert(`${employeeName} 님의 계정이 성공적으로 등록되었으며, 초기 비밀번호 이메일 전송 완료되었습니다.`);
      setSelectedEmployeeId("");
      setEmployeeInfo(null);
    } else {
      alert(result.message);  // 예: "이미 등록된 사번입니다." 등
    }
  };

  const handleDeleteConfirmation = () => {
    if (selectedEmployees.length === 0) {
      alert("삭제할 직원을 선택해 주세요.");
      return;
    }
    setModalType("delete");
    setModalVisible(true);
  };

  const handleEditConfirmation = () => {
    setModalType("edit");
    setModalVisible(true);
  };

  const handleResetConfirmation = () => {
    setModalType("reset");
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    if (modalType === "delete") {
      const success = await deleteSelectedEmployees(selectedEmployees);
      if (success) {
        alert("선택된 직원이 삭제되었습니다!");
        loadEmployees();
        setSelectedEmployees([]);
      } else {
        alert("직원 삭제에 실패했습니다.");
      }
    } else if (modalType === "edit") {
      if (!editedData) 
        return alert("업데이트할 직원 정보가 없습니다.");
    
      const response = await updateEmployee(editedData);
    
      if (response?.success) {
        alert(response.message || "직원 정보가 업데이트되었습니다!");
        setEditMode(null);
        loadEmployees();
      } else {
        alert(response?.message || "업데이트에 실패했습니다.");
      }
    } else if (modalType === "reset") {
      if (!resetTarget) 
        return alert("비밀번호 초기화할 직원 정보가 없습니다.");

      const response = await resetInitPassword(resetTarget);
    
      if (response?.success) {
        alert(response.message || "초기비밀번호가 초기화되었습니다");
        loadEmployees();
      } else {
        alert(response?.message || "초기비밀번호 초기화에 실패했습니다.");
      }
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div className="employeeManagement">
      <div className="sidebar">
        <button onClick={() => setActiveTab("register")}>직원등록</button>
        <button onClick={() => { setActiveTab("list"); loadEmployees(); }}>직원리스트</button>
      </div>
      <div className="content">
        {activeTab === "register" && (
          <div className="registerTab">
            <h2>직원 등록</h2>

            {/* 직원 사번 드롭다운 */}
            <div className="formGroup">
              <label>직원 사번:</label>
              <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                <option value="">선택</option>
                {registerableIds.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_id}
                  </option>
                ))}
              </select>
            </div>

            {/* 직원 정보 표 */}
            <div className="formGroup">
              <label>직원정보:</label>
              <table className="employeeInfoTable">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>전화번호</th>
                    <th>입사일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{employeeInfo ? `${employeeInfo.first_name} ${employeeInfo.last_name}` : '-'}</td>
                    <td>{employeeInfo ? employeeInfo.email : '-'}</td>
                    <td>{employeeInfo ? employeeInfo.phone_num : '-'}</td>
                    <td>{employeeInfo ? employeeInfo.hired_date.slice(0, 10) : '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 등록 버튼 */}            
            <button
              disabled={!selectedEmployeeId}
              onClick={() => handleRegisterEmployee(selectedEmployeeId, `${employeeInfo.first_name}${employeeInfo.last_name}`)}
            >
              등록
            </button>
          </div>
        )}
        {activeTab === "list" && (
          <div className="listTab">
            <h2>직원 리스트</h2>
            <div className="searchContainer">
              <input type="text" placeholder="id, 이름, 역할 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <table>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>ID</th>
                  <th>성</th>
                  <th>이름</th>
                  <th>활성여부</th>
                  <th>초기비밀번호여부</th>
                  <th>메일</th>
                  <th>연락처</th>
                  <th>생년월일</th>
                  <th>입사일</th>
                  <th>계정생성일</th>
                  <th>마지막수정일</th>
                  <th>수정</th>
                  <th>초기비밀번호reset</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <input type="checkbox" value={employee.id} onChange={(e) => {
                        const { checked, value } = e.target;
                        setSelectedEmployees((prev) =>
                          checked ? [...prev, value] : prev.filter((id) => id !== value)
                        );
                      }} />
                    </td>
                    <td>{employee.id}</td>
                    <td>{employee.last_name || "-"}</td>
                    <td>{employee.first_name || "-"}</td>
                    <td>
                      {editMode === employee.id ? (
                        <select
                          value={editedData.is_active ? "yes" : "no"}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              is_active: e.target.value === "yes",
                            })
                          }
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : employee.is_active ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>
                    <td>
                      {editMode === employee.id ? (
                        <select
                          value={editedData.is_initial_password ? "yes" : "no"}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              is_initial_password: e.target.value === "yes",
                            })
                          }
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : employee.is_initial_password ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>
                    <td>{employee.email || "-"}</td>
                    <td>{employee.phone || "-"}</td>
                    <td>{employee.birth_date || "-"}</td>
                    <td>{employee.join_date || "-"}</td>
                    <td>{employee.created_at || "-"}</td>
                    <td>{employee.updated_at || "-"}</td>
                    
                    {/* 수정 버튼 */}
                    <td>
                      {editMode === employee.id ? (
                        <button onClick={handleEditConfirmation}>save</button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditMode(employee.id);
                            setEditedData({ ...employee }); // 전체 employee 복사해놓고 is_active만 수정하자!
                          }}
                        >
                          edit
                        </button>
                      )}
                    </td>

                    {/* 초기비밀번호 reset 버튼 */}
                    <td>
                      <button
                        onClick={() => {
                          setResetTarget({ ...employee });  // reset용 target 지정
                          handleResetConfirmation();       // 모달 띄우기
                        }}
                      >
                        reset
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            <button className="deleteButton" onClick={handleDeleteConfirmation}>선택 삭제</button>
          </div>
        )}
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modalContent">
          <p>
            {modalType === "delete" && "선택한 직원을 삭제하시겠습니까?"}
            {modalType === "edit" && `${editedData?.last_name}${editedData?.first_name}님의 변경 내용을 저장하시겠습니까?`}
            {modalType === "reset" && `${resetTarget?.last_name}${resetTarget?.first_name}님의 비밀번호를 초기화하시겠습니까?`}
          </p>
            <button onClick={handleConfirm}>Yes</button>
            <button onClick={handleCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;






