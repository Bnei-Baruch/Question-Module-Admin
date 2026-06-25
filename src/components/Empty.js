import React from 'react';
import WcvLogo from 'components/WcvLogo';

export default function Empty() {
  return (
    <div style={{ height: '100vh', background: '#474040' }}>
      <WcvLogo style={{ padding: 20 }} />
      <div style={{ paddingTop: '24vh', color: 'white', textAlign: 'center', fontSize: 24, fontFamily: 'Noto Sans JP' }}>
        NO USERS WERE FOUND<br />
        auto refresh in 10 min.
      </div>
    </div>
  );
}
