import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useToast } from '../../components/Toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import JobForm from '../../components/JobForm';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    jobService.getJobById(id)
      .then((data) => setJob(data.job))
      .catch(() => { toast.error('Job not found'); navigate('/employer/my-jobs'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (jobData) => {
    setSaving(true);
    try {
      await jobService.updateJob(id, jobData);
      toast.success('Job updated successfully!');
      navigate('/employer/my-jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1>Edit Job</h1>
          <p>Update the details of your job listing below.</p>
        </div>
        <div className="card">
          <JobForm
            initialData={job}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="💾 Save Changes"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
