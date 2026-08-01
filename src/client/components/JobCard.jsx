import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
};

const getCompanyInitials = (name) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const employmentTypeColor = {
  'Full-time': 'badge-success',
  'Part-time': 'badge-warning',
  'Contract': 'badge-info',
  'Internship': 'badge-accent',
  'Remote': 'badge-primary',
  'Freelance': 'badge-warning',
};

export default function JobCard({ job, actions }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job-card card-glow" style={{ textDecoration: 'none' }}>
      {/* Header */}
      <div className="job-card-header">
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
          <div
            className="job-company-logo"
            style={{ background: `hsl(${(job.company.charCodeAt(0) * 37) % 360}, 60%, 50%)` }}
          >
            {getCompanyInitials(job.company)}
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company}</p>
          </div>
        </div>
        <span className={`badge ${employmentTypeColor[job.employmentType] || 'badge-primary'}`} style={{ flexShrink: 0 }}>
          {job.employmentType}
        </span>
      </div>

      {/* Meta */}
      <div className="job-meta">
        <span className="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {job.location}
        </span>
        {job.salary && job.salary !== 'Not specified' && (
          <span className="job-meta-item" style={{ color: 'var(--clr-success)', fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            {job.salary}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {job.skills.length > 4 && (
            <span className="skill-tag" style={{ color: 'var(--clr-text-muted)' }}>+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="job-footer">
        <span className="job-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          {formatDate(job.createdAt)}
        </span>
        {actions && (
          <div onClick={(e) => e.preventDefault()}>
            {actions}
          </div>
        )}
        {!actions && (
          <span style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 600 }}>
            View Details →
          </span>
        )}
      </div>
    </Link>
  );
}
