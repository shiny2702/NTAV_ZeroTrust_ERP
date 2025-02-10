import React, { useState, useEffect } from "react";
import { fetchEmployees, registerEmployee, deleteSelectedEmployees, updateEmployee, sendEmployeeEmail } from '../api';
import "../css/admin_accountManagementPage.css";

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [randomPassword, setRandomPassword] = useState("");
  // const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    generateRandomPassword();
  }, []);

  const generateRandomPassword = () => {
    const password = Math.random().toString(36).slice(-8);
    setRandomPassword(password);
  };

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    setFilteredEmployees(data);
  };

  const handleRegisterEmployee = async (employeeId, name) => {
    const success = await registerEmployee(employeeId, name, randomPassword);
    if (success) {
      alert("직원이 성공적으로 등록되었습니다!");

      // 이메일 전송 API 호출
      const emailSuccess = await sendEmployeeEmail(employeeId, randomPassword);
      if (emailSuccess) {
        alert("초기 비밀번호가 이메일로 전송되었습니다.");
      } else {
        alert("초기 비밀번호 이메일 전송에 실패했습니다.");
      }
      
      generateRandomPassword();
      setEmployeeId("");
      setEmployeeName("");
    } else {
      alert("직원 등록에 실패했습니다.");
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
    if (!editedData.username || !editedData.role) {
      alert("이름과 역할을 모두 입력해 주세요.");
      return;
    }
    setModalType("edit");
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
      const success = await updateEmployee(editedData.id, editedData);
      if (success) {
        alert("직원 정보가 업데이트되었습니다!");
        setEditMode(null);
        loadEmployees();
      } else {
        alert("업데이트에 실패했습니다.");
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
            <div className="formGroup">
              <label>직원 사번:</label>
              <input type="number" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
            </div>
            <div className="formGroup">
              <label>직원명:</label>
              <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
            </div>
            <div className="formGroup">
              <label>초기 비밀번호:</label>
              <input type="text" value={randomPassword} readOnly />
              <button onClick={generateRandomPassword}>새 비밀번호 생성</button>
            </div>
            <button onClick={() => handleRegisterEmployee(employeeId, employeeName)}>등록</button>
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
                  <th>이름</th>
                  <th>역할</th>
                  <th>수정</th>
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
                    <td>
                      {editMode === employee.id ? (
                        <input type="text" value={editedData.username} onChange={(e) => setEditedData({ ...editedData, username: e.target.value })} />
                      ) : employee.username}
                    </td>
                    <td>
                      {editMode === employee.id ? (
                        <input type="text" value={editedData.role} onChange={(e) => setEditedData({ ...editedData, role: e.target.value })} />
                      ) : employee.role}
                    </td>
                    <td>
                      {editMode === employee.id ? (
                        <button onClick={handleEditConfirmation}>저장</button>
                      ) : (
                        <button onClick={() => { setEditMode(employee.id); setEditedData({ ...employee }); }}>편집</button>
                      )}
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
            <p>{modalType === "delete" ? "선택한 직원을 삭제하시겠습니까?" : "변경 내용을 저장하시겠습니까?"}</p>
            <button onClick={handleConfirm}>Yes</button>
            <button onClick={handleCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;






