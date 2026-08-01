import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(data.user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login fill
  const fillDemo = (role) => {
    if (role === 'employer') {
      setEmail('employer@example.com');
      setPassword('Employer@123');
    } else {
      setEmail('jobseeker@example.com');
      setPassword('JobSeeker@123');
    }
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div className="navbar-logo">JB</div>
            <span className="navbar-brand-text">JobBoard</span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {/* Demo credentials */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button onClick={() => fillDemo('employer')} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }} id="demo-employer-btn">
            🏢 Demo Employer
          </button>
          <button onClick={() => fillDemo('seeker')} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }} id="demo-seeker-btn">
            👤 Demo Seeker
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>or sign in manually</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-3)', fontSize: '1.1rem' }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loading}
            id="login-submit-btn"
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <><div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} /> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--clr-text-3)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}
