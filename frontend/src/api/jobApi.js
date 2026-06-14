import api from './axios';

export const getAllJobs = async () => {
  const response = await api.get('/job/jobs');
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/job/my-applications');
  return response.data;
};

export const applyForJob = async (jobId) => {
  const response = await api.post('/job/apply', { jobId });
  return response.data;
};

export const deleteApplication = async (applicationId) => {
  const response = await api.delete(`/job/${applicationId}`);
  return response.data;
};

export const toggleBlockJob = async (jobId) => {
  const response = await api.put(`/job/toggle-block/${jobId}`);
  return response.data;
};

export const getJobsByCompany = async (companyId) => {
  const response = await api.get(`/job/company/${companyId}`);
  return response.data;
};

export const getApplicationById = async (applicationId) => {
  const response = await api.get(`/job/application/${applicationId}`);
  return response.data;
};
