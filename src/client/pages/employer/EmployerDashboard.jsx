import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import DashboardLayout from '../../layouts/DashboardLayout';
import ApplicationStatusBadge from '../../components/ApplicationStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobService.getMyJobs(),
      applicationService.getEmployerApplications(),
    ])
      .then(([jobsData, appsData]) => {
        setJobs(jobsData.jobs || []);
        setApplications(appsData.applications || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.isActive).length,
    totalApplications: applications.length,
    underReview: applications.filter((a) => a.status === 'Under Review').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
          Welcome, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 🏢
        </h1>
        <p style={{ color: 'var(--clr-text-3)' }}>Manage your job listings and review applicants.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total Jobs Posted', value: stats.totalJobs, icon: '💼', colorClass: 'stat-icon-blue' },
          { label: 'Active Jobs', value: stats.activeJobs, icon: '✅', colorClass: 'stat-icon-green' },
          { label: 'Total Applications', value: stats.totalApplications, icon: '📋', colorClass: 'stat-icon-purple' },
          { label: 'Under Review', value: stats.underReview, icon: '🔍', colorClass: 'stat-icon-yellow' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`stat-icon ${stat.colorClass}`}>{stat.icon}</div>
            <div className="stat-value">{loading ? '—' : stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
        <Link to="/employer/post-job" className="btn btn-primary" id="quick-post-job">
          ➕ Post New Job
        </Link>
        <Link to="/employer/my-jobs" className="btn btn-secondary" id="quick-my-jobs">
          💼 Manage Jobs
        </Link>
        <Link to="/employer/applications" className="btn btn-secondary" id="quick-applications">
          📋 View Applications
        </Link>
      </div>

      {/* Recent Jobs */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Recent Jobs</h2>
          <p className="section-subtitle">Your most recently posted job listings</p>
        </div>
        <Link to="/employer/my-jobs" className="btn btn-secondary btn-sm">View All</Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <div className="empty-state" style={{ padding: 'var(--space-10) 0' }}>
          <div className="empty-state-icon">💼</div>
          <h3>No Jobs Posted Yet</h3>
          <p>Create your first job listing to start receiving applications.</p>
          <Link to="/employer/post-job" className="btn btn-primary" id="post-first-job">Post Your First Job</Link>
        </div>
      ) : (
        <div className="table-wrapper" style={{ marginBottom: 'var(--space-8)' }}>
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 5).map((job) => (
                <tr key={job._id}>
                  <td style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{job.title}</td>
                  <td>{job.location}</td>
                  <td><span className="badge badge-primary">{job.employmentType}</span></td>
                  <td>
                    <span className={`badge ${job.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {job.isActive ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(job.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/employer/edit-job/${job._id}`} className="btn btn-secondary btn-sm" id={`dash-edit-${job._id}`}>Edit</Link>
                      <Link to={`/employer/applications?jobId=${job._id}`} className="btn btn-outline btn-sm" id={`dash-apps-${job._id}`}>Apps</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Applications */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Recent Applications</h2>
          <p className="section-subtitle">Latest applicants across all your jobs</p>
        </div>
        <Link to="/employer/applications" className="btn btn-secondary btn-sm">View All</Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <div className="empty-state" style={{ padding: 'var(--space-8) 0' }}>
          <div className="empty-state-icon">📬</div>
          <h3>No Applications Yet</h3>
          <p>Applications will appear here once candidates apply to your jobs.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 8).map((app) => (
                <tr key={app._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{app.applicant?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-3)' }}>{app.applicant?.email}</div>
                  </td>
                  <td>{app.job?.title}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td><ApplicationStatusBadge status={app.status} size="small" /></td>
                  <td>
                    <Link to={`/employer/applications?appId=${app._id}`} className="btn btn-secondary btn-sm" id={`dash-app-${app._id}`}>
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
