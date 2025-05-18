import React from 'react';

const GoogleLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        background: '#fff',
        color: '#444',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: '8px 16px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        style={{ width: 20, height: 20 }}
      />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
