import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import ConnectGalaxyT from 'components/ConnectGalaxyT';

export default function CallbackPage() {
  const { isLoading, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/orginaizer', { replace: true });
      } else if (error) {
        console.error('callback error', error);
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  if (error) return <div style={{ padding: 20, color: 'red' }}>Auth error: {error.message}</div>;
  return <ConnectGalaxyT />;
}
