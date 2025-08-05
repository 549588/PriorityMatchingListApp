import React from 'react';

const Spinner: React.FC<{ message?: string }> = ({ message }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '30vh', width: '100%',
  }}>
    <div style={{
      border: '6px solid #e0e7ff',
      borderTop: '6px solid #6366f1',
      borderRadius: '50%',
      width: 48,
      height: 48,
      animation: 'spin 1s linear infinite',
      marginBottom: 16
    }} />
    {message && <div style={{ color: '#6366f1', fontWeight: 500 }}>{message}</div>}
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Spinner;
