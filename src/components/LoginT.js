import React from 'react';
import WcvLogoT from 'components/WcvLogoT';
import Button from '@mui/material/Button';

export default function LoginT({ onLoginClick }) {
  return (
    <div style={{ height: '100vh' }}>
      <WcvLogoT style={{ padding: 20 }} />
      <div>
        <Button
          onClick={onLoginClick}
          style={{ left: 'calc(50vw - 50px)', top: 'calc(50vh - 21px)', position: 'absolute' }}
          variant="contained"
          size="large"
          color="primary">
          LOGIN
        </Button>
      </div>
    </div>
  );
}
