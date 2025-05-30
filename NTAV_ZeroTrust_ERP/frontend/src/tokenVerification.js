import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyTokens } from './api';

export default function SecureRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const valid = await verifyTokens();
      if (!valid) {
        navigate('/noPerm');
      } else {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return null;
  return children;
}
