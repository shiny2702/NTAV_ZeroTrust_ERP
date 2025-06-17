import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyTokens, clearUserCookie, clearDeviceCookie, clearSecurityCookie } from './api';

export default function SecureRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await verifyTokens();

      if (result.valid) {
        setLoading(false);
        return;
      }

      const reasons = result.reasons || {};
      console.log('[SecureRoute] Token verification failed:', reasons);
      
      const { deviceToken, securityToken, userToken } = reasons;

      console.log('[SecureRoute] Token status - deviceToken:', deviceToken);
      console.log('[SecureRoute] Token status - securityToken:', securityToken);
      console.log('[SecureRoute] Token status - userToken:', userToken);

      // 1. invalid or error 처리 → 모든 쿠키 삭제 + noPerm 이동
      const hasCriticalError =
        ['invalid', 'error'].includes(deviceToken) ||
        ['invalid', 'error'].includes(securityToken) ||
        ['invalid', 'error'].includes(userToken);

      if (hasCriticalError) {
        await Promise.all([
          clearDeviceCookie(),
          clearSecurityCookie(),
          clearUserCookie(),
        ]);
        navigate('/noPerm');
        return;
      }

      // 2-1. quarantine 관련 문제 (missing 또는 expired)
      const hasQuarantineIssue =
        ['missing', 'expired'].includes(deviceToken) ||
        ['missing', 'expired'].includes(securityToken);

      if (hasQuarantineIssue) {
        await Promise.all([
          clearDeviceCookie(),
          clearSecurityCookie(),
          clearUserCookie(),
        ]);
        window.location.href = 'https://ntav.project:4430/quarantine-frontend/';
        return;
      }

      // 2-2. userToken만 missing/expired
      const hasUserIssue = ['missing', 'expired'].includes(userToken);
      if (hasUserIssue) {
        await clearUserCookie();
        window.location.href = 'https://ntav.project:4430/erp-frontend/';
        return;
      }

      // 예외 처리: 위 조건에 모두 해당하지 않는 경우
      navigate('/noPerm');
    })();
  }, [navigate]);

  if (loading) return null;
  return children;
}