import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import MainLayout from '../layouts/MainLayout';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATS = [
  { value: '500+', label: 'Active Jobs', icon: '💼' },
  { value: '200+', label: 'Companies', icon: '🏢' },
  { value: '10K+', label: 'Job Seekers', icon: '👥' },
  { value: '95%', label: 'Success Rate', icon: '🎯' },
];

const CATEGORIES = [
  { name: 'Engineering', icon: '⚙️', count: 120 },
  { name: 'Design', icon: '🎨', count: 45 },
  { name: 'Marketing', icon: '📢', count: 38 },
  { name: 'Data Science', icon: '📊', count: 67 },
  { name: 'DevOps', icon: '☁️', count: 29 },
  { name: 'Product', icon: '🚀', count: 52 },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    jobService.getJobs({ limit: 6 })
      .then((data) => setFeaturedJobs(data.jobs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✨</span>
              <span>The #1 MERN Stack Job Platform</span>
            </div>

            <h1>
              Find Your <span className="text-gradient">Dream Job</span><br />
              Or Hire Top Talent
            </h1>

            <p>
              Connect with thousands of companies and job seekers. Whether you're looking to advance
              your career or grow your team — JobBoard makes it simple, fast, and effective.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
              <div className="search-input-wrapper" style={{ flex: 1 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job title, company, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.5rem', fontSize: '1rem', height: '52px' }}
                  id="hero-search"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" id="hero-search-btn" style={{ height: '52px', whiteSpace: 'nowrap' }}>
                Search Jobs
              </button>
            </form>

            {/* Quick links */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              {['React Developer', 'Node.js', 'MERN Stack', 'Remote', 'Internship'].map((term) => (
                <Link
                  key={term}
                  to={`/jobs?search=${encodeURIComponent(term)}`}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    color: 'var(--clr-text-2)',
                    transition: 'all 200ms',
                    textDecoration: 'none',
                  }}
                  className="nav-link"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: 'var(--space-12) 0', background: 'var(--clr-bg-2)', borderBottom: '1px solid var(--clr-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {STATS.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'var(--font-display)', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--clr-text-3)', fontSize: '0.9rem', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured <span className="text-gradient">Opportunities</span></h2>
              <p className="section-subtitle">Discover the latest job openings from top companies</p>
            </div>
            <Link to="/jobs" className="btn btn-outline">View All Jobs →</Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading featured jobs..." />
          ) : featuredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏗️</div>
              <h3>No Jobs Yet</h3>
              <p>Be the first to post a job or run the seed script to add sample data.</p>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          ) : (
            <div className="jobs-grid">
              {featuredJobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: 'var(--space-16) 0',
        background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(139,92,246,0.08))',
        borderTop: '1px solid var(--clr-border)',
        borderBottom: '1px solid var(--clr-border)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Job seeker CTA */}
            <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
              <h3 style={{ fontSize: '1.375rem', marginBottom: '12px' }}>Looking for a Job?</h3>
              <p style={{ color: 'var(--clr-text-3)', marginBottom: '24px', lineHeight: 1.7 }}>
                Create your profile, upload your resume, and apply to hundreds of jobs in minutes.
              </p>
              <Link to="/register" className="btn btn-primary w-full" id="seeker-cta">
                Create Job Seeker Account
              </Link>
            </div>

            {/* Employer CTA */}
            <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', background: 'linear-gradient(145deg, rgba(79,142,247,0.1), rgba(139,92,246,0.1))' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏢</div>
              <h3 style={{ fontSize: '1.375rem', marginBottom: '12px' }}>Hiring Talent?</h3>
              <p style={{ color: 'var(--clr-text-3)', marginBottom: '24px', lineHeight: 1.7 }}>
                Post job listings, review applications, and find the perfect candidate for your team.
              </p>
              <Link to="/register" className="btn btn-outline w-full" id="employer-cta">
                Post a Job Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
