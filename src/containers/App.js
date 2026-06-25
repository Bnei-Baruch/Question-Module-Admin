import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BusyIndicator from '../components/BusyIndicator';
import NotificationDialog from '../components/NotificationDialog';
import Header from 'containers/Header';
import LoginPage from 'containers/LoginPage';
import CallbackPage from 'containers/CallbackPage';
import Orginaizer from 'components/Orginazer';
import Rav from 'components/Rav';
import Tags from 'components/Tags';
import Speaker from 'components/Speaker';
import { getQuestions } from 'actions/questions';

const theme = createTheme();

function PrivateRoute({ element: Element }) {
  const user = useSelector(state => state.oidcUser.user);
  if (!user || user.expired) return <LoginPage />;
  return <Element />;
}

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.oidcUser.user);
  const prevUser = useRef(null);

  useEffect(() => {
    if (!prevUser.current && user) {
      dispatch(getQuestions());
    }
    prevUser.current = user;
  }, [user, dispatch]);

  return (
    <div style={{ height: '100%' }}>
      <ThemeProvider theme={theme}>
        <BusyIndicator />
        <NotificationDialog />
        <Header />
        <Routes>
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/orginaizer" element={<PrivateRoute element={Orginaizer} />} />
          <Route path="/speaker" element={<PrivateRoute element={Speaker} />} />
          <Route path="/rav" element={<PrivateRoute element={Rav} />} />
          <Route path="/tags" element={<PrivateRoute element={Tags} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}
