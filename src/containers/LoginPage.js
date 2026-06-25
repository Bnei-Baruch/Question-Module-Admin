import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import LoginT from 'components/LoginT';
import LoadingT from 'components/LoadingT';

export default function LoginPage() {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/orginaizer');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const onLoginClick = event => {
    event.preventDefault();
    signinRedirect();
  };

  if (isLoading) return <LoadingT />;

  return (
    <div style={{ height: '100%' }}>
      <LoginT onLoginClick={onLoginClick} />
    </div>
  );
}
