import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function EmployerLogin() {
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
      const data = await login(email, password, 'employer');
      toast.success(`Welcome back, ${data.user.name}!`);
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/employer/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1>Employer Login</h1>
          <p>Sign in to your employer account to continue.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="employer-email">Email Address</label>
            <input
              id="employer-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="employer-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="employer-password"
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
            id="employer-login-submit-btn"
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <><div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} /> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--clr-text-3)', fontSize: '0.9rem' }}>
          Don't have an employer account?{' '}
          <Link to="/register" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Create one →</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '12px', color: 'var(--clr-text-3)', fontSize: '0.85rem' }}>
          Are you a job seeker?{' '}
          <Link to="/seeker/login" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Job Seeker Login →</Link>
        </p>
      </div>
    </div>
  );
}

