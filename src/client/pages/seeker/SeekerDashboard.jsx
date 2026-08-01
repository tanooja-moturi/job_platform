import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import DashboardLayout from '../../layouts/DashboardLayout';
import JobCard from '../../components/JobCard';
import ApplicationStatusBadge from '../../components/ApplicationStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobService.getJobs({ limit: 6 }),
      applicationService.getMyApplications(),
    ])
      .then(([jobsData, appsData]) => {
        setJobs(jobsData.jobs || []);
        setApplications(appsData.applications || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    applied: applications.length,
    underReview: applications.filter((a) => a.status === 'Under Review').length,
    shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    hired: applications.filter((a) => a.status === 'Hired').length,
  };

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
          Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p style={{ color: 'var(--clr-text-3)' }}>Track your applications and discover new opportunities.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        {[
          { label: 'Total Applied', value: stats.applied, icon: '📩', colorClass: 'stat-icon-blue' },
          { label: 'Under Review', value: stats.underReview, icon: '🔍', colorClass: 'stat-icon-yellow' },
          { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐', colorClass: 'stat-icon-purple' },
          { label: 'Hired', value: stats.hired, icon: '🎉', colorClass: 'stat-icon-green' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`stat-icon ${stat.colorClass}`}>{stat.icon}</div>
            <div className="stat-value">{loading ? '—' : stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Recent Applications</h2>
          <p className="section-subtitle">Track the status of your latest job applications</p>
        </div>
        <Link to="/seeker/applications" className="btn btn-secondary btn-sm">View All</Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <div className="empty-state" style={{ padding: 'var(--space-10) 0' }}>
          <div className="empty-state-icon">📋</div>
          <h3>No Applications Yet</h3>
          <p>Start browsing jobs and apply to ones that interest you.</p>
          <Link to="/jobs" className="btn btn-primary" id="browse-jobs-btn">Browse Jobs</Link>
        </div>
      ) : (
        <div className="table-wrapper" style={{ marginBottom: 'var(--space-8)' }}>
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{app.job?.title || 'N/A'}</td>
                  <td>{app.job?.company || 'N/A'}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td><ApplicationStatusBadge status={app.status} size="small" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Available Jobs */}
      <div className="section-header" style={{ marginTop: 'var(--space-4)' }}>
        <div>
          <h2 className="section-title">Available Jobs</h2>
          <p className="section-subtitle">Recent job postings you might be interested in</p>
        </div>
        <Link to="/jobs" className="btn btn-outline btn-sm">Browse All</Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </DashboardLayout>
  );
}
