import React from 'react';

const STATUS_CONFIG = {
  Applied: { color: 'var(--status-applied)', bg: 'rgba(79,142,247,0.12)', label: 'Applied', icon: '📩' },
  'Under Review': { color: 'var(--status-review)', bg: 'rgba(245,158,11,0.12)', label: 'Under Review', icon: '🔍' },
  Shortlisted: { color: 'var(--status-shortlisted)', bg: 'rgba(139,92,246,0.12)', label: 'Shortlisted', icon: '⭐' },
  Rejected: { color: 'var(--status-rejected)', bg: 'rgba(239,68,68,0.12)', label: 'Rejected', icon: '✕' },
  Hired: { color: 'var(--status-hired)', bg: 'rgba(16,185,129,0.12)', label: 'Hired', icon: '🎉' },
};

export default function ApplicationStatusBadge({ status, size = 'default' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;
  const small = size === 'small';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: small ? '3px 8px' : '5px 12px',
        borderRadius: '9999px',
        fontSize: small ? '0.7rem' : '0.8rem',
        fontWeight: 700,
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}40`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ fontSize: small ? '0.65rem' : '0.75rem' }}>{config.icon}</span>
      {config.label}
    </span>
  );
}
