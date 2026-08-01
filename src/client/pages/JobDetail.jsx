import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import MainLayout from '../layouts/MainLayout';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function JobDetail() {
  const { id } = useParams();
  const { user, isJobSeeker, isEmployer } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApp, setCheckingApp] = useState(false);

  useEffect(() => {
    jobService.getJobById(id)
      .then((data) => setJob(data.job))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isJobSeeker && job) {
      setCheckingApp(true);
      applicationService.getMyApplications()
        .then((data) => {
          const applied = data.applications.some((app) => app.job?._id === id || app.job === id);
          setHasApplied(applied);
        })
        .catch(() => {})
        .finally(() => setCheckingApp(false));
    }
  }, [isJobSeeker, job, id]);

  if (loading) return <MainLayout><LoadingSpinner fullPage /></MainLayout>;
  if (!job) return (
    <MainLayout>
      <div className="container" style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>😕</div>
        <h2 style={{ margin: '16px 0 8px' }}>Job Not Found</h2>
        <p style={{ color: 'var(--clr-text-3)', marginBottom: '24px' }}>This job may have been removed or the link is incorrect.</p>
        <Link to="/jobs" className="btn btn-primary">Browse All Jobs</Link>
      </div>
    </MainLayout>
  );

  const isOwner = isEmployer && job.employer?._id === user?._id;

  return (
    <MainLayout>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {/* Back */}
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--clr-text-3)', fontSize: '0.875rem', marginBottom: '24px', textDecoration: 'none' }}>
          ← Back to Jobs
        </Link>

        {/* Header Card */}
        <div className="job-detail-header">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              className="job-company-logo"
              style={{ width: '64px', height: '64px', fontSize: '1.5rem', flexShrink: 0, background: `hsl(${(job.company.charCodeAt(0) * 37) % 360}, 60%, 50%)` }}
            >
              {job.company.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{job.title}</h1>
              <p style={{ color: 'var(--clr-primary-light)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: '16px' }}>{job.company}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clr-text-3)', fontSize: '0.9rem' }}>
                  📍 {job.location}
                </span>
                <span className={`badge ${job.employmentType === 'Remote' ? 'badge-primary' : 'badge-success'}`}>
                  {job.employmentType}
                </span>
                {job.salary && job.salary !== 'Not specified' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clr-success)', fontWeight: 600, fontSize: '0.9rem' }}>
                    💰 {job.salary}
                  </span>
                )}
                <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>
                  📅 Posted {formatDate(job.createdAt)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
              {isOwner && (
                <>
                  <Link to={`/employer/edit-job/${job._id}`} className="btn btn-secondary" id="edit-job-btn">
                    ✏️ Edit
                  </Link>
                </>
              )}
              {isJobSeeker && (
                hasApplied ? (
                  <span className="btn btn-secondary" style={{ cursor: 'default' }}>✅ Applied</span>
                ) : (
                  <Link to={`/apply/${job._id}`} className="btn btn-primary btn-lg" id="apply-btn">
                    🚀 Apply Now
                  </Link>
                )
              )}
              {!user && (
                <Link to="/login" className="btn btn-primary btn-lg" id="login-to-apply-btn">
                  Login to Apply
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="job-detail-body">
          {/* Left column */}
          <div>
            <div className="job-detail-section">
              <h3>📋 Job Description</h3>
              <div style={{ color: 'var(--clr-text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9375rem' }}>
                {job.description}
              </div>
            </div>

            <div className="job-detail-section">
              <h3>✅ Requirements</h3>
              <div style={{ color: 'var(--clr-text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9375rem' }}>
                {job.requirements}
              </div>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="job-detail-section">
                <h3>🛠️ Required Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {job.skills.map((skill) => (
                    <span key={skill} className="skill-tag" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div>
            <div className="job-apply-sidebar">
              <h3 style={{ fontSize: '1.0625rem', marginBottom: '20px' }}>Job Overview</h3>

              {[
                { label: 'Location', value: job.location, icon: '📍' },
                { label: 'Employment Type', value: job.employmentType, icon: '⏰' },
                { label: 'Salary', value: job.salary || 'Not specified', icon: '💰' },
                { label: 'Company', value: job.company, icon: '🏢' },
                { label: 'Posted On', value: formatDate(job.createdAt), icon: '📅' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--clr-border)' }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-3)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--clr-text)', fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}

              {isJobSeeker && (
                hasApplied ? (
                  <div className="alert alert-success" style={{ textAlign: 'center', marginBottom: 0 }}>
                    ✅ You've already applied to this job
                  </div>
                ) : (
                  <Link to={`/apply/${job._id}`} className="btn btn-primary w-full btn-lg" id="sidebar-apply-btn">
                    🚀 Apply Now
                  </Link>
                )
              )}

              {!user && (
                <Link to="/login" className="btn btn-primary w-full" id="sidebar-login-btn">
                  Sign In to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
