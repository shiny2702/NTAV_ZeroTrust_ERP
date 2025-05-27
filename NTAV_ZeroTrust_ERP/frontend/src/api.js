const BASE_URL = "https://ntav.project:4430/erp";

export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
    // const response = await fetch('http://222.110.177.89:8080/api/auth/login', {
    // const response = await fetch('http://127.0.0.1:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    return response.json();
  } catch (error) {
    console.error('로그인 API 호출 실패:', error);
  }
};

export const verifyPassword = async (userId, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
      credentials: 'include',
    });

    const result = await response.json();

    return result; // 결과를 반환
  } catch (err) {
    console.error('비밀번호 확인 실패:', err);
    throw new Error('서버와 연결할 수 없습니다.'); // 에러를 던져서 프론트에서 처리
  }
};

export const updatePassword = async (userId, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/update-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
      credentials: 'include',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, message: "비밀번호 변경 실패" };
  }
};

// is_initial_password 값 업데이트 API 추가
export const updateInitialPasswordStatus = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/update-initial-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
      credentials: 'include',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};




export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/employees`, {
      method: 'GET',
      credentials: 'include',
  });
    return response.json();
  } catch (error) {
    console.error("직원 리스트를 가져오는 중 오류 발생:", error);
  }
};


export const fetchRegisterableEmployeeIds = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/employee/registerable`, {
      method: 'GET',
      credentials: 'include',
  });
    if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('등록 가능한 직원 조회 실패:', err);
    return []; // 혹은 null / 에러 throw
  }
};

export const fetchEmployeeDetails = async (employeeId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/employee/details/${employeeId}`, {
      method: 'GET',
      credentials: 'include',
  });
    if (!res.ok) throw new Error(`직원 정보 조회 실패 (code: ${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('직원 상세 정보 조회 중 오류:', err);
    return null; // 혹은 에러 throw
  }
};

export const registerEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId }),
      credentials: 'include',
    });
    
    const data = await response.json();

    return {
      success: response.ok && data.success,
      message: data.message || "알 수 없는 오류가 발생했습니다.",
    };
  } 
  catch (error) {
    console.error("직원 등록 중 오류 발생:", error);
    return {
      success: false,
      message: "네트워크 오류로 등록에 실패했습니다.", // 서버가 죽었거나, 응답을 못 받은 상황
    };
  }
};

export const deleteSelectedEmployees = async (selectedEmployees) => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/employees`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedEmployees }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('직원 삭제 실패:', errorData.error || '알 수 없는 오류');
      return false;
    }
    return true;
  } catch (error) {
    console.error("직원 삭제 중 오류 발생:", error);
    return false;
  }
};

export const updateEmployee = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/employees`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.id,  // id도 body에 포함
        is_active: data.is_active,
        is_initial_password: data.is_initial_password,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`직원 정보 업데이트 실패: ${errorData.error || '알 수 없는 오류'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('직원 정보 업데이트 실패:', error);
    return {
      success: false,
      message: '직원 정보 업데이트 실패',
    };
  }
};



export const resetInitPassword = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.id,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`비밀번호 초기화 실패: ${errorData.error || '알 수 없는 오류'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('비밀번호 초기화 실패:', error);
    alert('비밀번호 초기화 실패');
  }
};




export const sendEmployeeEmail = async (employeeId, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeId, password }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error("이메일 전송 실패");
    const result = await response.json();

    return result.success;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};


export const roleInfoWholeRegenerate = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/role/roleInfoWholeRegenerate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } 
  catch (error) {
    console.error(error);
    return {
      success: false,
      message: "API 호출 중 오류 발생",
    };
  }
};

// export const roleInfoRegenerate = async (employeeIdList) => {
//   try {
//     const response = await fetch(`${BASE_URL}/api/role/roleInfoRegenerate`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ ids: employeeIdList }),
//     });

//     const data = await response.json();
//     return data;
//   } 
//   catch (error) {
//     console.error(error);
//     return {
//       success: false,
//       message: "요청 실패",
//     };
//   }
// };


export const fetchProjects = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/project/projects`, {
      method: 'GET',
      credentials: 'include',
  }); 
    return response.json();
  } catch (error) {
    console.error("프로젝트트 리스트를 가져오는 중 오류 발생:", error);
  }
};

// api.js
export const updateProjectTitleSection = async (updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/project/updateProjectTitleSection`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('프로젝트 기본정보 수정 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('updateProjectTitleSection error:', error);
    throw error;
  }
}

export const updateProjectManager = async (updatedManagerData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/project/updateProjectManager`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(updatedManagerData),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`프로젝트 매니저 업데이트 실패`);
    }

    return await response.json();
  } catch (error) {
    console.error('updateProjectManager error:', error);
    throw error;
  }
}

export const deleteEmployeesFromProject = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/api/project/deleteEmployeesFromProject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete employees`);
    }

    return await response.json();
  } catch (error) {
    console.error('updateProjectManager error:', error);
    throw error;
  }
};


export const addibleEmployeesToProject = async (app_no, currentEmpIds) => {
  try {
    const response = await fetch(`${BASE_URL}/api/project/addibleEmployeesToProject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_no, currentEmpIds }),
      credentials: 'include',
    });

    const result = await response.json();
    if (!result.success) { 
      throw new Error(result.message);
    }

    return result.data;
  } 
  catch (err) {
    console.error("fetchAvailableEmployees error:", err);
    return [];
  }
};


// 직원 목록 가져오기
export const fetchEmployeeLists = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/org/employeeLists`, {
      method: 'GET',
      credentials: 'include', 
  });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("fetchEmployeeLists error:", err);
    return [];
  }
};

// 부서 목록 가져오기
export const fetchDepartment = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/org/department`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("fetchDepartment error:", err);
    return [];
  }
};

// 팀 목록 가져오기
export const fetchTeam = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/org/team`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("fetchTeam error:", err);
    return [];
  }
};

// 부서장 정보 가져오기
export const fetchDeptHead = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/org/deptHead`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("fetchDeptHead error:", err);
    return [];
  }
};

// 팀장 정보 가져오기
export const fetchTeamHead = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/org/teamHead`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("fetchTeamHead error:", err);
    return [];
  }
};

// 직원 상세 정보 가져오기
export const fetchEmployeeDetail = async (employeeId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/org/employeeDetail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId }),
      credentials: 'include',
    });
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result.message || "직원 상세 조회 실패");
    }
  } catch (err) {
    console.error("fetchEmployeeDetail error:", err);
    return null;
  }
};

// 직원 정보 업데이트
export const updateEmployeeDetail = async ({ id, dept_name, team_name, status }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/org/updateEmployeeDetail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, dept_name, team_name, status }),
      credentials: 'include',
    });
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result.message || "직원 정보 수정 실패");
    }
  } catch (err) {
    console.error("updateEmployeeDetail error:", err);
    return null;
  }
};


export const fetchSummary = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/finance/summary`, {
      method: 'GET',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching summary:", error);
    return null;
  }
};

export const fetchProfitLoss = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/finance/profit-loss`, {
      method: 'GET',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching profit-loss:", error);
    return null;
  }
};

export const fetchYearlyComparison = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/finance/yearly-profit-comparison`, {
      method: 'GET',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching yearly comparison:", error);
    return null;
  }
};

export const fetchBudgetActual = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/finance/budget-actual`, {
      method: 'GET',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching budget vs actual:", error);
    return null;
  }
};

export const fetchDepartmentComparison = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/finance/department-comparison`, {
      method: 'GET',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching department comparison:", error);
    return null;
  }
};

export const uploadPDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/api/finance/upload-pdf`, {
      method: "POST",
      body: formData,
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return null;
  }
};

export const fetchPDFList = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/finance/pdf-list`, {
      method: 'GET',
      credentials: 'include',
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching PDF list:", error);
    return [];
  }
};









