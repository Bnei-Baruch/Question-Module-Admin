import React from 'react';
import { useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

export default function BusyIndicator() {
  const busyIndicator = useSelector(state => state.busyIndicator);

  if (busyIndicator.step === 0 && !busyIndicator.progress) return null;

  return (
    <div style={{
      height: '100%', width: '100%', position: 'absolute',
      top: 0, left: 0, background: 'rgba(0,0,0,0.01)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999999999999
    }}>
      <ClipLoader size={150} color="#2e88c8" loading />
      {!!busyIndicator.progress && (
        <div style={{ fontFamily: 'arial', position: 'absolute', fontSize: 28, opacity: 0.5, textAlign: 'center', color: 'white' }}>
          {busyIndicator.progress}
        </div>
      )}
    </div>
  );
}
