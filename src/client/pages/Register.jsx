import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'jobseeker' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await register(formData.name.trim(), formData.email.trim(), formData.password, formData.role);
      toast.success(`Welcome to JobBoard, ${data.user.name}! 🎉`);
      navigate(data.user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div className="navbar-logo">JB</div>
            <span className="navbar-brand-text">JobBoard</span>
          </Link>
          <h1>Create Account</h1>
          <p>Join thousands of professionals on JobBoard</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>⚠️ {errors.general}</div>
          )}

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className="role-selector">
              <div className="role-option">
                <input
                  type="radio"
                  id="role-jobseeker"
                  name="role"
                  value="jobseeker"
                  checked={formData.role === 'jobseeker'}
                  onChange={handleChange}
                />
                <label htmlFor="role-jobseeker" className="role-option-label">
                  <span className="role-option-icon">👤</span>
                  <span className="role-option-title">Job Seeker</span>
                  <span className="role-option-desc">Looking for a job</span>
                </label>
              </div>
              <div className="role-option">
                <input
                  type="radio"
                  id="role-employer"
                  name="role"
                  value="employer"
                  checked={formData.role === 'employer'}
                  onChange={handleChange}
                />
                <label htmlFor="role-employer" className="role-option-label">
                  <span className="role-option-icon">🏢</span>
                  <span className="role-option-title">Employer</span>
                  <span className="role-option-desc">Hiring talent</span>
                </label>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name <span className="required">*</span></label>
            <input
              id="reg-name"
              name="name"
              type="text"
              className={`form-control ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address <span className="required">*</span></label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-3)' }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password <span className="required">*</span></label>
            <input
              id="reg-confirm"
              name="confirmPassword"
              type={showPass ? 'text' : 'password'}
              className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} id="register-submit-btn" style={{ marginTop: '8px' }}>
            {loading ? (
              <><div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} /> Creating account...</>
            ) : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--clr-text-3)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
