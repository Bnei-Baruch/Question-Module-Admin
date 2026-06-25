import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from 'react-oidc-context';
import { store } from '../store/configureStore';
import { oidcConfig } from '../utils/userManager';
import { setOidcUser } from '../store/oidcUserSlice';
import App from './App';

function SyncOidcUser() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setOidcUser(user ? { ...user } : null));
  }, [user, dispatch]);
  return null;
}

export default function Root() {
  return (
    <Provider store={store}>
      <AuthProvider
          {...oidcConfig}
          onSigninCallback={() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        >
        <BrowserRouter>
          <SyncOidcUser />
          <div style={{ height: '100%' }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;700&display=swap');`}</style>
            <App />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
