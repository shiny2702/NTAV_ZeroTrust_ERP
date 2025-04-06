const BASE_URL = "http://192.168.100.51:5000";

export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
    // const response = await fetch('http://222.110.177.89:8080/api/auth/login', {
    // const response = await fetch('http://127.0.0.1:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
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
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};




export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/employees`);
    return response.json();
  } catch (error) {
    console.error("직원 리스트를 가져오는 중 오류 발생:", error);
  }
};


export const fetchRegisterableEmployeeIds = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/employee/registerable`);
    if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('등록 가능한 직원 조회 실패:', err);
    return []; // 혹은 null / 에러 throw
  }
};

export const fetchEmployeeDetails = async (employeeId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/employee/details/${employeeId}`);
    if (!res.ok) throw new Error(`직원 정보 조회 실패 (code: ${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('직원 상세 정보 조회 중 오류:', err);
    return null; // 혹은 에러 throw
  }
};

export const registerEmployee = async (employeeId, randomPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId, password: randomPassword }),
    });
    
    if (!response.ok) {
      throw new Error("직원 등록 실패");
    }
    
    const data = await response.json();
    return data.message === '직원 등록 성공'; // 성공 여부를 반환
  } catch (error) {
    console.error("직원 등록 중 오류 발생:", error);
    return false;
  }
};

export const deleteSelectedEmployees = async (selectedEmployees) => {
  try {
    const response = await fetch(`${BASE_URL}/api/employee/employees`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedEmployees }),
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

export const updateEmployee = async (id, data) => {
  try {
    console.log('Employee ID:', id); // ID가 올바르게 전달되는지 확인
    const response = await fetch(`${BASE_URL}/api/employee/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: data.is_active,
        is_initial_password: data.is_initial_password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`직원 정보 업데이트 실패: ${errorData.error || '알 수 없는 오류'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('직원 정보 업데이트 실패:', error);
    alert('직원 정보 업데이트 실패');
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
    });

    const result = await response.json();

    return result.success;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};







