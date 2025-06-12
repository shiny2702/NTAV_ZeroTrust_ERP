// frontend/src/pageComponents/MfaCallback.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MfaCallbackPage = () => {
  const location = useLocation();

  useEffect(() => {
    // 해시(#) 부분에서 id_token과 state 추출
    const hash = location.hash.substring(1); // # 제거
    const params = new URLSearchParams(hash);
    const idToken = params.get("id_token");
    const state = params.get("state"); // Google 인증 요청 시 보낸 state 값

    if (idToken) {
      // ntav.project로 redirect하면서 id_token과 state 전달
      const redirectUrl = `https://ntav.project:4430/erp-frontend/mfa/callbackFinalize?id_token=${encodeURIComponent(idToken)}&state=${encodeURIComponent(state || '/')}`;
      window.location.href = redirectUrl;
    } else {
      alert('MFA 토큰이 누락되었습니다.');
      window.location.href = `https://ntav.project:4430/erp-frontend/`;
    }
  }, [location]);

  return <div>인증 처리 중...</div>;
};

export default MfaCallbackPage;

