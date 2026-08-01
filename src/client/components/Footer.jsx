import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="navbar-logo">JB</div>
              <span className="navbar-brand-text">JobBoard</span>
            </div>
            <p style={{ color: 'var(--clr-text-3)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '280px' }}>
              Connecting talented professionals with great companies. Find your dream job or hire top talent today.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem', color: 'var(--clr-text)' }}>For Job Seekers</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/jobs" style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem', transition: 'color 150ms' }}>Browse Jobs</Link></li>
              <li><Link to="/register" style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem' }}>Create Account</Link></li>
              <li><Link to="/login" style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem' }}>Sign In</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem', color: 'var(--clr-text)' }}>For Employers</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/register" style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem' }}>Post a Job</Link></li>
              <li><Link to="/employer/dashboard" style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem' }}>Dashboard</Link></li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem', color: 'var(--clr-text)' }}>Built With</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'].map((tech) => (
                <li key={tech} style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem' }}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} JobBoard Platform. Built as a MERN Stack Assessment.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--clr-text-3)' }}>MongoDB • Express • React • Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
