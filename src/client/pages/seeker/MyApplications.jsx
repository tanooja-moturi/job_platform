import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import ApplicationStatusBadge from '../../components/ApplicationStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function MyApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    applicationService.getMyApplications()
      .then((data) => setApplications(data.applications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STATUS_FILTERS = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
  const filtered = filter === 'All' ? applications : applications.filter((a) => a.status === filter);

  const handleViewResume = (appId) => {
    const url = applicationService.getResumeUrl(appId);
    const token = localStorage.getItem('jb_token');
    // Open with authentication — we must use fetch then create object URL
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch resume');
        return res.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
      })
      .catch(() => alert('Could not load resume. Please try again.'));
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track all your job applications and their current status</p>
      </div>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            id={`filter-${s.toLowerCase().replace(' ', '-')}`}
          >
            {s}
            {s !== 'All' && (
              <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                ({applications.filter((a) => a.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{filter === 'All' ? '📋' : '🔍'}</div>
          <h3>{filter === 'All' ? 'No Applications Yet' : `No "${filter}" Applications`}</h3>
          <p>{filter === 'All' ? 'Start applying to jobs to see them here.' : 'Try a different filter.'}</p>
          {filter === 'All' && <Link to="/jobs" className="btn btn-primary" id="browse-jobs-empty">Browse Jobs</Link>}
          {filter !== 'All' && <button onClick={() => setFilter('All')} className="btn btn-secondary">Show All</button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((app) => (
            <div key={app._id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Company Logo */}
              <div
                style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                  background: `hsl(${((app.job?.company || 'A').charCodeAt(0) * 37) % 360}, 60%, 45%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1rem', color: '#fff', flexShrink: 0,
                }}
              >
                {(app.job?.company || 'X').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '4px' }}>
                  {app.job?.title || 'Job Removed'}
                </h3>
                <p style={{ color: 'var(--clr-primary-light)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                  {app.job?.company || 'N/A'}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {app.job?.location && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>📍 {app.job.location}</span>
                  )}
                  {app.job?.employmentType && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>⏰ {app.job.employmentType}</span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>
                    📅 Applied {formatDate(app.createdAt)}
                  </span>
                </div>
                {app.coverLetter && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--clr-bg-2)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--clr-text-3)', borderLeft: '3px solid var(--clr-primary)' }}>
                    <strong style={{ color: 'var(--clr-text-2)' }}>Cover Letter: </strong>
                    {app.coverLetter.substring(0, 150)}{app.coverLetter.length > 150 ? '...' : ''}
                  </div>
                )}
              </div>

              {/* Status & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                <ApplicationStatusBadge status={app.status} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  {app.job?._id && (
                    <Link to={`/jobs/${app.job._id}`} className="btn btn-secondary btn-sm" id={`view-job-${app._id}`}>
                      View Job
                    </Link>
                  )}
                  <button
                    onClick={() => handleViewResume(app._id)}
                    className="btn btn-outline btn-sm"
                    id={`view-resume-${app._id}`}
                  >
                    📄 My Resume
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
