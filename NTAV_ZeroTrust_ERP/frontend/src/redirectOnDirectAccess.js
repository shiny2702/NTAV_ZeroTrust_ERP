import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

const RedirectOnDirectAccess = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 네비게이션 타입을 안전하게 가져오기
    const navigationEntries = window.performance.getEntriesByType("navigation");
    const navigationType = navigationEntries.length > 0 ? navigationEntries[0]?.type : null;

    const fromApp = sessionStorage.getItem("fromApp");

    // 직접 URL 입력해서 접근한 경우 무조건 차단
    if (!fromApp || fromApp !== "true") {
      sessionStorage.setItem("hasReloaded", "false");
      navigate('/noPerm');
    } 

    // 진입 시 네비게이션 타입이 'navigate'일 때 처리
    if (navigationType === 'navigate') {
      sessionStorage.setItem("hasReloaded", "false");
      navigate('/noPerm');
    }
  }, [navigate]);

  return children;
};

export default RedirectOnDirectAccess;



