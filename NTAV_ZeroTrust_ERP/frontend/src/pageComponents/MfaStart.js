// frontend/src/pageComponents/MfaStart.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MfaStartPage = () => {
  const location = useLocation();

  useEffect(() => {
    // URL 쿼리에서 redirect 파라미터 가져오기 (예: /mfa/start?redirect=/main)
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect') || '/';

    const baseUrl = process.env.REACT_APP_NGROK_BASE_URL || 'https://ntav.project:4430';
    const redirectUri = encodeURIComponent(`${baseUrl}/erp-frontend/mfa/callback`);
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const scope = "email profile openid";
    const nonce = "secureNonce";

    // redirect 경로를 state에 넣어서 전달
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=${nonce}&prompt=select_account&state=${encodeURIComponent(redirect)}`;

    window.location.href = googleAuthUrl;
  }, [location.search]);

  return <div>Redirecting to Google for MFA...</div>;
};

export default MfaStartPage;
