import React, { useState, useEffect } from 'react';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'];

export default function JobForm({ initialData = {}, onSubmit, loading = false, submitLabel = 'Save Job' }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    employmentType: 'Full-time',
    salary: '',
    skills: '',
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        company: initialData.company || '',
        description: initialData.description || '',
        requirements: initialData.requirements || '',
        location: initialData.location || '',
        employmentType: initialData.employmentType || 'Full-time',
        salary: initialData.salary || '',
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || ''),
      });
    }
  }, [initialData.title]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Job title is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.description.trim()) errs.description = 'Job description is required';
    if (formData.description.trim().length < 50) errs.description = 'Description must be at least 50 characters';
    if (!formData.requirements.trim()) errs.requirements = 'Requirements are required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.employmentType) errs.employmentType = 'Employment type is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Title */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="job-title">Job Title <span className="required">*</span></label>
          <input
            id="job-title"
            name="title"
            type="text"
            className={`form-control ${errors.title ? 'error' : ''}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior React Developer"
            maxLength={150}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        {/* Company */}
        <div className="form-group">
          <label className="form-label" htmlFor="job-company">Company Name <span className="required">*</span></label>
          <input
            id="job-company"
            name="company"
            type="text"
            className={`form-control ${errors.company ? 'error' : ''}`}
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. TechCorp Solutions"
            maxLength={100}
          />
          {errors.company && <span className="form-error">{errors.company}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label" htmlFor="job-location">Location <span className="required">*</span></label>
          <input
            id="job-location"
            name="location"
            type="text"
            className={`form-control ${errors.location ? 'error' : ''}`}
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA or Remote"
          />
          {errors.location && <span className="form-error">{errors.location}</span>}
        </div>

        {/* Employment Type */}
        <div className="form-group">
          <label className="form-label" htmlFor="job-type">Employment Type <span className="required">*</span></label>
          <select
            id="job-type"
            name="employmentType"
            className={`form-control ${errors.employmentType ? 'error' : ''}`}
            value={formData.employmentType}
            onChange={handleChange}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.employmentType && <span className="form-error">{errors.employmentType}</span>}
        </div>

        {/* Salary */}
        <div className="form-group">
          <label className="form-label" htmlFor="job-salary">Salary / Range</label>
          <input
            id="job-salary"
            name="salary"
            type="text"
            className="form-control"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. $80,000 - $120,000 / year"
          />
          <span className="form-hint">Leave blank if not disclosing</span>
        </div>

        {/* Skills */}
        <div className="form-group">
          <label className="form-label" htmlFor="job-skills">Required Skills</label>
          <input
            id="job-skills"
            name="skills"
            type="text"
            className="form-control"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB (comma-separated)"
          />
          <span className="form-hint">Separate skills with commas</span>
        </div>

        {/* Description */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="job-description">Job Description <span className="required">*</span></label>
          <textarea
            id="job-description"
            name="description"
            className={`form-control ${errors.description ? 'error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and what makes it exciting..."
            rows={8}
            maxLength={5000}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {errors.description && <span className="form-error">{errors.description}</span>}
            <span className="form-hint" style={{ marginLeft: 'auto' }}>{formData.description.length}/5000</span>
          </div>
        </div>

        {/* Requirements */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="job-requirements">Requirements <span className="required">*</span></label>
          <textarea
            id="job-requirements"
            name="requirements"
            className={`form-control ${errors.requirements ? 'error' : ''}`}
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List the qualifications, experience, and skills required..."
            rows={6}
            maxLength={3000}
          />
          {errors.requirements && <span className="form-error">{errors.requirements}</span>}
          <span className="form-hint">Tip: Use bullet points for readability (e.g. - 3+ years of React experience)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="submit-job-form">
          {loading ? (
            <>
              <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
