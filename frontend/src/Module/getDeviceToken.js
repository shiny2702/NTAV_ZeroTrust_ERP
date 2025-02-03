// ✅ 서버에서 디바이스 토큰을 가져오는 함수
export const getDeviceToken = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/device-token`, {
      method: "GET",
      credentials: "include", // 쿠키나 인증 정보를 함께 보낼 경우
    });

    if (!response.ok) {
      throw new Error("Failed to fetch device token");
    }

    const data = await response.json();
    return data.token; // 서버가 `{ token: "12345" }` 같은 형식으로 응답한다고 가정
  } catch (error) {
    console.error("Error fetching device token:", error);
    return null; // 실패 시 null 반환
  }
};