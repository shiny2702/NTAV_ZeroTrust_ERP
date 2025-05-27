const SERVER_URL = "https://ntav.project:4430/quarantine";

export const sendInfoToServer = async (osInfo, browserInfo, networkInfo) => {
    
    // JSON 형식으로 데이터 준비
    // 수집한 정보 payload 객체에 저장
    const payload = {
        osInfo: osInfo,
        browserInfo: browserInfo,
        networkInfo: networkInfo,
      };

    try {
      console.log("Sending data to server...");
      // 디바이스 정보 전송
      const response = await fetch(`${SERVER_URL}/api/verify-device`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // JSON 형식으로 전달
        },
        credentials: 'include', // ✅ 쿠키 포함(임시)
        body: JSON.stringify(payload),
      });

      console.log("Payload being sent to server:", payload);

      // 서버 응답 처리
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("디바이스 정보 전송 성공:", data.message);
          console.log(data);
          return data; // 서버에서 반환한 deviceToken 반환
        } else {
          console.error("디바이스 검증 실패:", data.error);
        }
      } else {
        console.error("Failed to send data");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

export const getSecurityToken = async () => {
  try {
    console.log("🔐 Security Checking... (클라이언트)");
    
    const response = await fetch(`${SERVER_URL}/security/verify-security`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include', // 쿠키 포함
    });

    console.log("🌐 서버 응답 상태:", response.status);

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        console.log("✅ 보안 검증 성공:", data.message);
        console.log("📦 서버 응답 데이터:", data);
        return data;
      } else {
        console.warn("⚠️ 보안 검증 실패:", data.error);
        return null;
      }
    } else {
      console.error("❌ 서버 응답 실패:", response.status);
      return null;
    }
  } catch (error) {
    console.error("❌ 클라이언트 요청 오류:", error);
    return null;
  }
};


// 서버에서 디바이스 토큰을 가져오는 함수
/*export const getDeviceToken = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/verify-device`, {
      method: "GET"
      //credentials: "include" // 쿠키나 인증 정보를 함께 보낼 경우
    });

    console.log("Server Response:", response);  // 서버 응답 확인

    if (!response.ok) {
      throw new Error("Failed to fetch device token");
    }

    const data = await response.json();
    console.log("Response Data:", data);  // JSON 응답 데이터 확인
    
    if (data.success) {
      return data.deviceToken; // 서버가 `{ deviceToken: "token" }` 형식으로 응답한다고 가정
    } else {
      console.error("디바이스 토큰 가져오기 실패:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching device token:", error);
    return null; // 실패 시 null 반환
  }
  };*/