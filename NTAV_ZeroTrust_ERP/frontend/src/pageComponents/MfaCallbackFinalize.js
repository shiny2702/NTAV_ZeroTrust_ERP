// frontend/src/pageComponents/NtaProjectMfaFinalize.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyMfaToken, finalizeMfaAndIssueNewUserToken } from '../api';

const MfaCallbackFinalizePage = () => { 
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idToken = params.get('id_token');
    const state = params.get('state') || '/';

    const finalizeMfa = async () => {
    try {
        console.log('[MFA] Step 1: Verifying id_token');
        const email = await verifyMfaToken(idToken);
        console.log('[MFA] Step 2: Email verified →', email);

        sessionStorage.setItem('fromApp', 'true');
        sessionStorage.setItem('hasReloaded', 'false');
        sessionStorage.setItem('mfaVerified', 'true') 
        console.log('[MFA] Step 3: SessionStorage set');

        await finalizeMfaAndIssueNewUserToken(email);
        console.log('[MFA] Step 4: Token issued, navigating to:', state);

        navigate(state);
    } catch (err) {
        console.error('[MFA] Error during finalization:', err);
        alert(err.message || '최종 MFA 인증 실패');
        navigate('/');
    }
    };

    if (idToken) {
      finalizeMfa();
    } else {
      alert('id_token 누락');
      navigate('/');
    }
  }, [location, navigate]);

  return <div>최종 인증 처리 중...</div>;
};

export default MfaCallbackFinalizePage;

