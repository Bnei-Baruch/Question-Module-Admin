import React from 'react';
import WcvLogoT from 'components/WcvLogoT';

export default function EmptyT() {
  return (
    <div style={{ height: '100vh' }}>
      <WcvLogoT style={{ padding: 20 }} />
      <div style={{ paddingTop: '24vh', color: '#14447c', textAlign: 'center', fontSize: 24, fontFamily: 'Noto Sans JP' }}>
        auto refresh in 10 min.
      </div>
    </div>
  );
}
