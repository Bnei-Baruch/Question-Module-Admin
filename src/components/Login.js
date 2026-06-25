import React from 'react';
import WcvLogo from 'components/WcvLogo';
import Button from '@mui/material/Button';

export default function Login({ onLoginClick }) {
  return (
    <div style={{ height: '100vh', background: '#474040' }}>
      <WcvLogo style={{ padding: 20 }} />
      <div>
        <Button
          onClick={onLoginClick}
          style={{ left: 'calc(50vw - 50px)', top: 'calc(50vh - 21px)', backgroundColor: '#009eff', position: 'absolute' }}
          variant="contained"
          size="large"
          color="primary">
          LOGIN
        </Button>
      </div>
    </div>
  );
}
