// SalaryManagementPage.js
import React, { useState } from "react";
import "../../../../css/salaryManagementPage.css"; // 

const SalaryManagementPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = [
    {
      id: 1,
      number: "1001",
      name: "홍길동",
      salaryType: "월급",
      baseSalary: 3000000,
      지급: [
        { 종류: "기본급", 액수: 3000000 },
        { 종류: "초과근무수당", 액수: 200000 },
      ],
      공제: [
        { 종류: "소득세", 액수: 150000 },
        { 종류: "4대보험료", 액수: 200000 },
        { 종류: "지방소득세", 액수: 5000 },
      ],
    },
    {
      id: 2,
      number: "1002",
      name: "김철수",
      salaryType: "시급",
      baseSalary: 2000000,
      지급: [
        { 종류: "기본급", 액수: 2000000 },
        { 종류: "초과근무수당", 액수: 100000 },
      ],
      공제: [
        { 종류: "소득세", 액수: 10000 },
        { 종류: "4대보험료", 액수: 5000 },
        { 종류: "지방소득세", 액수: 5000 },
      ],
    },
    {
      id: 3,
      number: "1003",
      name: "신짱구",
      salaryType: "월급",
      baseSalary: 4000000,
      지급: [
        { 종류: "기본급", 액수: 2000000 },
        { 종류: "초과근무수당", 액수: 50000 },
      ],
      공제: [
        { 종류: "소득세", 액수: 10000 },
        { 종류: "4대보험료", 액수: 5000 },
        { 종류: "지방소득세", 액수: 5000 },
      ],
    },
    {
      id: 4,
      number: "1004",
      name: "김맹구",
      salaryType: "시급",
      baseSalary: 2000000,
      지급: [
        { 종류: "기본급", 액수: 2000000 },
        { 종류: "초과근무수당", 액수: 100000 },
      ],
      공제: [
        { 종류: "소득세", 액수: 10000 },
        { 종류: "4대보험료", 액수: 5000 },
        { 종류: "지방소득세", 액수: 5000 },
      ],
    },
  ];

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  /*const handleUpdateSalary = () => {
    console.log("Updated salaries:", employees);

    // 서버에 업데이트 요청 보내기 (예: Axios 사용 시)
    axios.post('/api/update-salaries', employees)
      .then(response => {
        console.log('서버 응답:', response.data);
      })
      .catch(error => {
        console.error('업데이트 실패:', error);
      });
    
  };*/

  const calculateNetSalary = () => {
    if (!selectedEmployee) return 0;
    const totalPay =
      selectedEmployee.지급?.reduce((acc, cur) => acc + cur.액수, 0) || 0;
    const totalDeduct =
      selectedEmployee.공제?.reduce((acc, cur) => acc + cur.액수, 0) || 0;
    return totalPay - totalDeduct;
  };

  return (
    <div className="w-full h-screen flex flex-col p-4 bg-gray-100">
      {/* 🔍 필터바 */}
      <div
        className="flex flex-wrap items-center space-x-2 mb-4"
        style={{ marginLeft: "20px", marginTop: "10px" }}
      >
        <select
          className="border p-2 rounded w-[100px]"
          style={{ marginRight: "5px" }}
        >
          {[...Array(9)].map((_, i) => {
            const year = 2025 - i;
            return <option key={year}>{year}</option>;
          })}
        </select>
        <select
          className="border p-2 rounded w-[120px]"
          style={{ marginRight: "5px" }}
        >
          <option value="">급여형태</option>
          <option value="월급">월급</option>
          <option value="시급">시급</option>
        </select>
        <label className="text-sm font-medium" style={{ marginRight: "5px" }}>
          직원번호
        </label>
        <input
          type="text"
          placeholder="ex: 1001"
          className="border p-2 rounded w-[100px]"
          style={{ marginRight: "5px" }}
        />
        <label className="text-sm font-medium" style={{ marginRight: "5px" }}>
          직원명
        </label>
        <input
          type="text"
          placeholder="예: 홍길동"
          className="border p-2 rounded w-[100px]"
          style={{ marginRight: "5px" }}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          조회
        </button>
      </div>

      <h3 className="mt-8 mb-2 font-semibold" style={{ marginLeft: "20px" }}>
        최근 급여 수정 내역
      </h3>
      <table
        className="w-full border text-sm"
        border="1"
        style={{
          width: "96%",
          borderCollapse: "collapse",
          marginLeft: "20px",
          marginRight: "10px",
          marginBottom: "10px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                //padding: "8px", // 셀 여백 조정
                width: "30%",
              }}
            >
              날짜
            </th>
            <th
              style={{
                backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                //padding: "8px", // 셀 여백 조정
              }}
            >
              사번
            </th>
            <th
              style={{
                backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                //padding: "8px", // 셀 여백 조정
              }}
            >
              직원명
            </th>
            <th
              style={{
                backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                //padding: "8px", // 셀 여백 조정
              }}
            >
              수정자
            </th>
            <th
              style={{
                backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                //padding: "8px", // 셀 여백 조정
              }}
            >
              변경 전
            </th>
            <th
              style={{
                backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                //padding: "8px", // 셀 여백 조정
              }}
            >
              변경 후
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-04-14-12:36:55[554]</td>
            <td>1001</td>
            <td>홍길동</td>
            <td>관리자</td>
            <td style={{ textAlign: "right" }}>2,980,000</td>
            <td style={{ textAlign: "right" }}>3,000,000</td>
          </tr>
          <tr>
            <td>2025-04-09-10:08:15[275]</td>
            <td>1002</td>
            <td>김철수</td>
            <td>관리자</td>
            <td style={{ textAlign: "right" }}>1,900,000</td>
            <td style={{ textAlign: "right" }}>2,000,000</td>
          </tr>
          <tr>
            <td>2025-04-08-14:48:27[835]</td>
            <td>1003</td>
            <td>신짱구</td>
            <td>관리자</td>
            <td style={{ textAlign: "right" }}>3,800,000</td>
            <td style={{ textAlign: "right" }}>4,000,000</td>
          </tr>
          <tr>
            <td>2025-04-05-18:14:45[842]</td>
            <td>1004</td>
            <td>김맹구</td>
            <td>관리자</td>
            <td style={{ textAlign: "right" }}>1,650,000</td>
            <td style={{ textAlign: "right" }}>2,000,000</td>
          </tr>
        </tbody>
      </table>

      {/* 테이블 영역 */}
      <div
        className="flex space-x-4"
        style={{
          display: "flex",
          marginBottom: "2px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        {/* 직원목록 */}
        <div
          className="w-1/2"
          style={{
            width: "70%",
            paddingRight: "5px",
            maxHeight: "350px",
            overflowY: "auto",
            borderCollapse: "collapse",
          }}
        >
          <h3 className="mb-2 font-bold">직원목록</h3>
          <table
            className="w-full border border-gray-400 text-sm"
            border="1"
            cellPadding="2"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              //marginBottom: "20px",
              marginRight: "10px",
            }}
          >
            <thead className="bg-gray-200">
              <tr>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  신고귀속
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  부서명
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  사번
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  직원명
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  급여형태
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  기본급
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  입사일
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  퇴사일
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  퇴직금처리
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  지급/공제
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>2025-02</td>
                  <td>영업부</td>
                  <td>{emp.number}</td>
                  <td>{emp.name}</td>
                  <td>{emp.salaryType}</td>
                  <td>{emp.baseSalary.toLocaleString()}</td>
                  <td>2021-01-01</td>
                  <td>-</td>
                  <td>퇴직적립금</td>
                  <td>
                    <button
                      onClick={() => handleEmployeeClick(emp)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 지급/공제 테이블 + 실지급 */}
        <div
          className="w-1/2"
          style={{
            width: "30%",
            paddingRight: "5px",
            maxHeight: "350px",
            overflowY: "auto",
            marginLeft: "20px",
          }}
        >
          <h3 className="mb-2 font-bold">지급/공제 항목</h3>
          <table
            className="w-full border border-gray-400 text-sm mb-2"
            border="1"
            cellPadding="2"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              //marginBottom: "20px",
              //marginRight: "10px",
            }}
          >
            <thead className="bg-gray-200">
              <tr>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  항목
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  종류
                </th>
                <th
                  style={{
                    backgroundColor: "#c0c0c0", // 원하는 배경색 지정
                  }}
                >
                  액수
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedEmployee?.지급?.map((item, idx) => (
                <tr key={`pay-${idx}`}>
                  <td>지급</td>
                  <td>{item.종류}</td>
                  <td style={{ textAlign: "right" }}>
                    {item.액수.toLocaleString()}
                  </td>
                </tr>
              ))}
              {selectedEmployee?.공제?.map((item, idx) => (
                <tr key={`deduct-${idx}`}>
                  <td>공제</td>
                  <td>{item.종류}</td>
                  <td style={{ textAlign: "right" }}>
                    {item.액수.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 실지급 */}
          <table
            className="w-[200px] border-gray-400 text-sm"
            border="1"
            cellPadding="2"
            style={{
              borderCollapse: "collapse",
              width: "200px",
              //marginBottom: "20px",
              //marginRight: "10px",
              marginLeft: "auto",
              marginTop: "10px",
            }}
          >
            <tbody>
              <tr>
                <td className="bg-gray-200 font-semibold px-4 py-2">
                  실지급여
                </td>
                <td
                  className="text-right px-4 py-2"
                  style={{ textAlign: "right" }}
                >
                  {calculateNetSalary().toLocaleString()} 원
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="flex justify-end mt-4"
        border="1"
        cellPadding="2"
        style={{
          borderCollapse: "collapse",
          width: "80px",
          //marginBottom: "20px",
          marginRight: "10px",
          marginLeft: "auto",
          marginTop: "10px",
        }}
      >
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          급여 수정
        </button>
      </div>
    </div>
  );
};

export default SalaryManagementPage;