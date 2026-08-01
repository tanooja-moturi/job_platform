import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../components/Toast';
import MainLayout from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ApplyJob() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    jobService.getJobById(jobId)
      .then((data) => setJob(data.job))
      .catch(() => { toast.error('Job not found'); navigate('/jobs'); })
      .finally(() => setLoading(false));
  }, [jobId]);

  const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const MAX_SIZE_MB = 5;

  const validateFile = (file) => {
    if (!file) return 'Please upload your resume';
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext) || !ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only PDF, DOC, and DOCX files are accepted';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB`;
    }
    return '';
  };

  const handleFileChange = (file) => {
    const err = validateFile(file);
    setFileError(err);
    if (!err) setResume(file);
    else setResume(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { setFileError('Please upload your resume'); return; }
    const err = validateFile(resume);
    if (err) { setFileError(err); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('resume', resume);
      formData.append('coverLetter', coverLetter);

      await applicationService.applyToJob(formData);
      toast.success('Application submitted successfully! 🎉');
      navigate('/seeker/applications');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <MainLayout><LoadingSpinner fullPage /></MainLayout>;

  return (
    <MainLayout>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '760px' }}>
        <Link to={`/jobs/${jobId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--clr-text-3)', fontSize: '0.875rem', marginBottom: '24px', textDecoration: 'none' }}>
          ← Back to Job
        </Link>

        {/* Job Summary */}
        {job && (
          <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: `hsl(${(job.company.charCodeAt(0) * 37) % 360}, 60%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>
              {job.company.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>{job.title}</h2>
              <p style={{ color: 'var(--clr-primary-light)', fontWeight: 600, marginBottom: '8px' }}>{job.company}</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>📍 {job.location}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>⏰ {job.employmentType}</span>
                {job.salary && job.salary !== 'Not specified' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--clr-success)', fontWeight: 600 }}>💰 {job.salary}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="card">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Apply for this Position</h1>
          <p style={{ color: 'var(--clr-text-3)', marginBottom: '32px' }}>
            Fill out the form below. Your resume is required. Cover letter is optional but recommended.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Resume Upload */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Resume <span className="required">*</span></label>
              <div
                className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${fileError ? 'error' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{ borderColor: fileError ? 'var(--clr-danger)' : undefined }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                id="resume-upload-area"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  id="resume-file-input"
                />
                {resume ? (
                  <>
                    <div className="file-upload-icon">📄</div>
                    <p style={{ fontWeight: 700, color: 'var(--clr-success)', marginBottom: '4px' }}>{resume.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)' }}>
                      {(resume.size / 1024 / 1024).toFixed(2)} MB · Click to change
                    </p>
                  </>
                ) : (
                  <>
                    <div className="file-upload-icon">📁</div>
                    <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--clr-text-2)' }}>
                      Drag & drop your resume here, or click to browse
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                      Accepted: PDF, DOC, DOCX · Max size: 5MB
                    </p>
                  </>
                )}
              </div>
              {fileError && <span className="form-error">⚠️ {fileError}</span>}
            </div>

            {/* Cover Letter */}
            <div className="form-group">
              <label className="form-label" htmlFor="cover-letter">
                Cover Letter <span style={{ color: 'var(--clr-text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="cover-letter"
                className="form-control"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this role, your relevant experience, and what excites you about this opportunity..."
                rows={7}
                maxLength={2000}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span className="form-hint">{coverLetter.length}/2000</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
                id="submit-application-btn"
              >
                {submitting ? (
                  <><div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} /> Submitting...</>
                ) : '🚀 Submit Application'}
              </button>
              <Link to={`/jobs/${jobId}`} className="btn btn-secondary btn-lg">Cancel</Link>
            </div>
          </form>
        </div>

        {/* File upload guidelines */}
        <div className="card" style={{ marginTop: '16px', background: 'var(--clr-info-bg)', borderColor: 'rgba(6,182,212,0.3)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--clr-info)', marginBottom: '12px' }}>
            ℹ️ Resume Upload Guidelines
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'disc', paddingLeft: '16px' }}>
            {[
              'Accepted file types: PDF, DOC, DOCX',
              'Maximum file size: 5MB',
              'Your resume is stored securely on the server',
              'Only the employer and you can access your resume',
              'Resume is uploaded with a secure, unique filename',
            ].map((item) => (
              <li key={item} style={{ fontSize: '0.8rem', color: 'var(--clr-info)' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
