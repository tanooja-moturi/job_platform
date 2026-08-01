import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const EmployerSidebar = () => (
  <>
    <p className="sidebar-section-title">Overview</p>
    <NavLink to="/employer/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
      <span>📊</span> Dashboard
    </NavLink>

    <p className="sidebar-section-title">Jobs</p>
    <NavLink to="/employer/my-jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <span>💼</span> My Jobs
    </NavLink>
    <NavLink to="/employer/post-job" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <span>➕</span> Post New Job
    </NavLink>

    <p className="sidebar-section-title">Applications</p>
    <NavLink to="/employer/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <span>📋</span> All Applications
    </NavLink>
  </>
);

const SeekerSidebar = () => (
  <>
    <p className="sidebar-section-title">Overview</p>
    <NavLink to="/seeker/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
      <span>📊</span> Dashboard
    </NavLink>

    <p className="sidebar-section-title">Jobs</p>
    <NavLink to="/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <span>🔍</span> Browse Jobs
    </NavLink>

    <p className="sidebar-section-title">Applications</p>
    <NavLink to="/seeker/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <span>📋</span> My Applications
    </NavLink>
  </>
);

export default function DashboardLayout({ children }) {
  const { user, logout, isEmployer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          {isEmployer ? <EmployerSidebar /> : <SeekerSidebar />}

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--clr-border)' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--clr-surface)', marginBottom: '8px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clr-text)' }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-3)', truncate: 'true' }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="sidebar-link btn-ghost w-full" style={{ width: '100%', color: 'var(--clr-danger)', textAlign: 'left' }}>
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        <main className="dashboard-main page-fade">
          {children}
        </main>
      </div>
    </div>
  );
}
