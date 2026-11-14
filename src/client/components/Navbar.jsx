import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isEmployer, isJobSeeker } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">JB</div>
          <span className="navbar-brand-text">JobBoard</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-nav" style={{ display: 'flex' }}>
          <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Browse Jobs
          </NavLink>
          {isEmployer && (
            <>
              <NavLink to="/employer/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/employer/post-job" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Post a Job
              </NavLink>
            </>
          )}
          {isJobSeeker && (
            <NavLink to="/seeker/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Auth area */}
        <div className="navbar-user">
          {user ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: '1px solid var(--clr-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  color: 'var(--clr-text)',
                }}
                className="btn-ghost"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  background: 'var(--clr-bg-2)',
                  border: '1px solid var(--clr-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '8px',
                  minWidth: '200px',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 200,
                  animation: 'slideUp 200ms ease',
                }}>
                  <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--clr-border)', marginBottom: '8px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--clr-text)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.775rem', color: 'var(--clr-text-3)' }}>{user.email}</p>
                    <span className={`badge ${isEmployer ? 'badge-accent' : 'badge-primary'}`} style={{ marginTop: '6px', fontSize: '0.7rem' }}>
                      {isEmployer ? '🏢 Employer' : '👤 Job Seeker'}
                    </span>
                  </div>
                  {isEmployer && (
                    <>
                      <Link to="/employer/dashboard" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--clr-text-2)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 150ms' }} className="nav-link">
                        📊 Dashboard
                      </Link>
                      <Link to="/employer/my-jobs" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--clr-text-2)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 150ms' }} className="nav-link">
                        💼 My Jobs
                      </Link>
                      <Link to="/employer/applications" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--clr-text-2)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 150ms' }} className="nav-link">
                        📋 Applications
                      </Link>
                    </>
                  )}
                  {isJobSeeker && (
                    <>
                      <Link to="/seeker/dashboard" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--clr-text-2)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 150ms' }} className="nav-link">
                        📊 Dashboard
                      </Link>
                      <Link to="/seeker/applications" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--clr-text-2)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 150ms' }} className="nav-link">
                        📋 My Applications
                      </Link>
                    </>
                  )}
                  <div style={{ borderTop: '1px solid var(--clr-border)', marginTop: '8px', paddingTop: '8px' }}>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--clr-danger)', fontSize: '0.875rem', width: '100%', cursor: 'pointer', background: 'none', border: 'none', transition: 'all 150ms' }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link to="/employer/login" className="btn btn-ghost btn-sm">Employer Login</Link>
              <Link to="/seeker/login" className="btn btn-ghost btn-sm">Job Seeker Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
