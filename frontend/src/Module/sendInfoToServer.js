const SERVER_URL = "http://ntav-backend.com"

export const sendInfoToServer = async (osInfo, browserInfo, networkInfo) => {
    
    // JSON 형식으로 데이터 준비비
    // 수집한 정보 payload 객체에 저장
    const payload = {
        os: osInfo,
        browser: browserInfo,
        network: networkInfo,
      };

    try {
        const response = await fetch(`${SERVER_URL}/api/device-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // JSON 형식으로 전달
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log("Data sent successfully");
        } else {
          console.error("Failed to send data");
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
  };