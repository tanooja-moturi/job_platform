import api from './api';

export const applicationService = {
  applyToJob: async (formData) => {
    const res = await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getMyApplications: async () => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  getEmployerApplications: async (jobId = null) => {
    const params = jobId ? { jobId } : {};
    const res = await api.get('/applications/employer', { params });
    return res.data;
  },

  updateApplicationStatus: async (id, status) => {
    const res = await api.put(`/applications/${id}/status`, { status });
    return res.data;
  },

  getApplicationById: async (id) => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },

  getResumeUrl: (id) => {
    const base = import.meta.env.VITE_API_URL || '/api';
    return `${base}/applications/${id}/resume`;
  },
};
