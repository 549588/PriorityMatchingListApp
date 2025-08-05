import React, { useState } from 'react';
import Spinner from './Spinner.tsx';

type LoginProps = {
  onLogin: (email: string, password: string) => Promise<string | null>;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Use API URL from env
    const errMsg = await onLogin(email, password);
    if (errMsg) setError(errMsg);
    setLoading(false);
  };

  if (loading) return <Spinner message="Logging in..." />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)',
    }}>
      <div style={{
        width: 400,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px 0 rgba(80,80,180,0.10)',
        padding: 36,
        textAlign: 'center',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}>
        <h2 style={{ marginBottom: 8, color: '#3b3b7a' }}>Welcome to Evaluation Platform</h2>
        <div style={{ fontSize: 15, color: '#666', marginBottom: 18 }}>
          Please login to access the skill evaluation platform.<br />
          Enter your registered email and password.
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 500, color: '#3b3b7a' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #c7d2fe',
                marginTop: 4,
                fontSize: 15,
              }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 500, color: '#3b3b7a' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #c7d2fe',
                marginTop: 4,
                fontSize: 15,
              }}
            />
          </div>
          {error && <div style={{ color: 'red', marginTop: 2, fontSize: 14 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '10px 0',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px 0 rgba(80,80,180,0.08)'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
