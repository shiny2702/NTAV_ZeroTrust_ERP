export async function fetchWithMfa(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (response.status === 403) {
    // 403 응답 시 JSON body를 미리 읽어둠
    const data = await response.clone().json();

    if (data.error === 'MFA_REQUIRED') {
      const basename = '/erp-frontend';
      let currentPath =
        window.location.pathname + window.location.search + window.location.hash;

      if (currentPath.startsWith(basename)) {
        currentPath = currentPath.slice(basename.length);
      }

      const baseUrl = process.env.REACT_APP_NGROK_BASE_URL || 'https://ntav.project:4430';
      window.location.href = `${baseUrl}/erp-frontend/mfa/start?redirect=${encodeURIComponent(currentPath)}`;

      // MFA 리다이렉션 시점에 에러 발생시키기
      throw new Error('MFA Required');
    }

    // MFA_REQUIRED 외 403 응답인 경우, body가 이미 읽힌 상태이므로
    // body를 재사용할 수 있게 clone으로 새로 읽은 response 반환
    return response.clone();
  }

  return response;
}

