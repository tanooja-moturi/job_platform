import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useToast } from '../../components/Toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const toast = useToast();

  const fetchJobs = () => {
    setLoading(true);
    jobService.getMyJobs()
      .then((data) => setJobs(data.jobs || []))
      .catch(() => toast.error('Failed to load your jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchJobs, []);

  const handleDelete = async (jobId) => {
    setDeleting(jobId);
    try {
      await jobService.deleteJob(jobId);
      toast.success('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Jobs</h1>
          <p className="section-subtitle">{jobs.length} job listing{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/employer/post-job" className="btn btn-primary" id="post-new-job-btn">
          ➕ Post New Job
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No Jobs Posted</h3>
          <p>Create your first job listing to start receiving applications from qualified candidates.</p>
          <Link to="/employer/post-job" className="btn btn-primary" id="post-job-empty">Post Your First Job</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map((job) => (
            <div key={job._id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{job.title}</h3>
                  <span className={`badge ${job.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {job.isActive ? '● Active' : '○ Inactive'}
                  </span>
                  <span className="badge badge-primary">{job.employmentType}</span>
                </div>
                <p style={{ color: 'var(--clr-primary-light)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '8px' }}>
                  {job.company}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>📍 {job.location}</span>
                  {job.salary && job.salary !== 'Not specified' && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-success)', fontWeight: 600 }}>💰 {job.salary}</span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>📅 Posted {formatDate(job.createdAt)}</span>
                </div>
                {job.skills && job.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {job.skills.slice(0, 5).map((s) => <span key={s} className="skill-tag">{s}</span>)}
                    {job.skills.length > 5 && <span className="skill-tag">+{job.skills.length - 5}</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/jobs/${job._id}`} className="btn btn-ghost btn-sm" id={`view-job-${job._id}`}>
                    👁 View
                  </Link>
                  <Link to={`/employer/edit-job/${job._id}`} className="btn btn-secondary btn-sm" id={`edit-job-${job._id}`}>
                    ✏️ Edit
                  </Link>
                  <Link to={`/employer/applications?jobId=${job._id}`} className="btn btn-outline btn-sm" id={`view-apps-${job._id}`}>
                    📋 Applications
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setConfirmDelete(job._id)}
                    id={`delete-job-${job._id}`}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '16px' }}>⚠️</div>
            <h2 className="modal-title" style={{ textAlign: 'center' }}>Delete Job?</h2>
            <p style={{ color: 'var(--clr-text-3)', textAlign: 'center', marginBottom: '8px' }}>
              This action cannot be undone. Deleting this job will also remove all applications associated with it.
            </p>
            <div className="modal-actions">
              <button onClick={() => setConfirmDelete(null)} className="btn btn-secondary" id="cancel-delete-btn">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="btn btn-danger"
                disabled={deleting === confirmDelete}
                id="confirm-delete-btn"
              >
                {deleting === confirmDelete ? (
                  <><div className="spinner spinner-sm" /> Deleting...</>
                ) : 'Yes, Delete Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
