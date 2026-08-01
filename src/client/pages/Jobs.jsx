import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services/jobService';
import MainLayout from '../layouts/MainLayout';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const EMPLOYMENT_TYPES = ['', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [skills, setSkills] = useState('');

  const fetchJobs = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 12 };
      if (search) params.search = search;
      if (location) params.location = location;
      if (employmentType) params.employmentType = employmentType;
      if (skills) params.skills = skills;

      const data = await jobService.getJobs(params);
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, location, employmentType, skills]);

  useEffect(() => {
    fetchJobs(1);
  }, []);

  // Sync search from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setEmploymentType('');
    setSkills('');
    setSearchParams({});
    jobService.getJobs({ page: 1, limit: 12 }).then((data) => {
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setPage(1);
      setPages(data.pages || 1);
    });
  };

  return (
    <MainLayout>
      <div style={{ background: 'var(--clr-bg-2)', borderBottom: '1px solid var(--clr-border)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '20px' }}>
            Browse <span className="text-gradient">All Jobs</span>
          </h1>

          {/* Search & Filters */}
          <form onSubmit={handleSearch}>
            <div className="search-filter-bar">
              {/* Search */}
              <div className="search-input-wrapper" style={{ flex: 2, minWidth: '250px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, company, or skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  id="jobs-search"
                />
              </div>

              {/* Location */}
              <div className="search-input-wrapper" style={{ flex: 1, minWidth: '160px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  id="jobs-location"
                />
              </div>

              {/* Employment type */}
              <select
                className="form-control filter-select"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                id="jobs-type"
              >
                <option value="">All Types</option>
                {EMPLOYMENT_TYPES.filter(Boolean).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Skills */}
              <input
                type="text"
                className="form-control filter-select"
                placeholder="Skills (e.g. React)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                id="jobs-skills"
              />

              <button type="submit" className="btn btn-primary" id="jobs-search-btn">Search</button>
              {(search || location || employmentType || skills) && (
                <button type="button" className="btn btn-secondary" onClick={handleReset} id="jobs-reset-btn">Clear</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {/* Results count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ color: 'var(--clr-text-3)', fontSize: '0.9rem' }}>
            {loading ? 'Searching...' : `${total} job${total !== 1 ? 's' : ''} found`}
          </p>
          {(search || location || employmentType || skills) && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {search && <span className="badge badge-primary">"{search}"</span>}
              {location && <span className="badge badge-accent">📍 {location}</span>}
              {employmentType && <span className="badge badge-success">{employmentType}</span>}
              {skills && <span className="badge badge-warning">🛠 {skills}</span>}
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner message="Searching for jobs..." />
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No Jobs Found</h3>
            <p>Try adjusting your search terms or filters to find more results.</p>
            <button onClick={handleReset} className="btn btn-secondary" id="no-results-reset">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => fetchJobs(page - 1)}
                  disabled={page <= 1}
                  id="pagination-prev"
                >
                  ←
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`pagination-btn ${p === page ? 'active' : ''}`}
                    onClick={() => fetchJobs(p)}
                    id={`pagination-page-${p}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => fetchJobs(page + 1)}
                  disabled={page >= pages}
                  id="pagination-next"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
