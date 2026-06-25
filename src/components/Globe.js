import React from 'react';
import BBLogo from 'components/BBLogo';

export default function Globe({ style }) {
  const size = (style && style.height) || 100;
  return (
    <div style={{ width: size, height: size, overflow: 'hidden', borderRadius: size / 2, position: 'relative' }}>
      <video style={{ position: 'absolute', top: size * (-96 / 300), height: size * (488 / 300), left: size * (-287 / 300) }} autoPlay loop muted>
        <source src="./globe.mov" />
      </video>
      <BBLogo style={{ position: 'absolute', opacity: 0.7, height: size * 0.9, top: size * 0.05, left: size * 0.235 }} />
    </div>
  );
}
