import React from 'react';

export default function WcvLogoT({ style }) {
  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center' }}>
      <img src="./logoT.png" style={{ height: 120 }} alt="logo" />
      <div style={{ marginLeft: -5 }}>
        <div style={{ fontFamily: 'Noto Sans JP', fontSize: 16, color: '#42c6d2' }}>OUT CONNECTION</div>
        <div style={{ fontFamily: 'Noto Sans JP', fontWeight: 700, fontSize: 16, color: '#14447c' }}>NETWORK</div>
      </div>
    </div>
  );
}
