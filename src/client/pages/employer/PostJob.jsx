import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useToast } from '../../components/Toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import JobForm from '../../components/JobForm';

export default function PostJob() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (jobData) => {
    setLoading(true);
    try {
      await jobService.createJob(jobData);
      toast.success('Job posted successfully! 🎉');
      navigate('/employer/my-jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details below to create a new job listing. All fields marked with * are required.</p>
        </div>

        <div className="card">
          <JobForm onSubmit={handleSubmit} loading={loading} submitLabel="🚀 Post Job" />
        </div>
      </div>
    </DashboardLayout>
  );
}
