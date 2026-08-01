import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { useToast } from '../../components/Toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import ApplicationStatusBadge from '../../components/ApplicationStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function EmployerApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterJob, setFilterJob] = useState(searchParams.get('jobId') || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewingResume, setViewingResume] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const [appsData, jobsData] = await Promise.all([
        applicationService.getEmployerApplications(filterJob || null),
        jobService.getMyJobs(),
      ]);
      setApplications(appsData.applications || []);
      setJobs(jobsData.jobs || []);

      // Auto-select app from URL if provided
      const appId = searchParams.get('appId');
      if (appId) {
        const found = (appsData.applications || []).find((a) => a._id === appId);
        if (found) setSelectedApp(found);
      }
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [filterJob]);

  const handleStatusUpdate = async (appId, newStatus) => {
    setStatusUpdating(appId);
    try {
      const res = await applicationService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status: newStatus } : a));
      if (selectedApp?._id === appId) setSelectedApp((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleViewResume = (app) => {
    setViewingResume(app._id);
    const url = applicationService.getResumeUrl(app._id);
    const token = localStorage.getItem('jb_token');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch');
        return res.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
      })
      .catch(() => toast.error('Could not load resume. Please try again.'))
      .finally(() => setViewingResume(null));
  };

  const filtered = filterStatus
    ? applications.filter((a) => a.status === filterStatus)
    : applications;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Applications</h1>
        <p>{filtered.length} application{filtered.length !== 1 ? 's' : ''} {filterJob ? 'for selected job' : 'across all jobs'}</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <select
          className="form-control"
          style={{ maxWidth: '280px' }}
          value={filterJob}
          onChange={(e) => { setFilterJob(e.target.value); setSelectedApp(null); }}
          id="filter-job-select"
        >
          <option value="">All Jobs</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>{j.title}</option>
          ))}
        </select>

        <select
          className="form-control"
          style={{ maxWidth: '200px' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          id="filter-status-select"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {(filterJob || filterStatus) && (
          <button onClick={() => { setFilterJob(''); setFilterStatus(''); setSelectedApp(null); }} className="btn btn-secondary btn-sm" id="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 380px' : '1fr', gap: '24px' }}>
        {/* Applications list */}
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📬</div>
              <h3>No Applications Found</h3>
              <p>No applications match your current filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map((app) => (
                <div
                  key={app._id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedApp?._id === app._id ? 'var(--clr-primary)' : undefined,
                    background: selectedApp?._id === app._id ? 'rgba(79,142,247,0.05)' : undefined,
                    transition: 'all 200ms',
                  }}
                  onClick={() => setSelectedApp(app)}
                  id={`app-card-${app._id}`}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: `hsl(${((app.applicant?.name || 'A').charCodeAt(0) * 53) % 360}, 60%, 45%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1rem', color: '#fff', flexShrink: 0,
                    }}>
                      {(app.applicant?.name || 'A')[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '2px' }}>
                            {app.applicant?.name}
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)', marginBottom: '4px' }}>
                            {app.applicant?.email}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>
                            {app.job?.title} — {app.job?.company}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                          <ApplicationStatusBadge status={app.status} size="small" />
                          <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
                            {formatDate(app.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Detail Panel */}
        {selectedApp && (
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 24px)', height: 'fit-content' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Applicant Details</h3>
                <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-3)', fontSize: '1.2rem' }}>
                  ×
                </button>
              </div>

              {/* Applicant info */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: `hsl(${((selectedApp.applicant?.name || 'A').charCodeAt(0) * 53) % 360}, 60%, 45%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.25rem', color: '#fff', flexShrink: 0,
                }}>
                  {(selectedApp.applicant?.name || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedApp.applicant?.name}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-3)' }}>{selectedApp.applicant?.email}</p>
                </div>
              </div>

              <div className="divider" />

              {/* Job info */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', fontWeight: 700, marginBottom: '4px' }}>Applied For</p>
                <p style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{selectedApp.job?.title}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-3)' }}>{selectedApp.job?.company}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', fontWeight: 700, marginBottom: '4px' }}>Applied Date</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-2)' }}>{formatDate(selectedApp.createdAt)}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', fontWeight: 700, marginBottom: '8px' }}>Current Status</p>
                <ApplicationStatusBadge status={selectedApp.status} />
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', fontWeight: 700, marginBottom: '8px' }}>Cover Letter</p>
                  <div style={{ background: 'var(--clr-bg-2)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '0.85rem', color: 'var(--clr-text-2)', lineHeight: 1.7, maxHeight: '150px', overflowY: 'auto', borderLeft: '3px solid var(--clr-primary)' }}>
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              <div className="divider" />

              {/* Resume */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', fontWeight: 700, marginBottom: '8px' }}>Resume</p>
                <button
                  onClick={() => handleViewResume(selectedApp)}
                  className="btn btn-secondary w-full"
                  disabled={viewingResume === selectedApp._id}
                  id="view-resume-btn"
                >
                  {viewingResume === selectedApp._id ? (
                    <><div className="spinner spinner-sm" /> Loading...</>
                  ) : '📄 View / Download Resume'}
                </button>
              </div>

              {/* Status update */}
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', fontWeight: 700, marginBottom: '8px' }}>Update Status</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedApp._id, status)}
                      disabled={selectedApp.status === status || statusUpdating === selectedApp._id}
                      className={`btn btn-sm ${selectedApp.status === status ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'flex-start' }}
                      id={`status-${status.toLowerCase().replace(' ', '-')}-btn`}
                    >
                      {statusUpdating === selectedApp._id ? (
                        <div className="spinner spinner-sm" />
                      ) : (
                        <>
                          {selectedApp.status === status && '✓ '}
                          {status}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
