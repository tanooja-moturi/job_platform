import React from 'react';

export default function LoadingSpinner({ message = 'Loading...', size = 'default', fullPage = false }) {
  const content = (
    <div className="loading-screen">
      <div className={`spinner ${size === 'small' ? 'spinner-sm' : size === 'large' ? 'spinner-lg' : ''}`} />
      {message && <p>{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </div>
    );
  }

  return content;
}
